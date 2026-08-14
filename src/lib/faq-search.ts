import type { ServiceFaq } from "./services";
import { services } from "./services";
import { allFaqsFlat } from "./all-faqs";
import { homeFaqs } from "./home-faqs";

// Same source of truth as /faq and every service page: no separate content
// is written for the chat widget, it just searches the real, already-vetted
// FAQ library. Deterministic keyword scoring, not an AI model, matching the
// widget's existing no-API-key, no-ongoing-cost design (see ChatWidget.tsx).
const POOL: ServiceFaq[] = [
  ...homeFaqs,
  ...allFaqsFlat,
  ...services.flatMap((s) => s.faqs),
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "and", "or", "but", "if", "so", "to", "of", "in", "on", "at", "for",
  "with", "about", "as", "by", "from", "this", "that", "it", "its",
  "you", "your", "i", "me", "my", "we", "our", "do", "does", "did",
  "can", "could", "will", "would", "should", "what", "how", "why",
  "when", "where", "who", "which", "not", "just", "get", "have",
  "has", "had", "any", "all", "there",
]);

// Cheap plural stemming, not a real stemmer. Without it "discount" in a
// visitor's question never matches "discounts" in the FAQ's own wording,
// which meant a real question (about nonprofit discounts) fell through
// unmatched and got stored as literal lead data instead of being answered
// — the same failure mode as an unrecognized objection.
function normalize(word: string): string {
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9']+/g)
      ?.filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .map(normalize) ?? []
  );
}

const QUESTION_START =
  /^(how|what|why|when|where|who|which|can|do|does|is|are|will|could|would|should)\b/;

// Only intercept things that actually read as questions, so ordinary
// answers to "what's your name?" etc. never get misrouted into FAQ search.
export function looksLikeQuestion(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (v.length < 4) return false;
  return v.endsWith("?") || QUESTION_START.test(v);
}

export function findFaqAnswer(query: string): ServiceFaq | null {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;

  let best: ServiceFaq | null = null;
  let bestScore = 0;
  let bestOverlap = 0;

  for (const faq of POOL) {
    const qWords = tokenize(faq.q);
    // Require overlap with the FAQ's OWN question wording first. Scoring
    // purely off shared words in the (much longer) answer body let generic
    // words like "like" or "today" rack up points against unrelated
    // answers ("weather" matched a pricing FAQ this way in testing), so an
    // off-topic question needs to actually resemble a real question here,
    // not just share incidental vocabulary with some answer somewhere.
    const overlap = qTokens.filter((t) => qWords.includes(t));
    if (overlap.length === 0) continue;

    const aWords = tokenize(faq.a);
    let score = overlap.length * 2;
    for (const t of qTokens) {
      if (!qWords.includes(t) && aWords.includes(t)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestOverlap = overlap.length;
      best = faq;
    }
  }

  // The overlap>=1 requirement above is what actually stops an off-topic
  // question (nothing shares any word with the real FAQ wording) matching
  // something unrelated. This ratio is a secondary sanity check, not the
  // primary guard, so it can stay looser than 0.5 to catch more real
  // questions phrased differently from the FAQ's own wording.
  const overlapRatio = bestOverlap / qTokens.length;
  return bestOverlap >= 1 && overlapRatio >= 0.4 ? best : null;
}
