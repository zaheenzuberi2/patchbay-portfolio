// Scores installed speechSynthesis voices to prefer higher-quality
// neural/premium engines over a platform's default robotic voice, when one
// is installed. This can only rank what the browser reports via
// getVoices() — there's no way to query actual audio fidelity, so this is
// name-pattern matching against known premium voice naming conventions
// (Chrome/Edge's "Online (Natural)" voices, macOS's enhanced voices,
// Google's neural voices), not a guarantee. On a machine with only basic
// default voices installed, it just returns the best of what's there.
const PREMIUM_NAME_HINTS = [
  "neural",
  "premium",
  "enhanced",
  "natural",
  "online",
  "studio",
  "samantha",
  "siri",
  "ava",
  "aria",
  "jenny",
  "guy",
  "google us english",
  "google uk english",
  "google",
];

export function scoreVoice(
  voice: SpeechSynthesisVoice,
  wantLangPrefix: string,
): number {
  let score = 0;
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();

  if (lang.startsWith(wantLangPrefix)) score += 100;
  else if (lang.slice(0, 2) === wantLangPrefix.slice(0, 2)) score += 40;

  for (const hint of PREMIUM_NAME_HINTS) {
    if (name.includes(hint)) {
      score += 20;
      break; // don't stack multiple hints matching the same voice
    }
  }

  // A remote/"online" neural voice is usually the highest fidelity when
  // available, but local voices load instantly with no network dependency.
  // Slight tie-breaker toward local so a flaky connection doesn't cause a
  // multi-second stall before the first word.
  if (voice.localService) score += 3;

  return score;
}

export function pickBestVoice(
  voices: SpeechSynthesisVoice[],
  wantLangPrefix: string,
): SpeechSynthesisVoice | undefined {
  const inLang = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(wantLangPrefix),
  );
  const pool = inLang.length > 0 ? inLang : voices;
  if (pool.length === 0) return undefined;

  return [...pool].sort(
    (a, b) => scoreVoice(b, wantLangPrefix) - scoreVoice(a, wantLangPrefix),
  )[0];
}
