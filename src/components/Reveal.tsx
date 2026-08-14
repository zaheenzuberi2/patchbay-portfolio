"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale" | "blur";

// Start states per variant. Everything animates to the same resting state, so
// mixing variants down a page still feels like one system.
const FROM: Record<Variant, string> = {
  up: "translateY(22px)",
  left: "translateX(-26px)",
  right: "translateX(26px)",
  scale: "scale(0.94)",
  blur: "translateY(14px)",
};

export function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Must default to false (not read from matchMedia in a lazy initializer):
  // the server always renders `false`, and if the client's first render
  // read the real value instead, a desktop visitor with the OS preference
  // on would render `true` on the client while the server rendered `false`,
  // failing hydration. Read the real value in an effect, after hydration
  // has already matched the server output once.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above the state declaration
    setReduced(motion.matches);

    const node = ref.current;
    if (!node) return;

    // Reduced motion still reveals the content, just without the travel.
    if (motion.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden = !visible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? FROM[variant] : "none",
        filter: hidden && variant === "blur" ? "blur(10px)" : "blur(0px)",
        transition: reduced
          ? "none"
          : "opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: hidden ? "opacity, transform" : "auto",
      }}
    >
      {children}
    </div>
  );
}
