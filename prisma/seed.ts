import "dotenv/config";
import { prisma } from "../src/lib/db";

const villasData = [
  {
    id: "lonavala-estate",
    slug: "angled-house",
    name: "The Angled House",
    location: "Lonavala, Maharashtra",
    category: "Infinity Pools",
    description: `Where modern architecture meets slow luxury — this stunning designer villa is crafted for unforgettable escapes. With its striking angular façade, floor-to-ceiling glass windows, warm ambient lighting, private pool, and a private Jacuzzi integrated right inside one of the master bedrooms, the space blends tropical serenity with contemporary elegance.

Wake up to soft natural light, spend your afternoons by the pool, enjoy a relaxing soak in the master bedroom's private Jacuzzi, and unwind in a space designed for comfort, conversations, and curated experiences. Whether it’s a weekend staycation, a celebration with friends, or a peaceful retreat away from the city, this villa offers the perfect balance of luxury and relaxation.`,
    price: 48000,
    weekendPrice: 54000,
    guests: 16,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/angled-house/gallery-11.webp",
      "/assets/villas/angled-house/gallery-3.webp",
      "/assets/villas/angled-house/gallery-13.webp",
      "/assets/villas/angled-house/gallery-19.webp",
      "/assets/villas/angled-house/main.webp",
      "/assets/villas/angled-house/gallery-1.webp",
      "/assets/villas/angled-house/gallery-4.webp",
      "/assets/villas/angled-house/gallery-5.webp",
      "/assets/villas/angled-house/gallery-6.webp",
      "/assets/villas/angled-house/gallery-7.webp",
      "/assets/villas/angled-house/gallery-8.webp",
      "/assets/villas/angled-house/gallery-9.webp",
      "/assets/villas/angled-house/gallery-10.webp",
      "/assets/villas/angled-house/gallery-12.webp",
      "/assets/villas/angled-house/gallery-14.webp",
      "/assets/villas/angled-house/gallery-15.webp",
      "/assets/villas/angled-house/gallery-16.webp",
      "/assets/villas/angled-house/gallery-17.webp",
      "/assets/villas/angled-house/gallery-18.webp"
    ],
    foodMenu: [
        "Truffle Mushroom Risotto",
        "Butter Garlic Tiger Prawns",
        "Woodfired Quattro Formaggi Pizza",
        "Slow-Cooked Lamb Shanks",
        "Warm Apple Galette with Vanilla Bean Gelato"
    ],
    amenities: [
      "Private Swimming Pool",
      "Waterfall Feature",
      "Panoramic Glass Frontage",
      "Modern warm lighting",
      "Outdoor lounging spaces",
      "Chilled Air Conditioning",
      "Super-fast Wi-Fi",
      "3 Beds",
      "2 Balconies",
      "Living Hall",
      "Jacuzzi in Master Bedroom"
    ]
  },
  {
    id: "alibaug-palms-estate",
    slug: "horizon-villa",
    name: "Horizon Villa",
    location: "Alibaug, Maharashtra",
    category: "Beachside Stays",
    description: `An architectural marvel situated on the golden coastline of Alibaug, Horizon Villa offers a breathtaking oceanfront retreat. Encased in double-height panoramic glass sheets, the villa lets natural seaside light wash across its warm, minimalistic interiors.

Step onto the private teakwood dining deck under glowing string lights, submerge in the heated private infinity pool which blends directly with the Arabian Sea, or retreat to the cozy master bedroom with direct beachfront views. Fully staffed with a private chef, this three-bedroom estate delivers the ultimate beachside luxury.`,
    price: 15000,
    weekendPrice: 18000,
    guests: 15,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/alibaug-palms-beachhouse/main.jpg",
      "/assets/villas/alibaug-palms-beachhouse/gallery-2.jpg",
      "/assets/villas/alibaug-palms-beachhouse/gallery-3.jpg",
      "/assets/villas/alibaug-palms-beachhouse/gallery-4.jpg"
    ],
    foodMenu: [
        "Konkani Surmai Fry",
        "Coastal Crab Masala",
        "Koli-Style Prawn Curry",
        "Alibaug Special Sol Kadhi",
        "Elaneer Payasam (Tender Coconut Kheer)"
    ],
    amenities: [
      "Direct Beach Access",
      "Heated Private Infinity Pool",
      "Bespoke Private Chefs",
      "Oceanfront Dining Deck",
      "Panoramic Glass Frontage",
      "Outdoor Bonfire Lounge",
      "Chilled Air Conditioning",
      "Super-fast Wi-Fi",
      "Jacuzzi in Master Suite",
      "Tropical Gardens"
    ]
  },
  {
    id: "alibaug-skytaj",
    slug: "skytaj-villa",
    name: "Skytaj Villa",
    location: "Alibaug, Maharashtra",
    category: "Beachside Stays",
    description: `A serene oceanfront masterpiece nestled among towering palm groves on Alibaug's elite coast. Skytaj Villa offers a pristine private sanctuary. Unwind on its sprawling poolside terraces, soak in the custom heated pool facing the sea, or dine inside its gorgeous sun-drenched lounges. Delivering high-ceiling bedrooms with sliding glass walls, this four-bedroom villa defines modern seaside living.`,
    price: 15000,
    weekendPrice: 18000,
    guests: 15,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/assets/villas/skytaj-villa/main.jpg",
      "/assets/villas/skytaj-villa/gallery-2.jpg",
      "/assets/villas/skytaj-villa/gallery-3.jpg",
      "/assets/villas/skytaj-villa/gallery-4.jpg"
    ],
    foodMenu: [
        "Paneer Tikka Butter Masala",
        "Tandoori Pomfret",
        "Lalla Mussa Dal (Slow-Cooked Black Lentils)",
        "Murg Dum Biryani",
        "Shahi Tukda with Rabdi"
    ],
    amenities: [
      "Private Swimming Pool",
      "Oceanfront Sunset Views",
      "Direct Beach Access",
      "Outdoor Bonfire Lounge",
      "Panoramic Glass Frontage",
      "Private Chef Services",
      "Super-fast Wi-Fi",
      "Chilled Air Conditioning",
      "Jacuzzi in Master Suite"
    ]
  },
  {
    id: "karjat-heritage",
    slug: "heritage-villa",
    name: "Heritage Villa",
    location: "Karjat, Maharashtra",
    category: "Private Estates",
    description: `A majestic stone-built countryside sanctuary where old-world heritage meets modern luxury. Heritage Villa features beautifully textured brick walls, a gorgeous private swimming pool with outdoor poolside dining, and custom warm lighting that glows under the night sky. Unwind in its spacious, air-conditioned master suites featuring private outdoor access, or enjoy quiet evenings on the paved deck under swaying palms. Experience absolute peace and privacy at this exclusive estate.`,
    price: 16000,
    weekendPrice: 19000,
    guests: 12,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/assets/villas/heritage-villa/main.jpg",
      "/assets/villas/heritage-villa/gallery-2.jpg",
      "/assets/villas/heritage-villa/gallery-3.jpg",
      "/assets/villas/heritage-villa/gallery-4.jpg",
      "/assets/villas/heritage-villa/gallery-5.jpg"
    ],
    foodMenu: [
        "Maharashtrian Pithla Bhakri",
        "Karjat Mutton Sukka",
        "Kolhapuri Tambada Rassa",
        "Bharli Vangi (Stuffed Eggplant)",
        "Ukadiche Modak (Steam Sweet Dumplings)"
    ],
    amenities: [
      "Private Swimming Pool",
      "Rustic Stone Architecture",
      "Outdoor Poolside Lounge",
      "Paved Garden Terrace",
      "Super-fast Wi-Fi",
      "Chilled Air Conditioning",
      "Daily Private Housekeeping",
      "Secure Private Parking"
    ]
  },
  {
    id: "harmony-villa",
    slug: "harmony-villa",
    name: "Harmony Villa",
    location: "Tungarli, Lonavala, Maharashtra",
    category: "Infinity Pools",
    description: `Nestled in the serene hills of Tungarli, Lonavala, Harmony Villa is a masterpiece of contemporary architecture and tranquil luxury. Designed for family getaways and upscale gatherings, this stunning 3-bedroom estate boasts a spectacular, sprawling private pool set against beautiful hill backdrops. With high-vaulted ceilings, open living halls, and a beautifully manicured lawn terrace complete with cozy outdoor seating, a carrom board, and swings, the villa provides the perfect environment for relaxation and fun.

Unwind in the air-conditioned, beautifully decorated bedrooms featuring premium bedding and unique accent walls. Whether you're enjoying a poolside BBQ under the night sky or playing games with loved ones on the artificial turf rooftop, Harmony Villa offers an unforgettable luxury staycation experience.`,
    price: 12000,
    weekendPrice: 24000,
    guests: 15,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/harmony-villa/main.jpg",
      "/assets/villas/harmony-villa/gallery-2.jpg",
      "/assets/villas/harmony-villa/gallery-3.jpg",
      "/assets/villas/harmony-villa/gallery-4.jpg",
      "/assets/villas/harmony-villa/gallery-5.jpg"
    ],
    foodMenu: [
        "Lonavala Corn Bhajiya",
        "Methi Chaman Paneer",
        "Dal Makhani Tadka",
        "Spiced Tandoori Chicken Tikka",
        "Hot Fudge Chocolate Brownie"
    ],
    amenities: [
      "Private Swimming Pool",
      "Lawn & Garden Area",
      "Super-fast Wi-Fi",
      "Chilled Air Conditioning",
      "Kitchen",
      "Secure Private Parking",
      "Open-air BBQ Grill",
      "Private Jacuzzi",
      "Music System",
      "Daily Housekeeping"
    ]
  }
];

async function main() {
  console.log("Cleaning old database records...");
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.villa.deleteMany({});

  console.log("Seeding luxury villas...");
  for (const villa of villasData) {
    const created = await prisma.villa.create({
      data: villa,
    });
    console.log(`- Created ${created.name} (${created.id})`);
  }

  console.log("Seeding mock bookings...");
  await prisma.booking.create({
    data: {
      villaId: "lonavala-estate",
      userId: "user_mock_1",
      checkIn: new Date("2026-06-01T14:00:00Z"),
      checkOut: new Date("2026-06-04T11:00:00Z"),
      totalPrice: 140000.0,
      status: "CONFIRMED",
    }
  });

  console.log("Seeding mock inquiries...");
  await prisma.inquiry.create({
    data: {
      name: "Aditya Sharma",
      email: "aditya@gmail.com",
      phone: "+91 99999 88888",
      message: "Looking to book Misty Mornings for a family reunion in mid-June. Is the chef available for Jain food?",
      villaId: "lonavala-estate",
      type: "GUEST",
    }
  });

  await prisma.inquiry.create({
    data: {
      name: "Sunita Kapoor",
      email: "sunita@kapoorestates.in",
      phone: "+91 98200 12345",
      message: "I own a stunning 6-bedroom clifftop villa in Mahabaleshwar with a private infinity pool. I would love to list it under the Stay Willas brand.",
      type: "OWNER",
    }
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
