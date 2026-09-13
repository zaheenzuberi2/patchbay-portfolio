import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import {
  renderOgImage,
  ogSubtitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

// Prerendered alongside the pages themselves, from the same source list, so a
// new case study in case-studies.ts gets a share card without another edit
// here. Mirrors services/[slug]/opengraph-image.tsx exactly.
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const alt = "Patchbay case study";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return renderOgImage({
    marker: `SESSION ${study.sessionId}`,
    title: study.name,
    subtitle: ogSubtitle(study.metaDescription),
  });
}
