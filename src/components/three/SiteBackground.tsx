"use client";

import { Canvas } from "@react-three/fiber";
import { WireframeShape } from "./WireframeShape";
import type { ShapeKind } from "@/lib/section-theme";

// Centered in the viewport: it is the site's one persistent visual anchor
// as you scroll, present behind every section rather than tucked in a
// corner. Kept at a restrained opacity and radius, since centered means it
// now sits directly behind dense body copy on every section (not just the
// hero, which has its own protective scrims), not off in the empty margin.
export default function SiteBackground({
  reduced = false,
  color = "#ff5a1f",
  shape = "icosahedron",
}: {
  reduced?: boolean;
  color?: string;
  shape?: ShapeKind;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ background: "transparent" }}
    >
      <WireframeShape
        reduced={reduced}
        restX={0}
        restY={0}
        radius={1.35}
        opacity={0.14}
        parallax={0.18}
        color={color}
        shape={shape}
      />
    </Canvas>
  );
}
