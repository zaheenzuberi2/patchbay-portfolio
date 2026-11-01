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

// A "Try the voice demo" button anywhere on the site asks the launcher to open
// the voice panel. Opening is just a request; the microphone still waits for
// the visitor to tap Start talking inside the panel.
const OPEN_VOICE = "patchbay:voice-open";
export function requestVoiceOpen() {
  window.dispatchEvent(new Event(OPEN_VOICE));
}
export function onVoiceOpenRequest(cb: () => void) {
  window.addEventListener(OPEN_VOICE, cb);
  return () => window.removeEventListener(OPEN_VOICE, cb);
}
