export type ShapeKind =
  | "tetrahedron"
  | "cube"
  | "octahedron"
  | "dodecahedron"
  | "icosahedron";

// Per-section ambient accent and 3D wireframe shape, shared by the CSS glow
// baked into each section and the desktop wireframe (so both systems agree
// without needing to talk to each other). Colors stay inside the existing
// brand family: signal-amber, its warm variants, the site's online-green,
// and the suit-green already established for About. No new hues. Shapes
// cycle through the five Platonic solids, each with a small, clean vertex
// set the wireframe can draw both as edges and as node dots.
export const SECTION_THEME: Record<string, { color: string; shape: ShapeKind }> = {
  top: { color: "#ff5a1f", shape: "icosahedron" },
  channels: { color: "#ff8a3f", shape: "octahedron" },
  work: { color: "#6fcf7a", shape: "dodecahedron" },
  reviews: { color: "#6fcf7a", shape: "icosahedron" },
  about: { color: "#3f5a45", shape: "cube" },
  team: { color: "#ff8a3f", shape: "dodecahedron" },
  milestones: { color: "#ff5a1f", shape: "tetrahedron" },
  faq: { color: "#ff8a3f", shape: "octahedron" },
  contact: { color: "#6fcf7a", shape: "icosahedron" },
};

export const DEFAULT_ACCENT = "#ff5a1f";
export const DEFAULT_SHAPE: ShapeKind = "icosahedron";

// Back-compat map for the CSS SectionGlow components, which only need color.
export const SECTION_ACCENTS: Record<string, string> = Object.fromEntries(
  Object.entries(SECTION_THEME).map(([id, v]) => [id, v.color]),
);
