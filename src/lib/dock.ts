// The three floating controls (WhatsApp, chat, voice) share one right-hand
// column. Chat and voice both open a panel in the same spot, so they tell
// each other when they open and the other one steps aside.
export type DockWho = "chat" | "voice";
const EVENT = "patchbay:dock";

export function announceDock(who: DockWho, open: boolean) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { who, open } }));
}

export function onDock(cb: (who: DockWho, open: boolean) => void) {
  const handler = (e: Event) => {
    const d = (e as CustomEvent<{ who: DockWho; open: boolean }>).detail;
    cb(d.who, d.open);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
