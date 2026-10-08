import { buildProsodySegments } from "./prosody";
import { pickBestVoice } from "./voice-selection";

// A lighter-weight, one-off version of the same prosody-queue technique
// VoiceDemo.tsx uses for full conversations (see prosody.ts for why this
// exists instead of a single utterance: no SSML support in the Web Speech
// API). No generation/cancellation tracking here since this is only ever
// used for a single standalone line (the proactive greeting), not a
// back-and-forth conversation that might need to interrupt itself.
export function speakOnce(
  text: string,
  options?: { onStart?: () => void; onEnd?: () => void },
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options?.onEnd?.();
    return;
  }

  const segments = buildProsodySegments(text);
  const voice = pickBestVoice(window.speechSynthesis.getVoices(), "en");
  let started = false;

  function next(index: number) {
    if (index >= segments.length) {
      options?.onEnd?.();
      return;
    }
    const seg = segments[index];
    const utterance = new SpeechSynthesisUtterance(seg.text);
    utterance.lang = "en-US";
    if (voice) utterance.voice = voice;
    utterance.rate = Math.min(2, Math.max(0.5, seg.rateMul));
    utterance.pitch = Math.min(2, Math.max(0, seg.pitchMul));
    utterance.onstart = () => {
      if (!started) {
        started = true;
        options?.onStart?.();
      }
    };
    utterance.onerror = () => options?.onEnd?.();
    utterance.onend = () => {
      window.setTimeout(() => next(index + 1), seg.pauseAfterMs);
    };
    window.speechSynthesis.speak(utterance);
  }

  next(0);
}
