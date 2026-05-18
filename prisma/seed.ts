import "dotenv/config";
import { prisma } from "../src/lib/db";

const villasData = [
  {
    id: "lonavala-estate",
    slug: "the-mist-estate",
    name: "Misty Mornings Cliffhouse",
    location: "Lonavala, Maharashtra",
    category: "Mountain View",
    description: `Misty Mornings Cliffhouse is our absolute favorite family getaway, and we’re so excited to share it with you. We built this 5-bedroom house right on the edge of the valley in Lonavala. On early mornings, the mist literally rolls right over the deck and through the glass doors of the living room—it feels like you're sitting inside a cloud.

It features cozy wooden ceilings, a stunning infinity pool that looks like it drops off into the valley, and a private chef (Kailash) who will pamper you with piping hot batata wadas, local Konkani fish curries, and incredible fresh-brewed filter coffee. It’s the perfect place to disconnect from the city noise and just breathe.`,
    price: 45000,
    guests: 12,
    bedrooms: 5,
    bathrooms: 6,
    images: [
      "/images/villa-lonavala.png",
      "/images/villa-alibaug.png",
      "/images/villa-mahabaleshwar.png",
      "/images/hero-villa.png",
      "/images/exp-pool.png"
    ],
    amenities: [
      "Super-fast Wi-Fi",
      "Heated Infinity Pool",
      "Private Parking",
      "Kailash (Private Chef)",
      "Chilled Air Conditioning",
      "Daily Housekeeping"
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
      "/images/villa-alibaug.png",
      "/images/villa-lonavala.png",
      "/images/villa-mahabaleshwar.png",
      "/images/hero-villa.png"
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
      "/images/exp-chef.png",
      "/images/hero-villa.png",
      "/images/exp-pool.png",
      "/images/villa-lonavala.png"
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
      "/images/villa-mahabaleshwar.png",
      "/images/villa-lonavala.png",
      "/images/villa-alibaug.png",
      "/images/exp-pool.png"
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
      "/images/hero-villa.png",
      "/images/exp-pool.png",
      "/images/villa-alibaug.png",
      "/images/villa-lonavala.png"
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
      "/images/exp-pool.png",
      "/images/hero-villa.png",
      "/images/villa-lonavala.png",
      "/images/villa-alibaug.png"
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
      "/images/villa-lonavala.png",
      "/images/villa-mahabaleshwar.png",
      "/images/hero-villa.png",
      "/images/exp-pool.png"
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
      "/images/villa-alibaug.png",
      "/images/villa-lonavala.png",
      "/images/exp-pool.png",
      "/images/hero-villa.png"
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
