// Structural prosody for the Web Speech API. There is no SSML support in
// standard browser speechSynthesis, and SpeechSynthesisUtterance.rate /
// .pitch are fixed for the whole utterance — there's no way to insert a
// literal pause or ramp pitch mid-utterance. The only real lever is
// splitting text into smaller utterances queued back to back with a timed
// silent gap between them, each with its own rate/pitch. This builds that
// segment plan; VoiceDemo.tsx does the actual sequential speaking.

export type ProsodySegment = {
  text: string;
  pauseAfterMs: number;
  rateMul: number;
  pitchMul: number;
};

// The default browser TTS rate (1.0) is calibrated for accessibility and
// clarity, not naturalness, and reads as noticeably flat/robotic on most
// platforms' non-neural voices — a widely-documented Web Speech API
// characteristic, not something specific to this codebase. Applying a
// modest across-the-board speed-up is a common fix; the segment-level
// rateMul below is a small multiplier ON TOP of this, not an absolute
// rate, so it needs an actual base to multiply against (see VoiceDemo.tsx,
// where the previous code used rateMul directly as the rate, silently
// discarding any base tuning). This value is a heuristic starting point,
// not something verified by ear here — worth adjusting after listening.
export const BASE_RATE = 1.08;

const QUESTION_END = /[؟?]\s*$/;
const EXCLAIM_END = /!\s*$/;
const ELLIPSIS_END = /(\.\.\.|…)\s*$/;
// Urdu sentences end in ۔ (Urdu full stop) as often as a Latin period.
const SENTENCE_SPLIT = /[^.!?؟۔…]+(?:[.!?؟۔…]+|$)/g;

function jitter(spread: number) {
  return 1 + (Math.random() * 2 - 1) * spread;
}

export function buildProsodySegments(text: string): ProsodySegment[] {
  const sentences = text.match(SENTENCE_SPLIT) ?? [text];
  const segments: ProsodySegment[] = [];

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;

    const isQuestion = QUESTION_END.test(sentence);
    const isExclaim = EXCLAIM_END.test(sentence);
    const isEllipsis = ELLIPSIS_END.test(sentence);

    // Commas read as a short breath, not a full stop: split the sentence
    // on them and give each clause a brief pause, keeping the comma in the
    // spoken text (better cadence than stripping it).
    const clauses = sentence.split(/,\s*/);

    clauses.forEach((clause, i) => {
      const isLastClause = i === clauses.length - 1;
      const text = isLastClause ? clause : `${clause},`;
      if (!text.trim()) return;

      segments.push({
        text: text.trim(),
        // Each of these queues a brand-new SpeechSynthesisUtterance, and
        // Chrome/Edge have a well-known extra startup delay (well over
        // 100ms in practice) before audio actually starts on every new
        // utterance, on top of whatever pause is requested here. A comma
        // clause used to ask for 110ms and silently got ~150-300ms+ more on
        // top of that from the platform itself, compounding into the
        // stuttery "gaps" complaint on any sentence with a few commas.
        // Sentence-end pauses keep their deliberate weight since a real
        // pause there is expected; the comma pause is cut hard since it's
        // riding on unavoidable overhead already, not lengthening it.
        pauseAfterMs: isLastClause
          ? isEllipsis
            ? 420 * jitter(0.25)
            : 230 * jitter(0.3)
          : 40 * jitter(0.35),
        // Slightly faster on an exciting/exclaiming line, slightly slower
        // trailing into an ellipsis (a "thinking" beat), tiny random
        // per-segment jitter on top so back-to-back replies don't all
        // sound metronomically identical.
        rateMul: (isExclaim ? 1.07 : isEllipsis ? 0.93 : 1) * jitter(0.04),
        // Pitch lifts slightly on the final clause of a question, the
        // classic upward inflection that reads as "asking" rather than
        // "stating".
        pitchMul: (isLastClause && isQuestion ? 1.09 : 1) * jitter(0.03),
      });
    });
  }

  return segments.length
    ? segments
    : [{ text, pauseAfterMs: 0, rateMul: 1, pitchMul: 1 }];
}
