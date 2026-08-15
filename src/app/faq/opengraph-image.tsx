import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Frequently asked questions about working with Patchbay";

export default async function Image() {
  return renderOgImage({
    marker: "FAQ",
    title: "Questions, answered straight.",
    subtitle:
      "What things cost, how long they take, what you actually get, and what happens after launch.",
  });
}
