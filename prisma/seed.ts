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
    guests: 16,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/angled-house/gallery-11.webp", // IMG_8638 (Main Thumbnail)
      "/assets/villas/angled-house/gallery-3.webp", // IMG_8547
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
      "Living Hall",
      "Jacuzzi in Master Bedroom"
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
