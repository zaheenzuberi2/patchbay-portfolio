"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { BackgroundErrorBoundary } from "./BackgroundErrorBoundary";
import { useActiveSection } from "./useActiveSection";

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
  const { color: sectionColor, shape: sectionShape } = useActiveSection();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above the state declarations
    setReduced(motion.matches);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    setAllowed(!(coarse && small));

    const onMotionChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    motion.addEventListener("change", onMotionChange);

    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Admin is a utility tool, not a marketing surface: no ambient background.
  if (pathname?.startsWith("/admin")) return null;
  if (!allowed) return null;

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
