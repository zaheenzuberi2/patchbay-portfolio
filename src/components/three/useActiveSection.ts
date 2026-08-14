"use client";

import { useEffect, useState } from "react";
import {
  SECTION_THEME,
  DEFAULT_ACCENT,
  DEFAULT_SHAPE,
  type ShapeKind,
} from "@/lib/section-theme";

// Tracks which section is most centered in the viewport and returns its
// accent color and wireframe shape, so the desktop 3D background can track
// the same per-section theme the CSS SectionGlow already renders. rootMargin
// biases toward whichever section owns the vertical middle of the screen, so
// two adjacent sections both being partially visible does not cause flicker.
export function useActiveSection() {
  const [theme, setTheme] = useState<{ color: string; shape: ShapeKind }>({
    color: DEFAULT_ACCENT,
    shape: DEFAULT_SHAPE,
  });

  useEffect(() => {
    const ids = Object.keys(SECTION_THEME);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setTheme(
            SECTION_THEME[visible.target.id] ?? {
              color: DEFAULT_ACCENT,
              shape: DEFAULT_SHAPE,
            },
          );
        }
      },
      { threshold: [0.15, 0.3, 0.5, 0.7], rootMargin: "-15% 0px -15% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return theme;
}
