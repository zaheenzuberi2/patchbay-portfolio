"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ShapeKind } from "@/lib/section-theme";
import { buildShapeGeometry } from "./shapes";

// One shape's own visuals: edges + node dots, plus its own entrance/exit
// animation. Multiple layers can be mounted at once during a transition so
// the outgoing shape can shrink/fade out while the incoming one grows/fades
// in, rather than popping between them.
function ShapeLayer({
  shape,
  isActive,
  animateIn,
  color,
  radius,
  opacity,
  reduced,
  onExited,
}: {
  shape: ShapeKind;
  isActive: boolean;
  animateIn: boolean;
  color: string;
  radius: number;
  opacity: number;
  reduced: boolean;
  onExited: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(animateIn ? 0 : 1);
  const exiting = useRef(false);
  const exitProgress = useRef(0);
  const targetColor = useRef(new THREE.Color(color));

  const { edges, vertices } = useMemo(
    () => buildShapeGeometry(shape, radius),
    [shape, radius],
  );

  // Created once, mutated via .lerp/.opacity in useFrame rather than
  // recreated on every color change, so the color transition stays smooth
  // instead of snapping.
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: animateIn ? 0 : opacity,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const vertexMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: animateIn ? 0 : opacity,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!isActive) exiting.current = true;
  }, [isActive]);

  // Dispose GPU resources when this layer's geometry changes or it unmounts,
  // since a long session can cycle through many section changes.
  useEffect(() => {
    return () => {
      edges.dispose();
      lineMaterial.dispose();
      vertexMaterial.dispose();
    };
  }, [edges, lineMaterial, vertexMaterial]);

  /* eslint-disable react-hooks/immutability -- react-three-fiber's whole
     animation model is imperative: mutate materials/refs every frame inside
     useFrame rather than recreate them. That is the documented, correct
     pattern here, not a bug this React-Compiler-oriented rule is designed
     to catch. */
  useFrame((_, delta) => {
    if (!group.current) return;
    const dur = reduced ? 0.001 : 0.65;

    targetColor.current.set(color);
    lineMaterial.color.lerp(targetColor.current, 0.05);
    vertexMaterial.color.lerp(targetColor.current, 0.05);

    if (exiting.current) {
      exitProgress.current = Math.min(1, exitProgress.current + delta / dur);
      const t = 1 - exitProgress.current;
      group.current.scale.setScalar(t);
      group.current.rotation.y -= delta * 0.5;
      lineMaterial.opacity = opacity * t;
      vertexMaterial.opacity = opacity * t;
      if (exitProgress.current >= 1) onExited();
      return;
    }

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / dur);
      const eased = 1 - Math.pow(1 - progress.current, 3);
      group.current.scale.setScalar(eased);
      group.current.rotation.y = (1 - eased) * Math.PI * 0.6;
      lineMaterial.opacity = opacity * eased;
      vertexMaterial.opacity = opacity * eased;
    } else {
      group.current.scale.setScalar(1);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <group ref={group}>
      <lineSegments geometry={edges} material={lineMaterial} />
      {vertices.map((v, i) => (
        <mesh key={i} position={v} material={vertexMaterial}>
          <sphereGeometry args={[radius * 0.025, 10, 10]} />
        </mesh>
      ))}
    </group>
  );
}

// A stylized geometric wireframe that morphs between the five Platonic
// solids as the active section changes, drawn as edges only with a node dot
// at every vertex (echoing the "channel node" motif used elsewhere). Unlit
// line geometry rather than a lit material: a lit shape is only as visible
// as its lighting setup happens to land, which proved unreliable; a flat
// line is always exactly as visible as its own color. Cursor parallax and
// the slow idle spin live on the outer group so they carry across shape
// changes; each ShapeLayer only animates its own transition in/out.
export function WireframeShape({
  reduced,
  restX = 0,
  restY = 0,
  radius = 1.5,
  opacity = 0.85,
  parallax = 0.3,
  color = "#ff5a1f",
  shape = "icosahedron",
}: {
  reduced: boolean;
  restX?: number;
  restY?: number;
  radius?: number;
  opacity?: number;
  parallax?: number;
  color?: string;
  shape?: ShapeKind;
}) {
  const outer = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector2(0, 0));
  const nextId = useRef(1);
  const [layers, setLayers] = useState<{ id: number; shape: ShapeKind }[]>([
    { id: 0, shape },
  ]);

  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.length - 1].shape === shape) return prev;
      return [...prev, { id: nextId.current++, shape }];
    });
  }, [shape]);

  function removeLayer(id: number) {
    setLayers((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  useFrame((state, delta) => {
    if (!outer.current) return;

    if (!reduced) {
      target.current.lerp(state.pointer, 0.05);
      outer.current.rotation.y += delta * 0.09;
    }
    outer.current.rotation.x = THREE.MathUtils.lerp(
      outer.current.rotation.x,
      -target.current.y * 0.25,
      0.05,
    );
    outer.current.rotation.z = THREE.MathUtils.lerp(
      outer.current.rotation.z,
      target.current.x * 0.1,
      0.05,
    );
    outer.current.position.x = THREE.MathUtils.lerp(
      outer.current.position.x,
      restX + target.current.x * parallax,
      0.04,
    );
    outer.current.position.y = THREE.MathUtils.lerp(
      outer.current.position.y,
      restY + target.current.y * parallax * 0.8,
      0.04,
    );
  });

  return (
    <group ref={outer} position={[restX, restY, 0]}>
      {layers.map((layer, i) => (
        <ShapeLayer
          key={layer.id}
          shape={layer.shape}
          isActive={i === layers.length - 1}
          animateIn={layer.id !== 0}
          color={color}
          radius={radius}
          opacity={opacity}
          reduced={reduced}
          onExited={() => removeLayer(layer.id)}
        />
      ))}
    </group>
  );
}
