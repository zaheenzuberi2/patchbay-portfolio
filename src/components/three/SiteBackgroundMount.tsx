"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { BackgroundErrorBoundary } from "./BackgroundErrorBoundary";
import { useActiveSection } from "./useActiveSection";
import { getStoredTheme, type Theme } from "@/lib/theme";

// three.js never ships in the server bundle or blocks first paint; skipped
// entirely on phones (the cursor-follow is the whole point and doesn't
// exist on touch, and running a WebGL loop on every mobile pageview for
// pure ambience is a real battery cost); respects prefers-reduced-motion
// instead of just hiding; pauses when the tab itself is backgrounded.
const SiteBackground = dynamic(() => import("./SiteBackground"), {
  ssr: false,
});

export function SiteBackgroundMount() {
  const pathname = usePathname();
  // Both must default to values that match what the server rendered (false),
  // not read `window`/matchMedia directly in a lazy initializer: the server
  // has no `window`, so a client that computed the real value on its first
  // render would disagree with the server's HTML and fail hydration. Read
  // the real values in an effect, after hydration has already matched once.
  const [allowed, setAllowed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  // Defaults "dark" to match the server (no localStorage there); corrected
  // in the effect below, same default-then-effect pattern as `allowed`.
  const [theme, setTheme] = useState<Theme>("dark");
  const { color: sectionColor, shape: sectionShape } = useActiveSection();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above the state declarations
    setReduced(motion.matches);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    setAllowed(!(coarse && small));

    setTheme(getStoredTheme());

    const onMotionChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    motion.addEventListener("change", onMotionChange);

    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // ThemeToggle.tsx dispatches this on click rather than reaching into a
    // shared context, so this needs to listen rather than just read once.
    const onThemeChange = (e: Event) => {
      setTheme((e as CustomEvent<Theme>).detail);
    };
    window.addEventListener("patchbay:theme", onThemeChange);

    return () => {
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("patchbay:theme", onThemeChange);
    };
  }, []);

  // Admin is a utility tool, not a marketing surface: no ambient background.
  if (pathname?.startsWith("/admin")) return null;
  if (!allowed) return null;
  // The wireframe's palette (SECTION_THEME in lib/section-theme.ts) is tuned
  // for a near-black canvas; on a light background the same colors would
  // either wash out or clash rather than read as the intended console
  // aesthetic. Hiding it is the same judgment call already made for mobile:
  // this is ambience, not core content, so the safe default is off rather
  // than a mismatched wireframe on a canvas it was never designed for.
  if (theme === "light") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {tabVisible && (
        <BackgroundErrorBoundary>
          <SiteBackground
            reduced={reduced}
            color={sectionColor}
            shape={sectionShape}
          />
        </BackgroundErrorBoundary>
      )}
    </div>
  );
}
