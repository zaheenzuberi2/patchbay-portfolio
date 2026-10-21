export type UaeSector = {
  name: string;
  calls: string;
  // Slug of an existing /ai-receptionist-for/[niche] page, when one fits.
  nicheSlug?: string;
  // Or a direct path, for pages outside that route.
  href?: string;
};

export type UaeCity = {
  slug: "dubai" | "abu-dhabi";
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  market: string;
  sectors: UaeSector[];
  // One paragraph per service, written for this city, not shared.
  services: { name: string; href: string; body: string }[];
  rules: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};
