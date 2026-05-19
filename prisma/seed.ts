import "dotenv/config";
import { prisma } from "../src/lib/db";

const villasData = [
  {
    id: "lonavala-estate",
    slug: "angled-house",
    name: "The Angled House",
    location: "Lonavala, Maharashtra",
    category: "Infinity Pools",
    description: `Where modern architecture meets slow luxury — this stunning designer villa is crafted for unforgettable escapes. With its striking angular façade, floor-to-ceiling glass windows, warm ambient lighting, and private pool, the space blends tropical serenity with contemporary elegance.

Wake up to soft natural light, spend your afternoons by the pool, and unwind in a space designed for comfort, conversations, and curated experiences. Whether it’s a weekend staycation, a celebration with friends, or a peaceful retreat away from the city, this villa offers the perfect balance of luxury and relaxation.`,
    price: 48000,
    guests: 12,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/angled-house/gallery-2.webp", // IMG_8544 (Main Thumbnail)
      "/assets/villas/angled-house/gallery-3.webp", // IMG_8547
      "/assets/villas/angled-house/gallery-11.webp", // IMG_8638
      "/assets/villas/angled-house/gallery-13.webp", // IMG_8641
      "/assets/villas/angled-house/gallery-19.webp", // IMG_8651
      "/assets/villas/angled-house/main.webp", // IMG_8532
      "/assets/villas/angled-house/gallery-1.webp", // IMG_8541
      "/assets/villas/angled-house/gallery-4.webp", // IMG_8550
      "/assets/villas/angled-house/gallery-5.webp", // IMG_8554
      "/assets/villas/angled-house/gallery-6.webp", // IMG_8555
      "/assets/villas/angled-house/gallery-7.webp", // IMG_8559
      "/assets/villas/angled-house/gallery-8.webp", // IMG_8563
      "/assets/villas/angled-house/gallery-9.webp", // IMG_8564
      "/assets/villas/angled-house/gallery-10.webp", // IMG_8565
      "/assets/villas/angled-house/gallery-12.webp", // IMG_8640
      "/assets/villas/angled-house/gallery-14.webp", // IMG_8642
      "/assets/villas/angled-house/gallery-15.webp", // IMG_8646
      "/assets/villas/angled-house/gallery-16.webp", // IMG_8647
      "/assets/villas/angled-house/gallery-17.webp", // IMG_8648
      "/assets/villas/angled-house/gallery-18.webp"  // IMG_8649
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
      "Living Hall"
    ]
  },
  {
    id: "alibaug-shores",
    slug: "azure-beach-house",
    name: "Alibaug Palms Beachhouse",
    location: "Alibaug, Maharashtra",
    category: "Beachfront",
    description: `Alibaug Palms Beachhouse is a stunning 4-bedroom sanctuary right by the sea. Tucked away under towering coconut palms, the sound of the ocean waves will lull you to sleep every night.

Enjoy long lazy walks on the private beach access, a sparkling swimming pool, and freshly grilled seafood prepared by your private chef. It's the ultimate coastal luxury escape, just a short speedboat ride from Gateway of India in Mumbai.`,
    price: 38000,
    guests: 10,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/assets/villas/alibaug-palms-beachhouse/main.png",
      "/assets/villas/alibaug-palms-beachhouse/gallery-1.png",
      "/assets/villas/alibaug-palms-beachhouse/gallery-2.png",
      "/assets/villas/alibaug-palms-beachhouse/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Beachfront Access",
      "Private Swimming Pool",
      "Private Chef Included",
      "Chilled Air Conditioning",
      "Beach Bonfire Pit"
    ]
  },
  {
    id: "nashik-vineyard",
    slug: "vignette-manor",
    name: "Lake-View Vineyard Villa",
    location: "Nashik, Maharashtra",
    category: "Vineyards",
    description: `Nestled in the heart of Nashik's scenic wine country, this elegant 3-bedroom villa offers sweeping views of the calm lake and rolling grape valleys.

Perfect for wine enthusiasts and couples, the villa features an elegant stone deck, a private wine tasting room, and beautifully sunlit bedrooms. Sip premium local vintages as the sun sets over the water.`,
    price: 28000,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/lakeview-vineyard-villa/main.png",
      "/assets/villas/lakeview-vineyard-villa/gallery-1.png",
      "/assets/villas/lakeview-vineyard-villa/gallery-2.png",
      "/assets/villas/lakeview-vineyard-villa/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Vineyard Tours",
      "Lake Access & Views",
      "Private Wine Tasting Cellar",
      "Chilled Air Conditioning",
      "Spacious Stone Deck"
    ]
  },
  {
    id: "panchgani-heights",
    slug: "sahyardi-manor",
    name: "Panchgani Whispering Pines",
    location: "Panchgani, Maharashtra",
    category: "Mountain View",
    description: `High up in the cool, crisp hills of Panchgani, Whispering Pines is a majestic 6-bedroom heritage estate surrounded by ancient pine forests.

With high wood-beamed ceilings, charming colonial furniture, and a heated infinity pool overlooking the step valleys, it's perfect for large family reunions or luxury retreats.`,
    price: 55000,
    guests: 15,
    bedrooms: 6,
    bathrooms: 7,
    images: [
      "/assets/villas/panchgani-whispering-pines/main.png",
      "/assets/villas/panchgani-whispering-pines/gallery-1.png",
      "/assets/villas/panchgani-whispering-pines/gallery-2.png",
      "/assets/villas/panchgani-whispering-pines/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Heated Pool",
      "Billiards Table",
      "Mountain & Valley Views",
      "Chilled Air Conditioning",
      "Lawn & Garden Area"
    ]
  },
  {
    id: "karjat-riverside",
    slug: "river-echoes",
    name: "Karjat River House",
    location: "Karjat, Maharashtra",
    category: "Private Estates",
    description: `Karjat River House is an architectural masterpiece perched right on the edge of a rushing seasonal river.

This 3-bedroom escape is built with natural stone and massive glass walls, letting the soothing sounds of the river flow into every room. It features a private riverside deck, organic vegetable gardens, and an open-air plunge pool.`,
    price: 32000,
    guests: 8,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/karjat-river-house/main.png",
      "/assets/villas/karjat-river-house/gallery-1.png",
      "/assets/villas/karjat-river-house/gallery-2.png",
      "/assets/villas/karjat-river-house/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Riverside Deck",
      "Plunge Pool",
      "Organic Vegetable Garden",
      "Chilled Air Conditioning",
      "Open-air BBQ Grill"
    ]
  },
  {
    id: "mulshi-lakefront",
    slug: "serene-waters-estate",
    name: "Mulshi Lakehouse",
    location: "Mulshi, Maharashtra",
    category: "Infinity Pools",
    description: `Tucked away on the serene banks of Mulshi Lake, this 4-bedroom modern lakehouse boasts unparalleled water views.

Complete with a pristine infinity pool that merges seamlessly with the lake, expansive glass walls, and lush green lawns, it's a tranquil paradise for nature lovers.`,
    price: 42000,
    guests: 10,
    bedrooms: 4,
    bathrooms: 5,
    images: [
      "/assets/villas/mulshi-lakehouse/main.png",
      "/assets/villas/mulshi-lakehouse/gallery-1.png",
      "/assets/villas/mulshi-lakehouse/gallery-2.png",
      "/assets/villas/mulshi-lakehouse/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Infinity Swimming Pool",
      "Panoramic Lake Views",
      "Outdoor Fireplace",
      "Chilled Air Conditioning",
      "Kayaking Equipment"
    ]
  },
  {
    id: "igatpuri-peaks",
    slug: "cloud-nine-villa",
    name: "Igatpuri Clouds Villa",
    location: "Igatpuri, Maharashtra",
    category: "Mountain View",
    description: `Igatpuri Clouds Villa is a premium 4-bedroom sanctuary high in the mist-laden Western Ghats.

Watch the clouds glide past your balcony, relax in the private jacuzzi, or host a cozy BBQ on the lush manicured lawns. A true high-altitude luxury sanctuary.`,
    price: 35000,
    guests: 10,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/assets/villas/igatpuri-clouds-villa/main.png",
      "/assets/villas/igatpuri-clouds-villa/gallery-1.png",
      "/assets/villas/igatpuri-clouds-villa/gallery-2.png",
      "/assets/villas/igatpuri-clouds-villa/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Private Jacuzzi",
      "BBQ Grill Station",
      "Chilled Air Conditioning",
      "Mountain & Ghat Views",
      "Spacious Balcony"
    ]
  },
  {
    id: "kashid-beach",
    slug: "palm-grove-sanctuary",
    name: "Kashid Palms Villa",
    location: "Kashid, Maharashtra",
    category: "Beachfront",
    description: `Kashid Palms Villa is a beautiful 5-bedroom luxury oasis just steps from the golden sands of Kashid beach.

Blending beachside bohemian design with high-end luxury, it features tropical courtyards, a massive pool, and expansive open-air lounge pavilions.`,
    price: 50000,
    guests: 12,
    bedrooms: 5,
    bathrooms: 5,
    images: [
      "/assets/villas/kashid-palms-villa/main.png",
      "/assets/villas/kashid-palms-villa/gallery-1.png",
      "/assets/villas/kashid-palms-villa/gallery-2.png",
      "/assets/villas/kashid-palms-villa/gallery-3.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Tropical Courtyard",
      "Massive Swimming Pool",
      "Open-air Lounge Pavilions",
      "Chilled Air Conditioning",
      "Beach Volley Net"
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

  await prisma.booking.create({
    data: {
      villaId: "alibaug-shores",
      userId: "user_mock_2",
      checkIn: new Date("2026-06-10T14:00:00Z"),
      checkOut: new Date("2026-06-12T11:00:00Z"),
      totalPrice: 81000.0,
      status: "PENDING",
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
