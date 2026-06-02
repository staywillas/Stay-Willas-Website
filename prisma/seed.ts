import "dotenv/config";
import { prisma } from "../src/lib/db";

const villasData = [
  {
    id: "lonavala-estate",
    slug: "the-angle-house",
    name: "The Angle House",
    location: "Lonavala, Maharashtra",
    category: "Infinity Pools",
    description: `Imagine waking up to the gentle breeze of the hills, surrounded by sleek glass walls and green trees. Welcome to The Angle House, a stunning designer home where modern style meets cozy comfort. Located in the heart of the hills, if you are planning a memorable villa stay lonavala is the ultimate destination to unwind. This is not just a place to sleep—it is a space where you can slow down, connect with your loved ones, and enjoy a quiet villa stay lonavala experience. While there are many lonavala villas available, this property stands out.

Planning your next weekend getaway lonavala is just a short drive from Mumbai or Pune. It is the perfect setting for a refreshing weekend getaway lonavala has to offer. The very first thing you will notice is the striking design. With its unique angular facade, it represents the absolute peak of modern lonavala villas. If you appreciate beautiful lonavala villas, this home will take your breath away.

Your Own Private Oasis

Step outside onto the main deck, and you will find your own private swimming pool. If you have been searching for a premium villa in lonavala with pool access, you will fall in love with this backyard. It comes with a soothing waterfall feature, outdoor lounge chairs, and cozy corners to sit. It is the perfect place to spend your weekend getaway lonavala swimming and relaxing.

Inside, the luxury continues. The villa has three spacious bedrooms, each designed with warm lighting to guarantee a restful sleep. But the real surprise of this villa in lonavala with pool is the private indoor Jacuzzi. Imagine coming back from a walk and enjoying a soak during your weekend getaway lonavala stay.

Space to Gather and Celebrate

When people browse through various lonavala villas, they are usually looking for a mix of style and peace. The Angle House gives you exactly that. It is a modern villa in lonavala with pool amenities, yet it feels as comfortable as your own home. There is no better choice for a villa stay lonavala has to offer.

With enough room to host up to 16 guests, it is ideal for family reunions or birthdays. You can cook meals, play board games, or watch the sunset. For those who want an exceptional villa stay lonavala provides the perfect backdrop. Among the popular lonavala villas, this estate has earned a special place.

As you plan your weekend getaway lonavala trip, imagine poolside dinners under the stars. Selecting this villa in lonavala with pool access means choosing a flawless escape. Book your stay today, pack your bags, and get ready for a wonderful villa stay lonavala trip. When comparing different lonavala villas, you will realize that this villa in lonavala with pool is in a class of its own. Make your weekend getaway lonavala a memory to cherish with a premium villa stay lonavala experience at this gorgeous villa in lonavala with pool retreat.`,
    price: 48000,
    weekendPrice: 54000,
    guests: 16,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/the-angle-house/gallery-11.webp",
      "/assets/villas/the-angle-house/gallery-3.webp",
      "/assets/villas/the-angle-house/gallery-13.webp",
      "/assets/villas/the-angle-house/gallery-19.webp",
      "/assets/villas/the-angle-house/main.webp",
      "/assets/villas/the-angle-house/gallery-1.webp",
      "/assets/villas/the-angle-house/gallery-4.webp",
      "/assets/villas/the-angle-house/gallery-5.webp",
      "/assets/villas/the-angle-house/gallery-6.webp",
      "/assets/villas/the-angle-house/gallery-7.webp",
      "/assets/villas/the-angle-house/gallery-8.webp",
      "/assets/villas/the-angle-house/gallery-9.webp",
      "/assets/villas/the-angle-house/gallery-10.webp",
      "/assets/villas/the-angle-house/gallery-12.webp",
      "/assets/villas/the-angle-house/gallery-14.webp",
      "/assets/villas/the-angle-house/gallery-15.webp",
      "/assets/villas/the-angle-house/gallery-16.webp",
      "/assets/villas/the-angle-house/gallery-17.webp",
      "/assets/villas/the-angle-house/gallery-18.webp"
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

  // Mock bookings cleared from production seed

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
