// In-memory per-IP sliding-window limiter, extracted from /api/assistant so
// the text and voice paths share one implementation. Same honest caveat as
// /api/leads: serverless instances do not share memory, so this is a
// speed bump against scripts, not a hard global ceiling. The hard backstop
// for spend is the Gemini key's own quota (see HANDOFF).

type Store = typeof globalThis & {
  __patchbayRateLimits?: Map<string, Map<string, number[]>>;
};

export function createRateLimiter(name: string, limit: number, windowMs: number) {
  const root = globalThis as Store;
  if (!root.__patchbayRateLimits) root.__patchbayRateLimits = new Map();
  if (!root.__patchbayRateLimits.has(name)) {
    root.__patchbayRateLimits.set(name, new Map());
  }
  const hits = root.__patchbayRateLimits.get(name)!;

  return function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      hits.set(ip, recent);
      return true;
    }

    recent.push(now);
    hits.set(ip, recent);

    if (hits.size > 5000) {
      for (const [key, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(key);
      }
    }
    return false;
  };
}
