"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { announceDock, onDock, onVoiceOpenRequest } from "@/lib/dock";

// Only this button ships in the main bundle. The panel (speech recognition,
// speech synthesis, the transcript UI) is a separate chunk fetched on the
// first tap or hover, the same idea VoiceDemoLazy used. ssr:false is safe
// because every API the panel touches is browser-only.
const VoicePanel = dynamic(() => import("./VoicePanel"), { ssr: false });
const preload = () => import("./VoicePanel");

// Right-hand column, bottom to top: WhatsApp, chat, voice. Measured from the
// existing buttons: WhatsApp 44px at bottom 16 (56px at 24 from sm), chat at
// 72 (96 from sm). Voice sits 20px above chat on phones and 32px above on sm+, clear of the chat bob.
export function VoiceLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => onDock((who, isOpen) => {
    if (who === "chat") {
      setChatOpen(isOpen);
      if (isOpen) setOpen(false);
    }
  }), []);

  // "Try the voice demo" buttons elsewhere on the site ask for the panel.
  useEffect(() => {
    const off = onVoiceOpenRequest(() => {
      setChatOpen(false);
      setOpen(true);
    });
    return off;
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    announceDock("voice", open);
    // Hand focus back to the launcher after the panel closes.
    if (wasOpen.current && !open) button.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/u/")) return null;

  return (
    <>
      <div
        className={`fixed bottom-[136px] right-4 z-40 sm:bottom-[184px] sm:right-6 ${
          open || chatOpen ? "hidden" : ""
        }`}
      >
        <button
          ref={button}
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={preload}
          onFocus={preload}
          aria-label="Talk to the Patchbay voice assistant"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-ink-3 text-signal shadow-[0_8px_24px_rgba(0,0,0,0.25)] outline-none transition-transform motion-safe:hover:scale-105 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:h-14 sm:w-14"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
      </div>
      {open && <VoicePanel onClose={close} />}
    </>
  );
}
