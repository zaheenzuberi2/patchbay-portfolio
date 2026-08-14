"use client";

import { Component, type ReactNode } from "react";

// A failed WebGL/three.js mount must not crash the page, but it must not
// fail silently either: without this, a broken background and an
// intentionally hidden one (mobile, reduced motion, /admin) look identical
// from the outside.
export class BackgroundErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(
      "[SiteBackground] failed to mount, hiding site background:",
      error,
    );
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
