import * as THREE from "three";
import type { ShapeKind } from "@/lib/section-theme";

// Builds a Platonic solid as edges-only geometry plus its deduplicated
// vertex list (for the node dots). All five shapes have a small, clean
// vertex count, so both the wireframe and the dots stay crisp instead of
// turning into a dense mesh the way a smoothly curved shape would.
export function buildShapeGeometry(shape: ShapeKind, radius: number) {
  let geo: THREE.BufferGeometry;
  switch (shape) {
    case "tetrahedron":
      geo = new THREE.TetrahedronGeometry(radius * 1.15, 0);
      break;
    case "cube":
      geo = new THREE.BoxGeometry(
        radius * 1.25,
        radius * 1.25,
        radius * 1.25,
      );
      break;
    case "octahedron":
      geo = new THREE.OctahedronGeometry(radius, 0);
      break;
    case "dodecahedron":
      geo = new THREE.DodecahedronGeometry(radius * 0.85, 0);
      break;
    case "icosahedron":
    default:
      geo = new THREE.IcosahedronGeometry(radius, 0);
      break;
  }

  const edges = new THREE.EdgesGeometry(geo);
  const pos = geo.getAttribute("position");
  const seen = new Set<string>();
  const vertices: [number, number, number][] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
    if (!seen.has(key)) {
      seen.add(key);
      vertices.push([x, y, z]);
    }
  }
  geo.dispose();

  return { edges, vertices };
}
