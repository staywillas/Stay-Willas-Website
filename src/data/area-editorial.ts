import type { Metadata } from "next";

export type AreaSlug = "lonavala" | "panchgani" | "khopoli";
type AreaCopy = {
  name: string;
  title: string;
  description: string;
  summary: string;
  hero: {
    src: string;
    alt: string;
    caption: string;
    items: { src: string; alt: string; title: string; subtitle: string }[];
  };
  featuredSlug: string;
  collectionTitle: string;
  collectionIntro: string;
  introTitle: string;
  intro: string[];
  planning: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

export const areaEditorial: Record<AreaSlug, AreaCopy> = {
  lonavala: {
    name: "Lonavala",
    title: "Villas in Lonavala with Private Pool & Jacuzzi | Stay Willas",
    description:
      "Explore Lonavala private pool villas and Jacuzzi cottages. Save 26% on eligible Monday–Thursday stays with Stayw26. Check dates and book direct.",
    summary:
      "Private pool villas and Jacuzzi cottages in the hills, for weekends at your own pace.",
    hero: {
      src: "/assets/villas/the-angle-house/gallery-11.webp",
      alt: "Glass-fronted exterior of The Angle House in Kamshet, Lonavala",
      caption: "The Angle House · Kamshet, Lonavala",
      items: [
        {
          src: "/assets/villas/the-angle-house/gallery-1.webp",
          alt: "The Angle House private pool beside the glass-fronted villa",
          title: "Poolside at The Angle House",
          subtitle: "Private pool · Kamshet",
        },
        {
          src: "/assets/villas/the-angle-house/gallery-13.webp",
          alt: "Private waterfall pool at The Angle House",
          title: "Poolside days",
          subtitle: "Private pool villa",
        },
        {
          src: "/assets/villas/the-angle-house/gallery-7.webp",
          alt: "The Angle House bedroom opening onto its private balcony",
          title: "A private balcony",
          subtitle: "Bedroom and sit-out",
        },
        {
          src: "/assets/villas/the-angle-house/gallery-6.webp",
          alt: "One of the bedrooms at The Angle House",
          title: "Room to recharge",
          subtitle: "A calm bedroom",
        },
        {
          src: "/assets/villas/the-angle-house/gallery-11.webp",
          alt: "The Angle House exterior glowing at dusk in Kamshet",
          title: "Golden-hour views",
          subtitle: "The Angle House · Kamshet",
        },
      ],
    },
    featuredSlug: "the-angle-house",
    collectionTitle: "Poolside weekends. Cottage escapes.",
    collectionIntro:
      "Choose a private pool villa in Lonavala for your group, or an A-frame cottage with a Jacuzzi for a smaller getaway.",
    introTitle: "Find your own corner of the hills.",
    intro: [
      "A Lonavala villa stay can be a weekend with friends, a family gathering or a quiet trip for two. The right home depends on who is coming and how you want to spend your time.",
      "The Angle House is a three-bedroom private pool villa in Kamshet. Willow Peak in Kurwande offers Breeze, Crest and Heaven: three A-frame cottages with an in-room Jacuzzi each. Book a cottage for up to four guests or the entire estate for up to twelve. Willow Peak has Jacuzzis rather than a swimming pool.",
    ],
    planning: [
      {
        title: "For the whole group",
        text: "Compare the bedroom layout, guest limit and shared spaces. The Angle House has a private waterfall pool and a Jacuzzi in the master suite.",
      },
      {
        title: "For a couple's getaway",
        text: "Explore Willow Peak's timber-lined cottages, private Jacuzzis and sit-outs. Choose your cottage and check the rate for your dates.",
      },
      {
        title: "For a little exploring",
        text: "Use your property's exact map pin to plan Lonavala and Khandala outings. Kamshet and Kurwande are different bases, so compare the drive before deciding.",
      },
    ],
    faqs: [
      {
        question: "Which Lonavala property has a private pool?",
        answer:
          "The Angle House in Kamshet has a private waterfall swimming pool reserved for your group, plus a Jacuzzi in the master suite. Willow Peak's cottages each have a private in-room Jacuzzi; they are not swimming-pool villas.",
      },
      {
        question: "Can I book a cottage in Lonavala for a couple?",
        answer:
          "Yes. Breeze, Crest and Heaven at Willow Peak can be booked individually. Each accommodates up to four guests and has a bedroom, attached bathroom, private Jacuzzi and sit-out. Confirm the selected cottage and date-specific quote before booking.",
      },
      {
        question: "Can we book all three Willow Peak cottages together?",
        answer:
          "Yes. The entire estate option includes Breeze, Crest and Heaven for a group of up to twelve guests. Individual and whole-estate bookings share availability, so use the property calendar to check your dates.",
      },
      {
        question: "Are pets allowed at these Lonavala stays?",
        answer:
          "Discuss your pet with the booking team before confirming. Check the selected property's pet rules and any applicable conditions, and let the team know the number and size of pets joining you.",
      },
    ],
  },
  panchgani: {
    name: "Panchgani",
    title: "Villas in Panchgani with Private Pool | Stay Willas",
    description:
      "Book Casa De Reva, a private pool villa in Panchgani. Save 26% on eligible Monday–Thursday stays with Stayw26. Check dates and group rates.",
    summary:
      "A private pool, hillside views and room for your favourite people in Kaswand, Panchgani.",
    hero: {
      src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
      alt: "Casa De Reva villa and its hillside setting in Kaswand, Panchgani",
      caption: "Casa De Reva · Kaswand, Panchgani",
      items: [
        {
          src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
          alt: "Casa De Reva with its private pool in Kaswand",
          title: "Casa De Reva",
          subtitle: "Kaswand · Panchgani",
        },
        {
          src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0045.jpg",
          alt: "Casa De Reva's pool and fire-pit area after sunset",
          title: "Slow evenings",
          subtitle: "Private pool villa",
        },
        {
          src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0059.jpg",
          alt: "Outdoor terrace at Casa De Reva",
          title: "Room to unwind",
          subtitle: "A hillside hideaway",
        },
        {
          src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0017.jpg",
          alt: "Casa De Reva's private pool illuminated after dark",
          title: "Evenings by the pool",
          subtitle: "Casa De Reva · Kaswand",
        },
        {
          src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0051.jpg",
          alt: "Carrom and outdoor seating beside Casa De Reva's pool",
          title: "Time together",
          subtitle: "Poolside games",
        },
      ],
    },
    featuredSlug: "casa-de-reva",
    collectionTitle: "A hillside home, all to yourselves.",
    collectionIntro:
      "Explore our private pool villa in Panchgani, with space for a family holiday or a weekend together.",
    introTitle: "More time outdoors. Less on the agenda.",
    intro: [
      "Choose a Panchgani villa with a private pool when your group wants a shared home and time to enjoy the hills. Casa De Reva in Kaswand brings bedrooms, a living lounge and outdoor spaces together in one private stay.",
      "Spend time by the pool, gather over a meal and leave space for an outing around Panchgani. For a family or group holiday, compare the room allocation, access needs and full quote before choosing your dates. The villa's location is Kaswand; use that exact property pin when planning visits to Mapro Garden or Table Land.",
    ],
    planning: [
      {
        title: "For families & friends",
        text: "Choose your stay around the group's bedroom and bathroom needs. Check sleeping arrangements and pool supervision plans before arrival.",
      },
      {
        title: "For days in the hills",
        text: "Build a relaxed route around Table Land, Mapro Garden or a local stop of your choice. Check current access, opening hours and the drive from Kaswand.",
      },
      {
        title: "For a slower weekday",
        text: "Ask about eligible Monday–Thursday dates and the Stayw26 offer. Keep your plan flexible enough to enjoy the villa as well as the destination.",
      },
    ],
    faqs: [
      {
        question: "Which private pool villa can I book in Panchgani?",
        answer:
          "Casa De Reva is our Panchgani stay in Kaswand, with a private swimming pool for your group. Review its current photos, room details and calendar on the property page before reserving.",
      },
      {
        question: "Is the pool shared with other guests?",
        answer:
          "Casa De Reva is booked as a private villa, with its pool reserved for the staying group. Ask the team about pool depth and access, and supervise children around the water.",
      },
      {
        question: "How do I plan the route to Mapro Garden or Table Land?",
        answer:
          "Start with Casa De Reva's exact Kaswand map pin and your chosen attraction's location. Check the current route, opening hours and traffic rather than relying on a fixed travel-time estimate.",
      },
      {
        question: "Is a Panchgani villa suitable for a family gathering?",
        answer:
          "A private villa gives your group shared living, dining and outdoor space. Confirm the maximum overnight guest count, bed allocation and accessibility needs. Events and extra visitors require separate approval.",
      },
    ],
  },
  khopoli: {
    name: "Khopoli",
    title: "Villas in Khopoli | Luxury Private Pool Villas in Khopoli - Stay Willas",
    description:
      "Explore the finest luxury villas in Khopoli with private pool, sprawling lawns and mountain views. Book Canopy Crest in Khopoli with 0% platform fee.",
    summary:
      "Luxury private pool villas in Khopoli with mountain backdrops, expansive lawns, and private pools for group escapes and family weekends.",
    hero: {
      src: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
      alt: "Canopy Crest luxury private pool villa in Khopoli with illuminated swimming pool",
      caption: "Canopy Crest · Luxury Villa in Khopoli",
      items: [
        {
          src: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
          alt: "Canopy Crest and its illuminated private pool at dusk",
          title: "Canopy Crest",
          subtitle: "Khopoli · Private estate",
        },
        {
          src: "/assets/villas/canopy-crest/IMG-20260607-WA0015.jpg",
          alt: "Canopy Crest's sunlit villa and landscaped lawn",
          title: "Space to gather",
          subtitle: "Private pool and lawn",
        },
        {
          src: "/assets/villas/canopy-crest/canopy-crest-sunset-guests.jpg",
          alt: "Guests enjoying the garden at Canopy Crest at sunset",
          title: "Made for togetherness",
          subtitle: "A private group stay",
        },
        {
          src: "/assets/villas/canopy-crest/IMG-20260607-WA0012.jpg",
          alt: "Open lawn and outdoor games area at Canopy Crest",
          title: "Room to play",
          subtitle: "Open lawn",
        },
        {
          src: "/assets/villas/canopy-crest/IMG-20260607-WA0013.jpg",
          alt: "Canopy Crest's spacious living room with poolside views",
          title: "Gather indoors",
          subtitle: "Living and dining space",
        },
      ],
    },
    featuredSlug: "canopy-crest",
    collectionTitle: "Private Pool Villas in Khopoli for Groups & Families",
    collectionIntro:
      "Discover the best villas in Khopoli featuring private swimming pools, 4 spacious bedrooms, landscaped lawns, and home-cooked culinary care.",
    introTitle: "Experience the Best Luxury Villas in Khopoli.",
    intro: [
      "Nestled along the scenic foothills of the Western Ghats just 90 minutes from Mumbai and Pune, our villas in Khopoli offer the quintessential luxury escape. Whether you are coordinating a large family reunion, celebrating a birthday, or planning an executive offsite near Imagicaa, choosing a private villa gives your group unmatched comfort, freedom, and seclusion.",
      "Canopy Crest is our premier signature estate among villas in Khopoli, combining 4 master bedrooms, 5 bathrooms, a private swimming pool, outdoor gazebo lounge, and barbecue lawns for up to 16 guests. Unlike crowded hotels, booking villas in Khopoli directly through Stay Willas provides exclusive 100% private estate access, zero platform commission fees, and customizable home-cooked meal services.",
    ],
    planning: [
      {
        title: "Family Holidays & Group Celebrations in Khopoli",
        text: "Canopy Crest accommodates up to 16 guests with spacious air-conditioned suites, ensuite bathrooms, indoor-outdoor dining spaces, and open lawns perfect for games and family get-togethers.",
      },
      {
        title: "Conveniently Close to Imagicaa Theme Park",
        text: "Situated just 15 minutes from Imagicaa, our villas in Khopoli serve as an ideal private base to relax, swim, and dine after an adventurous day at the park.",
      },
      {
        title: "Corporate Team Offsites & Creative Retreats",
        text: "With high-speed fiber Wi-Fi, dual power backup, quiet mountain environs, and versatile lounge seating, our villas in Khopoli provide a focused setting for strategy sessions.",
      },
    ],
    faqs: [
      {
        question: "Why should I choose villas in Khopoli for a weekend getaway?",
        answer:
          "Villas in Khopoli offer convenient expressway access from Mumbai and Pune (under 90 minutes), expansive private pools, scenic Sahyadri mountain backdrops, and 100% private estate living for large groups without sharing amenities with strangers.",
      },
      {
        question: "Which is the best private pool villa in Khopoli for large groups?",
        answer:
          "Canopy Crest is our signature 4 BHK private pool villa in Khopoli, designed specifically for groups of up to 16 guests with private pool, gazebo, and manicured lawns.",
      },
      {
        question: "Can I book a Khopoli villa for an Imagicaa family trip?",
        answer:
          "Yes! Canopy Crest is situated just minutes from Imagicaa Theme Park, making it the most comfortable private pool villa in Khopoli for families visiting the park.",
      },
      {
        question: "Are meals provided at your villas in Khopoli?",
        answer:
          "Yes. We offer freshly prepared home-cooked meals by our on-ground culinary team, including authentic Maharashtrian dishes, barbecue, pure vegetarian, and Jain preparations.",
      },
      {
        question: "How do I book villas in Khopoli directly with Stay Willas?",
        answer:
          "You can check live date availability and book directly on our website or connect with our concierge team on WhatsApp (+91-9619042310) to secure direct homeowner rates with 0% platform booking fee.",
      },
    ],
  },
};

export function getAreaMetadata(slug: AreaSlug): Metadata {
  const area = areaEditorial[slug];
  const url = `https://www.staywillas.com/areas/${slug}`;
  const image = `https://www.staywillas.com${area.hero.src}`;
  const keywordsMap: Record<AreaSlug, string[]> = {
    khopoli: [
      "villas in khopoli",
      "villas in khopoli with private pool",
      "luxury villas in khopoli",
      "best villas in khopoli",
      "khopoli villa for rent",
      "private pool villa in khopoli",
      "villas near imagica khopoli",
      "canopy crest khopoli"
    ],
    lonavala: [
      "villas in lonavala",
      "villas in lonavala with private pool",
      "luxury villas in lonavala",
      "private jacuzzi cottages in lonavala",
      "the angle house lonavala",
      "willow peak lonavala"
    ],
    panchgani: [
      "villas in panchgani",
      "villas in panchgani with private pool",
      "luxury villas in panchgani",
      "casa de reva panchgani"
    ],
  };

  return {
    title: area.title,
    description: area.description,
    keywords: keywordsMap[slug],
    alternates: { canonical: url },
    openGraph: {
      title: area.title,
      description: area.description,
      url,
      siteName: "Stay Willas",
      locale: "en_IN",
      type: "website",
      images: [{ url: image, alt: area.hero.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: area.title,
      description: area.description,
      images: [image],
    },
  };
}
