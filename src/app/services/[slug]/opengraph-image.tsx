import { notFound } from "next/navigation";
import { services, getService } from "@/lib/services";
import {
  renderOgImage,
  ogSubtitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

// Prerendered alongside the pages themselves, from the same source list, so a
// new service in services.ts gets a share card without another edit here.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const alt = "Patchbay service";

// `params` is a Promise in this Next version, not a plain object. Awaiting it
// is required, not optional.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return renderOgImage({
    marker: `CH.${service.channel}`,
    title: service.name,
    subtitle: ogSubtitle(service.metaDescription),
  });
}
