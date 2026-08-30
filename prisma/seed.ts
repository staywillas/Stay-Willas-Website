import "dotenv/config";
import { prisma } from "../src/lib/db";

const villasData = [
  {
    id: "lonavala-estate",
    slug: "the-angle-house",
    name: "The Angle House",
    location: "Kamshet, Lonavala, Maharashtra",
    category: "Infinity Pools",
    description: `Imagine waking up to the gentle breeze of the hills, surrounded by sleek glass walls and towering trees. Welcome to The Angle House, a stunning designer villa where dramatic modern architecture meets forest serenity. Characterized by its striking angular glass-facade design, this estate is a genuinely unique retreat that stands out in Lonavala's landscape. Located a short, convenient drive from Mumbai and Pune, it is the perfect sanctuary to unwind with your loved ones.

Step outside onto the main deck, and you will find your own private swimming pool, complete with a soothing waterfall feature, outdoor lounge chairs, and cozy corners to sit. It is a perfect setting for family getaways, milestone birthdays, or quiet weekend escapes.

Inside, the slow luxury continues. The villa features three spacious, beautifully appointed bedrooms that can comfortably sleep up to 16 guests. The master suite offers a private in-room jacuzzi, providing the ultimate space to rejuvenate.

To elevate your stay, the villa is fully pet-friendly, welcoming your furry companions to run on the lush lawns. We also offer a dedicated private chef who specializes in preparing fresh, custom veg-only and Jain food spreads in separate setups. Book your escape today and experience the absolute peak of modern architectural luxury.`,
    price: 13000,
    weekendPrice: 20000,
    fridayPrice: 15000,
    saturdayPrice: 20000,
    sundayPrice: 13000,
    baseGuests: 12,
    extraGuestFee: 1200,
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
    id: "khopoli-canopy-crest",
    slug: "canopy-crest",
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    category: "Private Estates",
    description: `Spread across an expansive field, this sprawling holiday getaway home is tucked away from bustling city life to provide you with a perfect window of relaxation. Located near Khopoli, it is the perfect sanctuary to rejuvenate, detox, and unwind. The villa features eclectic interiors, along with lavish amenities. Rejuvenate, detox, and unwind at this serene home, that is enveloped in lush verdant cover of greenery and towering hills. Savour the misty breeze in the mornings, relax on the lounge-worthy sit-outs, and make the most of the relaxing swimming pool, one of the key features of this beautiful villa. Guests can take a peaceful walk in the lawn and embrace the beauty of the overlooking mountainscapes and the horizon of the manicured fields around the villa. Imagine yourself, relishing a delicious barbeque by the pool living your best getaway, at the Canopy Crest.`,
    price: 15000,
    weekendPrice: 22000,
    fridayPrice: 18000,
    saturdayPrice: 22000,
    sundayPrice: 22000,
    baseGuests: 12,
    extraGuestFee: 1200,
    guests: 16,
    bedrooms: 4,
    bathrooms: 5,
    images: [
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0014.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg"
    ],
    amenities: [
      "Private Swimming Pool",
      "Indoor/Outdoor Games",
      "Music System/Speaker",
      "Balcony/Terrace",
      "Wheelchair Friendly",
      "CCTV Security",
      "Extra Mattress",
      "Geyser",
      "Wardrobes",
      "Towels & Toiletries",
      "Meals Available",
      "Senior Citizen Friendly",
      "Spacious Lawn"
    ]
  },
  {
    id: "lonavala-willow-peak",
    slug: "willow-peak",
    name: "Willow Peak",
    location: "Kurwande, Lonavala, Maharashtra",
    category: "Mountain View",
    description: `Escape to Willow Peak in Kurwande, Lonavala — a charming scenic retreat featuring 3 private individual cottages with distinct A-frame architecture surrounded by lush gardens and mountain greenery. Nestled in the serene hills of Kurwande near Lonavala, each private cottage accommodates up to 4 guests and offers air-conditioned bedrooms with comfortable double beds, attached bathrooms with modern shower facilities, and soothing jacuzzi baths.
    
With 3 standalone cottages on site (hosting up to 12 guests total), groups can book 1, 2, or all 3 cottages depending on party size. Soak in breathtaking mountain views from private cottage sit-outs, unwind in the manicured gardens, or gather around the outdoor dining area and BBQ facility. Complete with carrom board entertainment, well-lit outdoor evening spaces, secure parking, television, and high-speed Wi-Fi, Willow Peak is the ideal sanctuary for peaceful staycations with family and friends.`,
    price: 14000,
    weekendPrice: 22000,
    fridayPrice: 17000,
    saturdayPrice: 22000,
    sundayPrice: 15000,
    baseGuests: 4,
    extraGuestFee: 1200,
    guests: 12,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/willow-peak/main.webp",
      "/assets/villas/willow-peak/gallery-13.webp",
      "/assets/villas/willow-peak/gallery-14.webp",
      "/assets/villas/willow-peak/gallery-12.webp",
      "/assets/villas/willow-peak/gallery-1.webp",
      "/assets/villas/willow-peak/gallery-2.webp",
      "/assets/villas/willow-peak/gallery-3.webp",
      "/assets/villas/willow-peak/gallery-4.webp",
      "/assets/villas/willow-peak/gallery-5.webp",
      "/assets/villas/willow-peak/gallery-6.webp",
      "/assets/villas/willow-peak/gallery-7.webp",
      "/assets/villas/willow-peak/gallery-8.webp",
      "/assets/villas/willow-peak/gallery-9.webp",
      "/assets/villas/willow-peak/gallery-10.webp",
      "/assets/villas/willow-peak/gallery-11.webp",
      "/assets/villas/willow-peak/gallery-15.webp"
    ],
    amenities: [
      "Individual Cottages",
      "A-Frame / Cottage-Style Architecture",
      "Air-Conditioned Rooms",
      "Comfortable Double Beds",
      "Television",
      "Wi-Fi",
      "Attached Bathrooms",
      "Shower Facilities",
      "Jacuzzi Bath",
      "Mountain / Scenic Views",
      "Garden & Greenery",
      "Outdoor Seating",
      "Outdoor Dining Area",
      "Carrom Board",
      "BBQ Facility",
      "Parking",
      "Well-Lit Outdoor Areas",
      "Cottage Sit-Outs"
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
