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
      "/assets/villas/the-angle-house/gallery-14.webp",
      "/assets/villas/the-angle-house/gallery-16.webp",
      "/assets/villas/the-angle-house/gallery-15.webp",
      "/assets/villas/the-angle-house/gallery-17.webp",
      "/assets/villas/the-angle-house/gallery-6.webp",
      "/assets/villas/the-angle-house/gallery-9.webp",
      "/assets/villas/the-angle-house/gallery-19.webp",
      "/assets/villas/the-angle-house/main.webp",
      "/assets/villas/the-angle-house/gallery-10.webp",
      "/assets/villas/the-angle-house/gallery-3.webp",
      "/assets/villas/the-angle-house/gallery-4.webp",
      "/assets/villas/the-angle-house/gallery-2.webp",
      "/assets/villas/the-angle-house/gallery-13.webp",
      "/assets/villas/the-angle-house/gallery-1.webp",
      "/assets/villas/the-angle-house/gallery-5.webp",
      "/assets/villas/the-angle-house/gallery-12.webp",
      "/assets/villas/the-angle-house/gallery-7.webp",
      "/assets/villas/the-angle-house/gallery-8.webp",
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
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0014.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg"
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
    description: `Escape to Willow Peak in Kurwande, Lonavala — a charming scenic retreat featuring 3 private individual cottages (Cottage A, B, and C) with distinct A-frame architecture surrounded by lush gardens and mountain greenery. Nestled in the serene hills of Kurwande near Lonavala, each private cottage accommodates up to 4 guests and offers air-conditioned bedrooms with comfortable double beds, attached bathrooms with modern shower facilities, and soothing private jacuzzi baths.
    
With 3 standalone cottages on site (hosting up to 12 guests total), guests can book individual cottages (Cottage A, B, or C) starting from ₹5,999/night, or reserve all 3 cottages together for exclusive private estate access. Soak in breathtaking mountain views from private cottage sit-outs, unwind in the manicured gardens, or gather around the outdoor dining area and BBQ facility. Complete with carrom board entertainment, well-lit outdoor evening spaces, secure parking, television, and high-speed Wi-Fi, Willow Peak is the ideal sanctuary for peaceful staycations with family and friends.`,
    price: 5999,
    weekendPrice: 8999,
    fridayPrice: 6999,
    saturdayPrice: 8999,
    sundayPrice: 6999,
    baseGuests: 4,
    extraGuestFee: 1000,
    guests: 12,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/willow-peak/gallery-12.webp",
      "/assets/villas/willow-peak/gallery-6.webp",
      "/assets/villas/willow-peak/gallery-7.webp",
      "/assets/villas/willow-peak/gallery-1.webp",
      "/assets/villas/willow-peak/gallery-4.webp",
      "/assets/villas/willow-peak/gallery-5.webp",
      "/assets/villas/willow-peak/gallery-2.webp",
      "/assets/villas/willow-peak/gallery-3.webp",
      "/assets/villas/willow-peak/main.webp",
      "/assets/villas/willow-peak/gallery-13.webp",
      "/assets/villas/willow-peak/gallery-14.webp",
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

  console.log("Seeding verified guest reviews...");
  const reviewsData = [
    // The Angle House Reviews
    {
      villaId: "lonavala-estate",
      userId: "guest_rohan_mehta",
      userName: "Rohan & Priya Mehta (Bandra, Mumbai)",
      rating: 5,
      comment: "The Monsoon Escape at The Angle House was breathtaking! The waterfall pool in the rain and glass facade view of Sahyadri clouds made it unforgettable. Kailash's culinary team prepared steaming hot pakoras & tea!",
    },
    {
      villaId: "lonavala-estate",
      userId: "guest_vikram_singhania",
      userName: "Vikram Singhania (Koregaon Park, Pune)",
      rating: 5,
      comment: "Booked directly via WhatsApp for our weekday stay. Saved significantly compared to OTA platforms, and the caretaker had the master jacuzzi ready before check-in.",
    },
    {
      villaId: "lonavala-estate",
      userId: "guest_aditi_deshmukh",
      userName: "Aditi Deshmukh (Thane, Mumbai)",
      rating: 5,
      comment: "Our Golden Retriever had the best time running across the fenced lawns! Total peace of mind for pet parents.",
    },
    {
      villaId: "lonavala-estate",
      userId: "guest_sameer_kulkarni",
      userName: "Sameer Kulkarni (Kothrud, Pune)",
      rating: 5,
      comment: "Celebrated my 30th birthday here with 12 friends on a weekday. Cleanest pool in Lonavala and zero noise disturbances.",
    },
    // Canopy Crest Reviews
    {
      villaId: "khopoli-canopy-crest",
      userId: "guest_anand_joshi",
      userName: "Anand & Shweta Joshi (Dadar, Mumbai)",
      rating: 5,
      comment: "The Monsoon Escape at Canopy Crest was unbelievable! The massive open lawn turns emerald green in the rains and the 22ft pool is huge. We booked for 16 family members and had a fantastic experience!",
    },
    {
      villaId: "khopoli-canopy-crest",
      userId: "guest_rahul_verma",
      userName: "Rahul Verma (Tech Mahindra, Pune)",
      rating: 5,
      comment: "Organized our startup leadership offsite here for 2 weekday nights. High-speed Wi-Fi, great indoor games, and direct WhatsApp concierge booking was seamless.",
    },
    {
      villaId: "khopoli-canopy-crest",
      userId: "guest_deepak_sharma",
      userName: "Deepak Sharma (Navi Mumbai)",
      rating: 5,
      comment: "Hardly 1 hour drive from Mumbai via the Expressway. The mountain views and fresh barbecue by the pool during monsoon made our stay unforgettable.",
    },
    {
      villaId: "khopoli-canopy-crest",
      userId: "guest_pooja_hegde",
      userName: "Pooja Hegde (Andheri West, Mumbai)",
      rating: 5,
      comment: "Cleanest bathrooms, powerful air conditioning, and absolute seclusion without noisy neighbors. We are coming back every monsoon!",
    },
    // Willow Peak Reviews
    {
      villaId: "lonavala-willow-peak",
      userId: "guest_kunal_patel",
      userName: "Kunal & Neha Patel (Vile Parle, Mumbai)",
      rating: 5,
      comment: "Willow Peak in Kurwande is an absolute hidden gem! The A-frame cottages are super cozy with in-room jacuzzi baths and serene hill views.",
    },
    {
      villaId: "lonavala-willow-peak",
      userId: "guest_siddharth_rao",
      userName: "Siddharth Rao (Baner, Pune)",
      rating: 5,
      comment: "We booked 2 cottages for a weekend getaway with friends. The garden sit-out, barbecue setup, and quiet surroundings were wonderful.",
    },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({ data: r });
  }

  console.log(`- Seeded ${reviewsData.length} verified reviews.`);

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
