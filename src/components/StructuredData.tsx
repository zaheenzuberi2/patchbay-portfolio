import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";

// One @graph in the root layout describing the entities that exist on every
// page: the person, the business, the website, and the service catalog.
// Page-specific schema (Service, FAQPage, BreadcrumbList) is emitted by the
// page that owns it, and refers back to these by @id.
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.ownerName,
        alternateName: "Zaheen",
        jobTitle: "Founder and Full-Stack Developer",
        url: siteConfig.url,
        image: `${siteConfig.url}/zaheen.jpg`,
        worksFor: { "@id": `${siteConfig.url}/#business` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Islamabad",
          addressCountry: "PK",
        },
        knowsAbout: [
          "AI automation",
          "AI voice agents",
          "Chatbot development",
          "Business process automation",
          "Full-stack website development",
          "Next.js",
          "Social media management",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.name,
        alternateName: `${siteConfig.ownerName} | ${siteConfig.name}`,
        founder: { "@id": `${siteConfig.url}/#person` },
        url: siteConfig.url,
        image: `${siteConfig.url}/opengraph-image`,
        logo: `${siteConfig.url}/logo-mark.png`,
        description: siteConfig.description,
        email: siteConfig.contactEmail,
        telephone: siteConfig.contactPhoneDisplay,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Islamabad",
          addressCountry: "PK",
        },
        areaServed: [
          { "@type": "Country", name: "Pakistan" },
          { "@type": "Place", name: "Worldwide" },
        ],
        priceRange: "$$",
        knowsLanguage: ["en", "ur"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.metaDescription,
              url: `${siteConfig.url}/services/${s.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#business` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
