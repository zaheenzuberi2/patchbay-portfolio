/**
 * A spoken conversation with Gemini Live, straight from the browser. Ported
 * from the Habro Estate assistant (habro-site/components/liveVoice.ts), same
 * engine, English only.
 *
 * The microphone streams to Gemini as it is recorded, Gemini decides when the
 * visitor has stopped, and the spoken answer streams back and starts playing
 * while it is still being produced: about a second after the question ends.
 * The older recognise-then-answer-then-speak chain took many seconds per turn.
 *
 * The browser never holds a key. /api/assistant/live hands it a one-use token
 * with the model, the voice, the instructions and the expiry locked inside, so
 * all this file can do with it is have a time-limited conversation.
 */

const SOCKET =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

const SETUP_MS = 7_000;
/** After the visitor has finished, how long to wait for the first sound. */
const ANSWER_MS = 12_000;

export type LiveEvents = {
  /** The first sound of the answer has arrived. */
  speaking(): void;
  /** The model has finished a turn: what was heard and what it said. */
  turn(heard: string, said: string): void;
  /** The last sound has played. */
  idle(): void;
  /** Something went wrong. `spoke` is true if an answer had already begun. */
  failed(reason: string, spoke: boolean): void;
  /** Hands-free only: nobody has spoken for a while and the microphone was let go. */
  paused?(): void;
  /** Hands-free only: the visitor spoke over the answer and it was cut off. */
  interrupted?(): void;
};

type AC = typeof AudioContext;
const audioContext = (): AC => window.AudioContext || (window as unknown as { webkitAudioContext: AC }).webkitAudioContext;

function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...Array.from(bytes.subarray(i, i + 0x8000)));
  return btoa(s);
}

function fromBase64(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

export function liveSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof WebSocket !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext)
  );
}

export class LiveSession {
  private ws?: WebSocket;
  private ready = false;
  private dead = false;

  private readonly ctxIn: AudioContext;
  private readonly ctxOut: AudioContext;
  private mic?: MediaStream;
  private node?: ScriptProcessorNode;
  private source?: MediaStreamAudioSourceNode;
  private mute?: GainNode;
  private capturing = false;
  /** Audio recorded before the socket was ready, sent the moment it is. */
  private waiting: string[] = [];

  private next = 0;
  private playing = new Set<AudioBufferSourceNode>();

  private heard = "";
  private said = "";
  private spoke = false;
  /** Has this conversation ever been answered? Only a conversation that never
      was has failed; one that ran and then ended is just over. */
  private everSpoke = false;
  private generated = false;
  private watchdog = 0;
  /** The visitor has finished and the answer has not begun. */
  private awaiting = false;
  private reported = false;
  /** Hands-free: audio is not sent while the page is speaking (it would hear
      itself), while the visitor has muted, or while something else holds it. */
  private muted = false;
  private held = false;
  private gateUntil = 0;
  private quiet = 0;
  /** Speaking over the answer: how long the voice has been loud, how loud the
      speaker's own echo usually is, and the last few blocks, kept so the start of
      the interruption is not lost. */
  private loud = 0;
  private echo = 0;
  private recent: string[] = [];
  /** How loud the room is when nobody is talking, learned as it goes: it falls
      quickly to a quiet moment and rises only slowly, so a voice is never
      mistaken for the room. */
  private floor = 0.004;
  /** Blocks of real audio still to send after the last speech-like block, so the
      end of a word is not clipped. */
  private tail = 0;
  private inbox: Promise<void> = Promise.resolve();

  /** Must be created inside the tap that starts the recording: a phone only
      lets audio start from a gesture, and a context made later stays silent. */
  constructor(
    private readonly ev: LiveEvents,
    /** The conversation is set up in one language and keeps it. */
    readonly lang: "en" | "ur" | "ru" = "en",
    /** Hands-free: the microphone stays open between questions instead of
        closing at the first sound of the answer. */
    private readonly continuous = false,
  ) {
    const Ctx = audioContext();
    this.ctxIn = new Ctx();
    this.ctxOut = new Ctx();
    void this.ctxIn.resume();
    void this.ctxOut.resume();
  }

  get alive() {
    return !this.dead;
  }
  get listening() {
    return this.capturing;
  }

  /** Asks the server for a token and opens the conversation. */
  private async connect(): Promise<void> {
    const res = await fetch("/api/assistant/live", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: this.lang }),
    });
    if (!res.ok) throw new Error(`token ${res.status}`);
    const { token } = (await res.json()) as { token?: string };
    if (!token) throw new Error("no token");

    await new Promise<void>((ok, bad) => {
      const ws = new WebSocket(`${SOCKET}?access_token=${encodeURIComponent(token)}`);
      this.ws = ws;
      const timer = window.setTimeout(() => bad(new Error("setup timeout")), SETUP_MS);
      ws.onopen = () => ws.send(JSON.stringify({ setup: {} }));
      ws.onmessage = (e) => {
        this.inbox = this.inbox.then(async () => {
          const raw = typeof e.data === "string" ? e.data : await (e.data as Blob).text();
          this.handle(raw, () => {
            window.clearTimeout(timer);
            ok();
          });
        });
      };
      ws.onerror = () => {
        window.clearTimeout(timer);
        bad(new Error("socket"));
      };
      ws.onclose = (e) => {
        window.clearTimeout(timer);
        this.closed(e.code);
        bad(new Error(`closed ${e.code}`));
      };
    });
  }

  /** The visitor taps the microphone: start recording, and start the connection
      alongside it if there is not one, so the two setups overlap. */
  async begin(): Promise<void> {
    void this.ctxIn.resume();
    void this.ctxOut.resume();
    this.heard = "";
    this.said = "";
    this.spoke = false;
    this.generated = false;
    this.awaiting = false;
    window.clearTimeout(this.watchdog);

    const connecting = this.ready && this.ws?.readyState === WebSocket.OPEN ? Promise.resolve() : this.connect();
    // A failed connection is reported once, from here, and not as a second
    // rejection nobody is waiting on.
    connecting.catch((e: Error) => this.fail(e.message));

    this.mic = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    });
    this.record();
  }

  private record() {
    if (!this.mic) return;
    const ratio = this.ctxIn.sampleRate / 16_000;
    this.source = this.ctxIn.createMediaStreamSource(this.mic);
    this.node = this.ctxIn.createScriptProcessor(2048, 1, 1);
    // A processor only runs if it is wired to the output, so it is wired to a
    // gain of zero: the visitor does not hear themselves.
    this.mute = this.ctxIn.createGain();
    this.mute.gain.value = 0;
    this.source.connect(this.node);
    this.node.connect(this.mute);
    this.mute.connect(this.ctxIn.destination);

    this.node.onaudioprocess = (e) => {
      if (!this.capturing) return;
      if (this.muted || this.held) return;
      const f = e.inputBuffer.getChannelData(0);
      const n = Math.floor(f.length / ratio);
      const pcm = new Int16Array(n);
      let energy = 0;
      for (let j = 0; j < n; j++) {
        const a = Math.floor(j * ratio);
        const b = Math.max(a + 1, Math.floor((j + 1) * ratio));
        let sum = 0;
        for (let i = a; i < b && i < f.length; i++) sum += f[i];
        const v = Math.max(-1, Math.min(1, sum / (b - a)));
        energy += v * v;
        pcm[j] = v < 0 ? v * 0x8000 : v * 0x7fff;
      }
      const chunk = toBase64(new Uint8Array(pcm.buffer));

      // While the answer plays (and for a moment after) nothing is sent, because
      // the microphone would hear the speaker. The one exception is the visitor
      // talking over it: a voice that is well above the speaker's own echo, for
      // a few blocks running, cuts the answer off and opens the line.
      if (this.continuous && (this.playing.size > 0 || performance.now() < this.gateUntil)) {
        const rms = Math.sqrt(energy / Math.max(1, n));
        this.recent.push(chunk);
        if (this.recent.length > 8) this.recent.shift();
        if (this.playing.size > 0) {
          this.loud = rms > Math.max(0.06, this.echo * 3, this.floor * 6) ? this.loud + 1 : 0;
          this.echo = this.echo * 0.92 + rms * 0.08;
          if (this.loud >= 3) this.interrupt();
        }
        return;
      }
      this.loud = 0;
      this.echo = 0;
      this.recent = [];

      // Open line. Only what sounds like a voice is sent as it is; the rest of
      // the room (a fan, traffic, a TV in the next room) is sent as silence, so
      // the server's own speech detection is not fooled by it.
      const rms = Math.sqrt(energy / Math.max(1, n));
      this.floor = rms < this.floor ? rms * 0.5 + this.floor * 0.5 : this.floor * 0.998 + rms * 0.002;
      const voice = rms > Math.max(0.012, this.floor * 3);
      if (voice) this.tail = 10;
      if (voice || this.tail > 0) {
        if (!voice) this.tail -= 1;
        this.send(chunk);
      } else {
        this.send(toBase64(new Uint8Array(n * 2)));
      }
    };
    this.capturing = true;
    this.armQuiet();
  }

  /** Hands-free: a minute without a word lets the microphone go. */
  private armQuiet() {
    window.clearTimeout(this.quiet);
    if (!this.continuous) return;
    this.quiet = window.setTimeout(() => {
      this.stopRecording();
      this.ev.paused?.();
    }, 60_000);
  }

  get listeningNow() {
    return this.capturing && !this.muted;
  }
  get isMuted() {
    return this.muted;
  }

  /** The visitor spoke over the answer: stop it at once, send what they have said
      so far, and from here on send everything. The server hears the speech and
      stops generating on its own. */
  private interrupt() {
    this.stopPlayback();
    this.gateUntil = 0;
    this.generated = false;
    this.spoke = false;
    const back = this.recent;
    this.recent = [];
    this.loud = 0;
    this.echo = 0;
    for (const chunk of back) this.send(chunk);
    this.armQuiet();
    this.ev.interrupted?.();
  }

  /** Something else is speaking (the greeting): do not listen until it is done. */
  hold(on: boolean) {
    this.held = on;
    if (!on) this.gateUntil = performance.now() + 350;
  }

  setMuted(on: boolean) {
    this.muted = on;
    if (!on) this.armQuiet();
  }

  private send(chunk: string) {
    if (this.ready && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ realtimeInput: { audio: { data: chunk, mimeType: "audio/pcm;rate=16000" } } }));
    } else {
      this.waiting.push(chunk);
    }
  }

  /** The visitor taps again, or the answer began: stop recording. A tap tells
      the server the audio is over so it answers at once. */
  stopRecording(tapped = false) {
    window.clearTimeout(this.quiet);
    if (!this.capturing) return;
    this.capturing = false;
    this.node?.disconnect();
    this.source?.disconnect();
    this.mute?.disconnect();
    this.node = this.source = this.mute = undefined;
    this.mic?.getTracks().forEach((t) => t.stop());
    this.mic = undefined;
    if (tapped) {
      this.awaiting = true;
      if (this.ready && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
      }
      // Nothing back at all means the connection is not going to answer.
      this.watchdog = window.setTimeout(() => {
        if (!this.spoke) this.fail("no answer");
      }, ANSWER_MS);
    }
  }

  /** The visitor cuts the answer off. */
  stopPlayback() {
    this.playing.forEach((s) => {
      s.onended = null;
      try {
        s.stop();
      } catch {
        /* already finished */
      }
    });
    this.playing.clear();
    this.next = 0;
  }

  close() {
    this.dead = true;
    window.clearTimeout(this.watchdog);
    window.clearTimeout(this.quiet);
    this.stopRecording();
    this.stopPlayback();
    try {
      this.ws?.close();
    } catch {
      /* closed already */
    }
    void this.ctxIn.close().catch(() => undefined);
    void this.ctxOut.close().catch(() => undefined);
  }

  /* ---- what comes back --------------------------------------------------- */

  private handle(raw: string, opened: () => void) {
    let m: {
      setupComplete?: unknown;
      error?: unknown;
      serverContent?: {
        modelTurn?: { parts?: { inlineData?: { data?: string } }[] };
        inputTranscription?: { text?: string };
        outputTranscription?: { text?: string };
        interrupted?: boolean;
        turnComplete?: boolean;
      };
    };
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }

    if (m.error) return this.fail("server error");

    if (m.setupComplete) {
      this.ready = true;
      for (const c of this.waiting) this.send(c);
      this.waiting = [];
      opened();
      return;
    }

    const sc = m.serverContent;
    if (!sc) return;
    if (sc.inputTranscription?.text) {
      this.heard += sc.inputTranscription.text;
      this.armQuiet();
    }
    if (sc.outputTranscription?.text) this.said += sc.outputTranscription.text;

    for (const p of sc.modelTurn?.parts ?? []) {
      if (p.inlineData?.data) this.play(fromBase64(p.inlineData.data));
    }
    if (sc.interrupted) this.stopPlayback();

    if (sc.turnComplete) {
      this.generated = true;
      this.ev.turn(this.heard.trim(), this.said.trim());
      this.heard = "";
      this.said = "";
      if (this.playing.size === 0) this.ev.idle();
    }
  }

  /** Raw 24 kHz samples, queued so each chunk starts exactly where the last
      one ends. */
  private play(bytes: Uint8Array) {
    if (!this.spoke) {
      this.spoke = true;
      this.everSpoke = true;
      this.awaiting = false;
      window.clearTimeout(this.watchdog);
      // The answer has begun, so the microphone is let go: it would only hear
      // the speaker. Hands-free keeps it open and simply sends nothing while
      // the answer plays.
      if (!this.continuous) this.stopRecording();
      this.ev.speaking();
    }
    const samples = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    if (!samples.length) return;
    const buf = this.ctxOut.createBuffer(1, samples.length, 24_000);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < samples.length; i++) ch[i] = samples[i] / 0x8000;
    const src = this.ctxOut.createBufferSource();
    src.buffer = buf;
    src.connect(this.ctxOut.destination);
    const at = Math.max(this.ctxOut.currentTime + 0.02, this.next);
    src.start(at);
    this.next = at + buf.duration;
    this.playing.add(src);
    src.onended = () => {
      this.playing.delete(src);
      if (this.playing.size === 0) this.gateUntil = performance.now() + 400;
      if (this.playing.size === 0 && this.generated) {
        this.generated = false;
        this.spoke = false;
        this.ev.idle();
      }
    };
  }

  private closed(code: number) {
    const wasLive = !this.dead;
    this.dead = true;
    this.ready = false;
    window.clearTimeout(this.watchdog);
    // A conversation that ran for a while and then ended is just over: the next
    // tap opens a new one. Only a close before any answer is a failure.
    if (wasLive && !this.everSpoke && (this.capturing || this.awaiting)) this.fail(`closed ${code}`);
  }

  private fail(reason: string) {
    if (this.reported) return;
    this.reported = true;
    const spoke = this.everSpoke;
    this.stopRecording();
    this.close();
    this.ev.failed(reason, spoke);
  }
}
