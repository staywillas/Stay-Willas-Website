/**
 * Centralized Schema.org JSON-LD Structured Data Generators for Stay Willas
 * Follows Google Search Central structured data guidelines and schema.org standards.
 */

export const BASE_URL = "https://www.staywillas.com";

// 1. Organization Entity (Stay Willas main brand)
export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Stay Willas",
  alternateName: ["StayWillas", "Stay Willas Luxury Collection"],
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  image: `${BASE_URL}/images/hero-villa.webp`,
  description: "Stay Willas is a premier luxury villa rental and hospitality brand in Maharashtra, specializing in verified private pool villas and mountain retreats in Lonavala and Khopoli.",
  telephone: "+91-9619042310",
  email: "bookings@staywillas.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kim Cottage, 14, PR Kadam Marg, Maneklal Estate, Ghatkopar West",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400084",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/staywillas",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9619042310",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
};

// 2. WebSite Entity
export const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Stay Willas",
  alternateName: "StayWillas",
  description: "Handpicked luxury villas with private pool, in-house chefs, and scenic mountain views across Maharashtra.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/villas?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// 3. BreadcrumbList Generator
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

// 4. FAQPage Generator
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// 5. Villa / VacationRental Property Schema Generator
export interface PropertySchemaInput {
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number | string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: Array<{ name: string; [key: string]: any }>;
  reviews?: Array<{
    id?: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt?: Date | string;
  }>;
}

const VILLA_COORDINATES: Record<string, { lat: number; lng: number; street: string; locality: string }> = {
  "the-angle-house": {
    lat: 18.7687773,
    lng: 73.5685498,
    street: "Kamshet",
    locality: "Lonavala",
  },
  "canopy-crest": {
    lat: 18.7857,
    lng: 73.3444,
    street: "Near Adlabs Imagicaa",
    locality: "Khopoli",
  },
  "willow-peak": {
    lat: 18.7490,
    lng: 73.4070,
    street: "Kurwande",
    locality: "Lonavala",
  },
  "terra-cotta-villa": {
    lat: 17.9237,
    lng: 73.7438,
    street: "Kaswand, Panchgani-Mahabaleshwar Road",
    locality: "Panchgani",
  },
};

export function generatePropertySchema(villa: PropertySchemaInput) {
  const propertyUrl = `${BASE_URL}/villa/${villa.slug}`;
  const coords = VILLA_COORDINATES[villa.slug] || {
    lat: 18.7557,
    lng: 73.4091,
    street: villa.location,
    locality: villa.location.split(",")[0].trim(),
  };

  const formattedImages = (villa.images || []).map((img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`
  );

  const genuineReviews = villa.reviews || [];
  const reviewCount = genuineReviews.length;
  const avgRating = reviewCount > 0
    ? Number((genuineReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : 5.0;

  const numericPrice = typeof villa.price === "string" ? parseInt(villa.price.replace(/[^\d]/g, ""), 10) : villa.price;

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    additionalType: "https://schema.org/VacationRental",
    "@id": `${propertyUrl}#property`,
    name: villa.name,
    description: villa.description,
    image: formattedImages,
    url: propertyUrl,
    telephone: "+91-9619042310",
    priceRange: `₹${(numericPrice || 0).toLocaleString("en-IN")}/night`,
    address: {
      "@type": "PostalAddress",
      streetAddress: coords.street,
      addressLocality: coords.locality,
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: coords.lat,
      longitude: coords.lng,
    },
    numberOfRooms: villa.bedrooms,
    numberOfBedrooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    maximumAttendeeCapacity: villa.guests,
    occupancy: {
      "@type": "QuantitativeValue",
      value: villa.guests,
    },
    amenityFeature: (villa.amenities || []).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
      value: true,
    })),
    brand: {
      "@id": `${BASE_URL}/#organization`,
    },
    parentOrganization: {
      "@id": `${BASE_URL}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: numericPrice || 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: propertyUrl,
      validFrom: "2026-01-01",
      seller: {
        "@id": `${BASE_URL}/#organization`,
      },
    },
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
          review: genuineReviews.map((r) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.userName,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.comment,
            ...(r.createdAt
              ? { datePublished: new Date(r.createdAt).toISOString().split("T")[0] }
              : {}),
          })),
        }
      : {}),
  };
}

// 6. Destination / Collection Page Schema Generator
export interface DestinationSchemaInput {
  regionSlug: string;
  regionName: string;
  title: string;
  description: string;
  villas: Array<{
    id?: string;
    slug?: string;
    name: string;
    location: string;
    image?: string;
    price: number | string;
    bedrooms: number;
    guests: number;
  }>;
}

export function generateDestinationCollectionSchema(input: DestinationSchemaInput) {
  const pageUrl = `${BASE_URL}/areas/${input.regionSlug}`;
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: input.title,
        description: input.description,
        isPartOf: {
          "@id": `${BASE_URL}/#website`,
        },
        about: {
          "@type": "Place",
          name: input.regionName,
          address: {
            "@type": "PostalAddress",
            addressLocality: input.regionName,
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: `Luxury Private Pool Villas in ${input.regionName}`,
        numberOfItems: input.villas.length,
        itemListElement: input.villas.map((v, idx) => {
          const villaSlug = v.slug || v.id || "";
          const villaUrl = `${BASE_URL}/villa/${villaSlug}`;
          const rawPrice = typeof v.price === "string" ? parseInt(v.price.replace(/[^\d]/g, ""), 10) : v.price;
          
          return {
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "VacationRental",
              name: v.name,
              url: villaUrl,
              ...(v.image
                ? { image: v.image.startsWith("http") ? v.image : `${BASE_URL}${v.image}` }
                : {}),
              priceRange: `₹${(rawPrice || 0).toLocaleString("en-IN")}/night`,
              address: {
                "@type": "PostalAddress",
                addressLocality: v.location || input.regionName,
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              numberOfRooms: v.bedrooms,
              occupancy: {
                "@type": "QuantitativeValue",
                value: v.guests,
              },
            },
          };
        }),
      },
    ],
  };
}

// 7. Homepage Google Sitelinks (SiteNavigationElement Schema)
export const HOMEPAGE_SITELINKS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${BASE_URL}/#sitelinks`,
  name: "Stay Willas Quick Sitelinks",
  description: "Official sitelinks for Stay Willas private luxury pool villas across Maharashtra.",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "Lonavala Villa Pool",
      description: "Top villas in Lonavala with private pool. What makes The Angle House one of the top villas with private pool.",
      url: `${BASE_URL}/villas-in-lonavala-with-private-pool`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "Luxury Villas in Khopoli",
      description: "Canopy Crest. Escape to a stunning nature sanctuary with mountain views and five-star hospitality.",
      url: `${BASE_URL}/areas/khopoli`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Luxury Villas Near Mumbai",
      description: "Browse our handpicked collection of luxury villas for rent near Mumbai, Lonavala, and Khopoli.",
      url: `${BASE_URL}/villas`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "About",
      description: "Learn about Stay Willas, our story, values, and curation process across Maharashtra.",
      url: `${BASE_URL}/about`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 5,
      name: "Villa Destinations in Maharashtra",
      description: "Q: How do I book an exclusive stay through Stay Willas? Explore Lonavala, Khopoli and Mahabaleshwar.",
      url: `${BASE_URL}/destinations`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 6,
      name: "Luxury Villa Experiences",
      description: "We are carefully planning wonderful experiences for your stay. Curated dining, celebrations, and retreats.",
      url: `${BASE_URL}/experiences`,
    },
  ],
};
