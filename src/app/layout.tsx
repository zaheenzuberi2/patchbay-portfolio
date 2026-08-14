import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteBackgroundMount } from "@/components/three/SiteBackgroundMount";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.ownerName, url: siteConfig.url }],
  creator: siteConfig.ownerName,
  icons: {
    icon: "/icon.png",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  // og:image and twitter:image are injected automatically from
  // app/opengraph-image.tsx (Next's file convention), which resolves the
  // absolute URL from the serving host. Do not also list images here: the
  // convention supersedes it and the duplicate just drifts out of sync.
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <StructuredData />
        <SiteBackgroundMount />
        {/*
          THESIS: Zaheen leads the whole agency — Patchbay is what he calls the
          practice. One accountable team (Zaheen plus specialists in design, copy,
          SEO, and dev), every channel a marketing agency runs plus the AI/dev
          systems most agencies still outsource.
          OWN-WORLD: Broadcast console / telephone switchboard. Near-black canvas,
          one warm signal-amber accent, flip-card channel strips, floaty live
          panels, mono status readouts.
          STORY: Visitor learns who's behind the work (19, self-taught, cricket +
          his father's company shaped how he operates), sees real proof (Umer
          Wazir, Tryvoicely), and opens a channel.
          FIRST VIEWPORT: Fixed console nav with logo mark; hero headline woven
          around his name, live signal-bar meter, channel ticker, two actions.
          FORM: Console/switchboard direction, extended for v2 (flip cards, floaty
          motion, photo) per explicit brief.
          FINISH: unreviewed and undocumented is unfinished; this build ends with
          the finish review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
