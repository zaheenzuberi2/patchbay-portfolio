import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { listReviews, type ReviewRow } from "@/lib/db";

// One @graph in the root layout describing the entities that exist on every
// page: the person, the business, the website, and the service catalog.
// Page-specific schema (Service, FAQPage, BreadcrumbList) is emitted by the
// page that owns it, and refers back to these by @id.
export async function StructuredData() {
  // aggregateRating and review both have to live as properties on the
  // ProfessionalService node itself for Google to show a star-rating
  // snippet, not as a separately linked node — an @id reference from a
  // different script tag only works for relationships between nodes, it
  // does not merge properties into a node defined elsewhere. That is why
  // this lives here, in the one place the business entity itself is
  // defined, rather than in Reviews.tsx where the data is fetched again for
  // display.
  //
  // Same resilience contract as Work.tsx and Reviews.tsx: this component
  // renders on every page including ones a database blip must never break,
  // so a failed query just omits the rating fields rather than throwing.
  // An empty table also omits them rather than a fabricated placeholder,
  // matching Reviews.tsx exactly, since the table starts empty on purpose.
  //
  // Genuine customer reviews about your own business are exactly what
  // Google's review-snippet guidelines permit self-serving markup for; the
  // restriction is on reviews that are not genuinely about your own
  // organization, not on real client testimonials.
  let reviews: ReviewRow[] = [];
  try {
    reviews = await listReviews();
  } catch (err) {
    console.error(
      "[StructuredData] could not load reviews, omitting rating schema:",
      err,
    );
  }

  const ratingSchema =
    reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue:
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.client_name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.quote,
            datePublished: new Date(r.created_at).toISOString().slice(0, 10),
          })),
        }
      : {};

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
        ...ratingSchema,
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
