import type { Villa } from "@prisma/client";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";
import { nieevantPhotos } from "@/data/nieevant-images";
import { NIEEVANT_SLUG } from "@/data/nieevant-villa";

export type PropertyPhoto = { src: string; alt: string };
export type PropertySpace = PropertyPhoto & { title: string; text: string };
export type Highlight = {
  icon: "pool" | "jacuzzi" | "garden" | "view" | "meals" | "pet" | "access";
  title: string;
  text: string;
};
type PropertyCopy = {
  eyebrow: string;
  summary: string;
  intro: string;
  detail: string;
  locationName: string;
  directions: string;
  mapUrl: string;
  mapEmbedUrl?: string;
  featured: PropertyPhoto[];
  spaces: PropertySpace[];
  highlights: Highlight[];
  checkInTime?: string;
  checkOutTime?: string;
  priceNote?: string;
  photoNote?: string;
  houseRulesNote?: string;
};

const angleBase = "/assets/villas/the-angle-house/";
const willowBase = "/assets/villas/willow-peak/graded-v1/";
const casaBase = "/assets/villas/terra-cotta-villa/";

const angle: PropertyCopy = {
  eyebrow: "3 BEDROOM PRIVATE POOL VILLA · KAMSHET NEAR LONAVALA",
  summary:
    "A 3-bedroom private pool villa in Kamshet near Lonavala for up to 12 guests, with a waterfall pool and Jacuzzi in the master suite.",
  intro:
    "The Angle House is a private pool villa in Kamshet, near Lonavala. It has three bedrooms for up to 12 guests.",
  detail:
    "Gather beside the private waterfall pool, relax in the master-suite Jacuzzi, or spend time in the living lounge and garden. Check your dates for a full stay quote.",
  locationName: "Kamshet",
  directions:
    "Use the exact property pin to plan your drive via Kamshet and the Old Mumbai-Pune Highway.",
  mapUrl:
    "https://www.google.com/maps/place/StayWillas+The+Angle+House+%7C+With+Jacuzzi+%7C+Lonavala/@18.7687773,73.5659749,17z/data=!3m1!4b1!4m9!3m8!1s0x3bc2ad6536845e45:0x4a41e2fba2fc985c!5m2!4m1!1i2!8m2!3d18.7687773!4d73.5685498!16s%2Fg%2F11zb_x4877",
  featured: [
    {
      src: `${angleBase}gallery-11.webp`,
      alt: "The Angle House glass facade and balcony at dusk",
    },
    {
      src: `${angleBase}gallery-13.webp`,
      alt: "Private waterfall swimming pool beside The Angle House",
    },
    {
      src: `${angleBase}gallery-14.webp`,
      alt: "The Angle House living lounge with sofas and a staircase",
    },
  ],
  spaces: [
    {
      title: "Glass-fronted bedrooms",
      src: `${angleBase}gallery-9.webp`,
      alt: "Double bed and full-height glass doors in an Angle House bedroom",
      text: "Three bedrooms for restful nights and unhurried mornings.",
    },
    {
      title: "Room to gather",
      src: `${angleBase}gallery-14.webp`,
      alt: "Sofa seating and staircase in the villa's living lounge",
      text: "A generous living lounge for conversations that carry on.",
    },
    {
      title: "Your own poolside",
      src: `${angleBase}gallery-13.webp`,
      alt: "Private pool with a waterfall feature beside The Angle House",
      text: "A private waterfall pool, a garden and space to unwind.",
    },
    {
      title: "Quiet corners outdoors",
      src: `${angleBase}gallery-12.webp`,
      alt: "The Angle House courtyard and garden planting",
      text: "Step outside for fresh air, balcony time and garden views.",
    },
  ],
  highlights: [
    {
      icon: "pool",
      title: "Pool days, your way",
      text: "The pool is exclusive to your group.",
    },
    {
      icon: "jacuzzi",
      title: "A private soak",
      text: "A Jacuzzi in the master bedroom.",
    },
    {
      icon: "meals",
      title: "Meals made easy",
      text: "Ask about menus and chef services.",
    },
    {
      icon: "pet",
      title: "Bring your best friend",
      text: "Let us know if your pet is joining.",
    },
  ],
};

const willow: PropertyCopy = {
  eyebrow: "A-FRAME STAYS IN THE HILLS",
  summary:
    "Timber-lined cottages, private Jacuzzis and slower days in the Lonavala hills.",
  intro:
    "Three standalone A-frame cottages in Kurwande, with a private Jacuzzi in each and space to enjoy the hills together.",
  detail:
    "Book Breeze, Crest and Heaven together for up to 12 guests. Each cottage has an air-conditioned bedroom, an attached bathroom and its own sit-out; outdoor dining and garden spaces bring everyone together.",
  locationName: "Kurwande",
  directions:
    "Follow the Willow Peak property pin in Kurwande, near INS Shivaji Road in Lonavala.",
  mapUrl:
    "https://www.google.com/maps?q=P9P9+5XW+Willow+Peak+Resort,+Kurvande,+Maharashtra+410402&ftid=0x3be8070059702d61:0x4182db34c43d1717",
  featured: [
    {
      src: `${willowBase}chalets-night.webp`,
      alt: "Willow Peak's three illuminated A-frame cottages at night",
    },
    {
      src: `${willowBase}wp-03.webp`,
      alt: "A private Jacuzzi inside a Willow Peak cottage",
    },
    {
      src: `${willowBase}wp-05.webp`,
      alt: "Timber-lined A-frame bedroom at Willow Peak",
    },
  ],
  spaces: [
    {
      title: "Timber-lined bedrooms",
      src: `${willowBase}wp-04.webp`,
      alt: "Double bed beneath a sloping timber ceiling at Willow Peak",
      text: "A cosy bedroom beneath the cottage's sloping timber ceiling.",
    },
    {
      title: "A soak of your own",
      src: `${willowBase}wp-03.webp`,
      alt: "Willow Peak's in-room Jacuzzi beside a window",
      text: "A private in-room Jacuzzi for a slower end to the day.",
    },
    {
      title: "Step out, slow down",
      src: `${willowBase}wp-01.webp`,
      alt: "Outdoor seating beside a Willow Peak chalet's glass doors",
      text: "A covered sit-out beside the chalet's glass doors.",
    },
    {
      title: "Meals in the open air",
      src: `${willowBase}wp-08.webp`,
      alt: "Covered dining pavilion with tables and chairs at Willow Peak",
      text: "A covered dining area for meals and time together.",
    },
    {
      title: "The A-frame setting",
      src: `${willowBase}wp-07.webp`,
      alt: "A-frame chalet exteriors and decks at Willow Peak",
      text: "Three neighbouring cottages set against the Lonavala hills.",
    },
    {
      title: "An attached bathroom",
      src: `${willowBase}wp-10.webp`,
      alt: "Willow Peak cottage bathroom with a water heater",
      text: "An attached bathroom with shower facilities and hot water.",
    },
  ],
  highlights: [
    {
      icon: "jacuzzi",
      title: "A private soak",
      text: "An in-room Jacuzzi in every cottage.",
    },
    {
      icon: "view",
      title: "A little hill time",
      text: "Mountain views and your own sit-out.",
    },
    {
      icon: "garden",
      title: "Space outside",
      text: "Garden areas and outdoor dining.",
    },
    {
      icon: "meals",
      title: "Plan your meals",
      text: "Ask about menus and dining options.",
    },
  ],
};

const canopy: PropertyCopy = {
  eyebrow: "A PRIVATE GETAWAY IN KHOPOLI",
  summary: "A poolside home with four bedrooms and space for the whole group.",
  intro:
    "A four-bedroom villa in Khopoli for pool days, family catch-ups and an unhurried break with up to 16 guests.",
  detail:
    "Gather in the living and dining rooms, head outside to the lawn, or spend the afternoon beside your private swimming pool. Ask the team about meals and accessibility for your group.",
  locationName: "Chavani",
  directions:
    "Follow the exact Canopy Crest property pin in Chavani, Khopoli, to plan your arrival.",
  mapUrl:
    "https://www.google.com/maps/place/StayWillas+Canopy+Crest+Khopoli+%7C+Premium+Villa+with+Swimming+Pool/@18.7101381,73.3318344,17z/data=!3m1!4b1!4m6!3m5!1s0x3be80541e66fe4dd:0xf311fa62a65e318f!8m2!3d18.7101381!4d73.3344093!16s%2Fg%2F11zcgpz6w2",
  featured: [
    {
      src: canopyCrestPhotos.hero.src,
      alt: canopyCrestPhotos.hero.alt,
    },
    {
      src: canopyCrestPhotos.poolDay.src,
      alt: canopyCrestPhotos.poolDay.alt,
    },
    {
      src: canopyCrestPhotos.livingDining.src,
      alt: canopyCrestPhotos.livingDining.alt,
    },
  ],
  spaces: [
    {
      title: "Pool-facing bedrooms",
      src: canopyCrestPhotos.bedroom.src,
      alt: canopyCrestPhotos.bedroom.alt,
      text: "A bright bedroom with large garden-facing windows.",
    },
    {
      title: "The kitchen",
      src: canopyCrestPhotos.kitchen.src,
      alt: canopyCrestPhotos.kitchen.alt,
      text: "Counter space and built-in cabinets for everyday convenience.",
    },
    {
      title: "The bathroom",
      src: canopyCrestPhotos.bathroom.src,
      alt: canopyCrestPhotos.bathroom.alt,
      text: "A glass shower and bathtub for a comfortable stay.",
    },
    {
      title: "Outdoor games and seating",
      src: canopyCrestPhotos.gazebo.src,
      alt: canopyCrestPhotos.gazebo.alt,
      text: "An open-sided gazebo with outdoor seating and games.",
    },
    {
      title: "The villa and grounds",
      src: canopyCrestPhotos.overhead.src,
      alt: canopyCrestPhotos.overhead.alt,
      text: "See how the villa, lawn and pool sit within the green hillside setting.",
    },
    {
      title: "A quieter evening",
      src: canopyCrestPhotos.lawnEvening.src,
      alt: canopyCrestPhotos.lawnEvening.alt,
      text: "Outdoor seating on the lawn as the day winds down.",
    },
  ],
  highlights: [
    {
      icon: "pool",
      title: "Pool days, your way",
      text: "A private swimming pool for your group.",
    },
    {
      icon: "garden",
      title: "Room outdoors",
      text: "A spacious lawn and outdoor seating.",
    },
    {
      icon: "access",
      title: "A stay for the family",
      text: "Ask about wheelchair and senior access.",
    },
    {
      icon: "meals",
      title: "Meals made easy",
      text: "Meal options are available on request.",
    },
  ],
};

const nieevant: PropertyCopy = {
  eyebrow: "A HILLTOP VILLA IN KHOPOLI",
  summary:
    "A private pool, hillside views and room for up to 15 guests at Nieevant by Stay Willas.",
  intro:
    "Nieevant by Stay Willas is a 3-bedroom villa at Hatond Village, Khopoli. With 3 bathrooms and room for up to 15 guests, it is set on a green hilltop with open outdoor space.",
  detail:
    "Spend time by the private swimming pool, take in the valley from the balcony or terrace, and gather in the living and dining spaces. Air conditioning, Wi-Fi and private parking are listed amenities. Barbecue service is available for an additional charge; kitchen access is not included.",
  locationName: "Hatond Village",
  directions:
    "The villa is at Plot No. 8, Nalavade Farms, Hatond Village, Khopoli, Maharashtra 410205. Open the map pin for your route and confirm arrival instructions with the team.",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Plot%20No.%208%2C%20Nalavade%20Farms%2C%20Hatond%20Village%2C%20Khopoli%2C%20Maharashtra%2C%20India%2C%20410205",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Plot%20No.%208%2C%20Nalavade%20Farms%2C%20Hatond%20Village%2C%20Khopoli%2C%20Maharashtra%2C%20India%2C%20410205&z=13&output=embed",
  featured: [
    { src: nieevantPhotos.hero.src, alt: nieevantPhotos.hero.alt },
    { src: nieevantPhotos.hillside.src, alt: nieevantPhotos.hillside.alt },
    { src: nieevantPhotos.grounds.src, alt: nieevantPhotos.grounds.alt },
  ],
  spaces: [
    {
      title: "Pool and hilltop setting",
      src: nieevantPhotos.hero.src,
      alt: nieevantPhotos.hero.alt,
      text: "An aerial look at the villa, pool and green hills around it.",
    },
    {
      title: "A hillside view",
      src: nieevantPhotos.hillside.src,
      alt: nieevantPhotos.hillside.alt,
      text: "The villa sits above the surrounding green landscape in Khopoli.",
    },
    {
      title: "The surrounding grounds",
      src: nieevantPhotos.grounds.src,
      alt: nieevantPhotos.grounds.alt,
      text: "A wide view of the property and its open surroundings.",
    },
  ],
  highlights: [
    {
      icon: "pool",
      title: "A private pool",
      text: "A swimming pool reserved for your stay.",
    },
    {
      icon: "view",
      title: "Above the valley",
      text: "A hilltop setting with open green views.",
    },
    {
      icon: "garden",
      title: "Outdoor breathing room",
      text: "A balcony, terrace and space to spend time outside.",
    },
    {
      icon: "meals",
      title: "Barbecue on request",
      text: "BBQ service is available for an additional charge.",
    },
  ],
  checkInTime: "1:00 PM",
  checkOutTime: "11:00 AM",
  priceNote:
    "Listed from ₹19,999 per night plus taxes. Check with our team for the final rate and availability on your dates.",
  photoNote:
    "Original property photographs supplied for Nieevant. They show the actual villa and are not AI-generated; we have applied a light colour grade and Stay Willas watermark.",
  houseRulesNote:
    "Pets and events are allowed according to the current listing. Kitchen access is not included. Please confirm event arrangements, any additional charges and designated smoking areas with the team before arrival.",
};

const casa: PropertyCopy = {
  eyebrow: "A HILLSIDE HOME IN PANCHGANI",
  summary: "Terracotta warmth, a private pool and a little valley air.",
  intro:
    "A four-bedroom hillside home in Panchgani for relaxed pool days and time together with up to 16 guests.",
  detail:
    "Warm terracotta architecture, a generous living hall and a private swimming pool. Enjoy the lawn and gazebo, take in the valley views, and ask about meals or a barbecue for your stay.",
  locationName: "Kaswand",
  directions:
    "Use the existing property pin in Kaswand, Panchgani, and confirm your arrival details with the booking team.",
  mapUrl: "https://www.google.com/maps?q=17.9040603,73.7732925",
  featured: [
    {
      src: `${casaBase}IMG-20260901-WA0061.jpg`,
      alt: "Casa De Reva's terracotta facade and pool at sunset",
    },
    {
      src: `${casaBase}IMG-20260901-WA0035.jpg`,
      alt: "Casa De Reva bedroom with an upholstered headboard",
    },
    {
      src: `${casaBase}IMG-20260901-WA0031.jpg`,
      alt: "Casa De Reva balcony seating overlooking the valley",
    },
  ],
  spaces: [
    {
      title: "Restful bedrooms",
      src: `${casaBase}IMG-20260901-WA0035.jpg`,
      alt: "Double bed and bedside lighting at Casa De Reva",
      text: "A comfortable bedroom with warm bedside lighting.",
    },
    {
      title: "Room to gather",
      src: `${casaBase}IMG-20260901-WA0043.jpg`,
      alt: "Casa De Reva living lounge with sofa seating and TV",
      text: "A family lounge for long conversations and shared evenings.",
    },
    {
      title: "Your own poolside",
      src: `${casaBase}IMG-20260901-WA0037.jpg`,
      alt: "Casa De Reva private swimming pool and deck",
      text: "A private swimming pool beside the villa.",
    },
    {
      title: "Valley-view moments",
      src: `${casaBase}casa-de-reva-balcony-beer.jpg`,
      alt: "Friends enjoying chilled beer with valley views on Casa De Reva balcony",
      text: "Balcony seating with an open panoramic view of the surrounding hills.",
    },
    {
      title: "Dine together",
      src: `${casaBase}IMG-20260901-WA0050.jpg`,
      alt: "Casa De Reva indoor dining area",
      text: "A dedicated dining area for your group's meals.",
    },
    {
      title: "The daily comforts",
      src: `${casaBase}IMG-20260901-WA0057.jpg`,
      alt: "Casa De Reva bathroom vanity and mirror",
      text: "Attached bathrooms with a washbasin and shower facilities.",
    },
  ],
  highlights: [
    {
      icon: "pool",
      title: "Pool days, your way",
      text: "The swimming pool is private to your group.",
    },
    {
      icon: "view",
      title: "Take in the valley",
      text: "Mountain views and balcony time.",
    },
    {
      icon: "garden",
      title: "Room outdoors",
      text: "A lawn and gazebo for slower afternoons.",
    },
    {
      icon: "meals",
      title: "Meals made easy",
      text: "Ask about chef and barbecue options.",
    },
  ],
};

export const willowUnits = [
  {
    selection: "A",
    slug: "willow-peak-cottage-a",
    name: "Breeze",
    capacity: "Cottage A · up to 4",
  },
  {
    selection: "B",
    slug: "willow-peak-cottage-b",
    name: "Crest",
    capacity: "Cottage B · up to 4",
  },
  {
    selection: "C",
    slug: "willow-peak-cottage-c",
    name: "Heaven",
    capacity: "Cottage C · up to 4",
  },
  {
    selection: "ALL",
    slug: "willow-peak",
    name: "All three cottages",
    capacity: "All 3 cottages · up to 12",
  },
] as const;

export function getPropertyEditorial(villa: Villa) {
  const isWillow = villa.slug.startsWith("willow-peak");
  const unit = willowUnits.find((option) => option.slug === villa.slug);
  const cottage = isWillow && villa.slug !== "willow-peak";
  const copy =
    villa.slug === "the-angle-house"
      ? angle
      : isWillow
        ? willow
        : villa.slug === "canopy-crest"
          ? canopy
          : villa.slug === NIEEVANT_SLUG
            ? nieevant
          : ["casa-de-reva", "terra-cotta-villa"].includes(villa.slug)
            ? casa
            : null;
  const areaName = villa.location.includes("Khopoli")
    ? "Khopoli"
    : villa.location.includes("Panchgani")
      ? "Panchgani"
      : "Lonavala";
  const hasPool = villa.amenities.some((amenity) => /pool/i.test(amenity));
  const hasJacuzzi = villa.amenities.some((amenity) =>
    /jacuzzi/i.test(amenity),
  );
  const name = villa.slug === "willow-peak" ? "Willow Peak" : villa.name;
  const fallbackPhotos = villa.images
    .slice(0, 3)
    .map((src, index) => ({
      src,
      alt: `${villa.name} property view ${index + 1}`,
    }));
  const resolved: PropertyCopy = copy || {
    eyebrow: "YOUR PRIVATE STAY",
    summary: `A stay for up to ${villa.guests} guests in ${villa.location}.`,
    intro: villa.description.split(/\n\s*\n/)[0],
    detail: `${villa.bedrooms} bedrooms, ${villa.bathrooms} bathrooms and room for up to ${villa.guests} guests.`,
    locationName: villa.location.split(",")[0],
    directions:
      "Confirm the exact arrival pin with the booking team before travelling.",
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${villa.name} ${villa.location}`)}`,
    featured: fallbackPhotos,
    spaces: fallbackPhotos.map((photo, index) => ({
      ...photo,
      title: `A closer look ${index + 1}`,
      text: `A view of ${villa.name}.`,
    })),
    highlights: [],
  };
  const checkInTime = resolved.checkInTime ?? "2:00 PM";
  const checkOutTime = resolved.checkOutTime ?? "11:00 AM";
  const faqs = [
    {
      question: hasPool
        ? "Is the pool private?"
        : "Does the cottage have a private Jacuzzi?",
      answer: hasPool
        ? "Yes. The swimming pool is reserved for your group during your stay."
        : hasJacuzzi
          ? "Yes. Each Willow Peak cottage has its own private in-room Jacuzzi."
          : "Ask the team to confirm the facilities available with your booking.",
    },
    {
      question: "How many people can stay?",
      answer: `${name} accommodates up to ${villa.guests} guests, with ${villa.bedrooms} ${villa.bedrooms === 1 ? "bedroom" : "bedrooms"} and ${villa.bathrooms} ${villa.bathrooms === 1 ? "bathroom" : "bathrooms"}. Confirm any extra-person charges in your final quote.`,
    },
    ...(villa.slug === NIEEVANT_SLUG
      ? [
          {
            question: "Is there parking at Nieevant?",
            answer:
              "Yes. Private parking is listed at the property, with free and secure parking available on the premises.",
          },
          {
            question: "Is Nieevant suitable for families?",
            answer:
              "Yes. The listing describes the villa as suitable for families with children and older guests.",
          },
          {
            question: "Can we book a day visit or picnic?",
            answer:
              "Day visits can be arranged with advance booking. Contact the team to confirm group size, timings, facilities and any applicable charges.",
          },
          {
            question: "Can we host an event or celebration?",
            answer:
              "Events are allowed according to the current listing. Please share your plan and guest count in advance; approval and additional charges may apply.",
          },
          {
            question: "Are photo and video shoots allowed?",
            answer:
              "Commercial photography and filming are allowed with advance permission. Tell the team about your shoot so arrangements can be confirmed.",
          },
          {
            question: "Can guests use the kitchen?",
            answer:
              "Kitchen access is not included. The listing includes a refrigerator and barbecue service for an additional charge; ask the team about meal arrangements.",
          },
        ]
      : []),
    ...(villa.slug === "the-angle-house"
      ? [
          {
            question: "Where is The Angle House?",
            answer:
              "The Angle House is in Kamshet, near Lonavala. Use the exact map pin on this page to plan your drive and arrival.",
          },
          {
            question: "How do I check dates and rates?",
            answer:
              "Choose your check-in and check-out dates and guest count in the booking panel. You can review the live date-based rates and full stay quote before confirming.",
          },
        ]
      : []),
    ...(isWillow
      ? [
          {
            question: "Can I book one cottage or all three together?",
            answer:
              "Book Breeze, Crest or Heaven individually for up to four guests, or all three cottages together for up to 12. With an individual cottage booking, other cottages and shared outdoor areas may be used by other guests.",
          },
        ]
      : []),
    {
      question: "Can we arrange meals?",
      answer: villa.slug === NIEEVANT_SLUG
        ? "Meal or cook service is not confirmed in the listing. Contact our team to ask what can be arranged and whether additional charges apply."
        : "Ask our team about meal packages and chef services, including vegetarian and Jain options. Menus, dietary requests and charges are confirmed separately.",
    },
    {
      question: "Are pets welcome?",
      answer: villa.slug === NIEEVANT_SLUG || villa.slug === "the-angle-house"
        ? "Pets are allowed according to the current listing. Let the booking team know before arrival and confirm any requirements for your stay."
        : "Please confirm the pet policy and any house rules for your selected property with the booking team before reserving.",
    },
    ...(!cottage
      ? [
          {
            question: "How does the weekday offer work?",
            answer:
              "Use Stayw26 for 26% off eligible Monday-Thursday stays on qualifying villas. Review rates, inclusions and your final quote before reserving.",
          },
        ]
      : []),
    {
      question: "What are the check-in and check-out times?",
      answer: villa.slug === NIEEVANT_SLUG
        ? `Check-in is from ${checkInTime} and check-out is by ${checkOutTime}. Early check-in or late check-out is subject to availability and may have an additional charge.`
        : `Check-in is from ${checkInTime} and check-out is by ${checkOutTime}. Early arrival or late departure needs advance confirmation and is subject to availability.`,
    },
  ];
  return {
    ...resolved,
    name,
    areaName,
    areaUrl: `/areas/${areaName.toLowerCase()}`,
    isWillow,
    cottage,
    hasPool,
    hasJacuzzi,
    initialCottageSelection: unit?.selection ?? "A",
    faqs,
    eyebrow: cottage
      ? `WILLOW PEAK · COTTAGE ${unit?.selection}`
      : resolved.eyebrow,
    intro: cottage
      ? `${name} is a private one-bedroom A-frame cottage at Willow Peak, for a quiet Lonavala getaway with up to ${villa.guests} guests.`
      : resolved.intro,
    detail: cottage
      ? "An air-conditioned bedroom, an attached bathroom, your own Jacuzzi and a private sit-out. Enjoy the cottage at your own pace, with outdoor dining and garden areas shared across Willow Peak."
      : resolved.detail,
    photoNote: cottage
      ? "Photos show spaces across Willow Peak. Ask our team to confirm the exact photos of your selected cottage."
      : resolved.photoNote ?? "",
  };
}
