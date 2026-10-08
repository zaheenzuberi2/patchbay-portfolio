import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Services: AI chatbots, automation, websites, and social";

export default async function Image() {
  return renderOgImage({
    marker: "SERVICES",
    title: "Six channels, one board.",
    subtitle:
      "Chatbots, automation, full-stack builds, brand and social. One accountable team instead of three suppliers.",
  });
}
