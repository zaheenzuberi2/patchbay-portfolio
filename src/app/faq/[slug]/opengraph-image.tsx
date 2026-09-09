import { notFound } from "next/navigation";
import { faqCategoryPages, getFaqCategory } from "@/lib/faq-categories";
import {
  renderOgImage,
  ogSubtitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

// Prerendered from the same list the pages use, so a new FAQ category gets a
// share card without another edit here. Same arrangement as
// services/[slug]/opengraph-image.tsx.
export function generateStaticParams() {
  return faqCategoryPages.map((c) => ({ slug: c.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const alt = "Patchbay FAQ";

// `params` is a Promise in this Next version, not a plain object.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getFaqCategory(slug);
  if (!cat) notFound();

  return renderOgImage({
    marker: `FAQ / ${cat.faqs.length}`,
    title: cat.label,
    subtitle: ogSubtitle(cat.metaDescription),
  });
}
