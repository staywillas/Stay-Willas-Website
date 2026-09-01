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

Inside, the slow luxury continues. The villa features three spacious, beautifully appointed bedrooms that can comfortably sleep up to 12 guests. The master suite offers a private in-room jacuzzi, providing the ultimate space to rejuvenate.

To elevate your stay, the villa is fully pet-friendly, welcoming your furry companions to run on the lush lawns. We also offer a dedicated private chef who specializes in preparing fresh, custom veg-only and Jain food spreads in separate setups. Book your escape today and experience the absolute peak of modern architectural luxury.`,
    price: 13000,
    weekendPrice: 20000,
    fridayPrice: 15000,
    saturdayPrice: 20000,
    sundayPrice: 13000,
    baseGuests: 8,
    extraGuestFee: 1000,
    guests: 12,
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
    id: "lonavala-willow-peak-cottage-a",
    slug: "willow-peak-cottage-a",
    name: "Willow Peak - Cottage A",
    location: "Kurwande, Lonavala, Maharashtra",
    category: "Mountain Cottages",
    description: `Escape to Willow Peak - Cottage A in Kurwande, Lonavala — a charming private 1 BHK A-frame cottage accommodating up to 4 guests. Nestled in the serene hills of Kurwande near Lonavala, this cottage features an air-conditioned bedroom with a comfortable double bed, an attached modern bathroom with shower, a soothing in-room jacuzzi bath, and a private outdoor sit-out with lush garden views. Complete with Wi-Fi, television, BBQ facility, and peaceful mountain ambiance, it is the ideal romantic or small-family sanctuary.`,
    price: 4999,
    weekendPrice: 6999,
    fridayPrice: 5999,
    saturdayPrice: 6999,
    sundayPrice: 4999,
    baseGuests: 2,
    extraGuestFee: 800,
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/assets/villas/willow-peak/gallery-12.webp",
      "/assets/villas/willow-peak/gallery-6.webp",
      "/assets/villas/willow-peak/gallery-7.webp",
      "/assets/villas/willow-peak/gallery-1.webp",
      "/assets/villas/willow-peak/gallery-4.webp",
      "/assets/villas/willow-peak/gallery-5.webp",
      "/assets/villas/willow-peak/gallery-2.webp",
      "/assets/villas/willow-peak/gallery-3.webp"
    ],
    amenities: [
      "1 BHK A-Frame Cottage",
      "Private Jacuzzi Bath",
      "Air-Conditioned Room",
      "Comfortable Double Bed",
      "Television",
      "Super-fast Wi-Fi",
      "Attached Bathroom",
      "Shower Facilities",
      "Mountain & Garden Views",
      "Private Sit-Out",
      "Outdoor Dining & BBQ Area",
      "Carrom Board",
      "Parking"
    ]
  },
  {
    id: "lonavala-willow-peak-cottage-b",
    slug: "willow-peak-cottage-b",
    name: "Willow Peak - Cottage B",
    location: "Kurwande, Lonavala, Maharashtra",
    category: "Mountain Cottages",
    description: `Welcome to Willow Peak - Cottage B in Kurwande, Lonavala. A cozy standalone A-frame wooden cottage hosting up to 4 guests with distinct alpine architecture. Features a restful air-conditioned bedroom, an attached bathroom, a relaxing in-room private jacuzzi bath, and a scenic garden sit-out overlooking the Sahyadri mountains. Equipped with high-speed Wi-Fi, television, BBQ area, and dedicated parking.`,
    price: 4999,
    weekendPrice: 6999,
    fridayPrice: 5999,
    saturdayPrice: 6999,
    sundayPrice: 4999,
    baseGuests: 2,
    extraGuestFee: 800,
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/assets/villas/willow-peak/gallery-12.webp",
      "/assets/villas/willow-peak/gallery-6.webp",
      "/assets/villas/willow-peak/gallery-7.webp",
      "/assets/villas/willow-peak/gallery-13.webp",
      "/assets/villas/willow-peak/gallery-14.webp",
      "/assets/villas/willow-peak/gallery-8.webp",
      "/assets/villas/willow-peak/gallery-9.webp",
      "/assets/villas/willow-peak/gallery-10.webp"
    ],
    amenities: [
      "1 BHK A-Frame Cottage",
      "Private Jacuzzi Bath",
      "Air-Conditioned Room",
      "Comfortable Double Bed",
      "Television",
      "Super-fast Wi-Fi",
      "Attached Bathroom",
      "Shower Facilities",
      "Mountain & Garden Views",
      "Private Sit-Out",
      "Outdoor Dining & BBQ Area",
      "Carrom Board",
      "Parking"
    ]
  },
  {
    id: "lonavala-willow-peak-cottage-c",
    slug: "willow-peak-cottage-c",
    name: "Willow Peak - Cottage C",
    location: "Kurwande, Lonavala, Maharashtra",
    category: "Mountain Cottages",
    description: `Unwind at Willow Peak - Cottage C in Kurwande, Lonavala. A secluded 1 BHK A-frame mountain cottage accommodating up to 4 guests. Features an attached private modern bathroom, soothing in-room jacuzzi bath, air-conditioned bedroom, peaceful sit-out deck surrounded by greenery, high-speed Wi-Fi, and television.`,
    price: 4999,
    weekendPrice: 6999,
    fridayPrice: 5999,
    saturdayPrice: 6999,
    sundayPrice: 4999,
    baseGuests: 2,
    extraGuestFee: 800,
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/assets/villas/willow-peak/gallery-12.webp",
      "/assets/villas/willow-peak/gallery-7.webp",
      "/assets/villas/willow-peak/gallery-6.webp",
      "/assets/villas/willow-peak/gallery-15.webp",
      "/assets/villas/willow-peak/gallery-11.webp",
      "/assets/villas/willow-peak/gallery-2.webp",
      "/assets/villas/willow-peak/gallery-3.webp",
      "/assets/villas/willow-peak/main.webp"
    ],
    amenities: [
      "1 BHK A-Frame Cottage",
      "Private Jacuzzi Bath",
      "Air-Conditioned Room",
      "Comfortable Double Bed",
      "Television",
      "Super-fast Wi-Fi",
      "Attached Bathroom",
      "Shower Facilities",
      "Mountain & Garden Views",
      "Private Sit-Out",
      "Outdoor Dining & BBQ Area",
      "Carrom Board",
      "Parking"
    ]
  },
  {
    id: "lonavala-willow-peak",
    slug: "willow-peak",
    name: "Willow Peak (Entire Estate - 3 Cottages)",
    location: "Kurwande, Lonavala, Maharashtra",
    category: "Mountain View",
    description: `Reserve the entire Willow Peak estate in Kurwande, Lonavala — comprising all 3 private standalone A-frame cottages (Cottages A, B, and C) for exclusive group use up to 12 guests. Perched in the serene hills of Kurwande near Lonavala, the estate features 3 air-conditioned bedrooms, 3 attached modern bathrooms, soothing private jacuzzi baths in each cottage, expansive manicured gardens, outdoor dining deck, and BBQ facilities. Complete with carrom board entertainment, well-lit outdoor evening spaces, secure parking, televisions, and high-speed Wi-Fi across the property. Ideal for multi-family gatherings, milestone celebrations, and group staycations.`,
    price: 17997,
    weekendPrice: 23997,
    fridayPrice: 20997,
    saturdayPrice: 23997,
    sundayPrice: 17997,
    baseGuests: 8,
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
      "3 Individual Standalone Cottages (Exclusive Estate)",
      "A-Frame Alpine Architecture",
      "Private Jacuzzi Baths in Each Cottage",
      "Air-Conditioned Bedrooms",
      "Comfortable Double Beds",
      "Televisions in Each Unit",
      "High-Speed Wi-Fi",
      "3 Attached Bathrooms",
      "Shower Facilities",
      "Panoramic Mountain Views",
      "Spacious Gardens & Greenery",
      "Outdoor Dining Area",
      "BBQ Facility",
      "Carrom Board Entertainment",
      "Secure Private Parking",
      "Well-Lit Evening Lawns",
      "Private Cottage Sit-Outs"
    ]
  },
  {
    id: "mahabaleshwar-terra-cotta",
    slug: "terra-cotta-villa",
    name: "Terra Cotta Villa",
    location: "Panchgani - Mahabaleshwar, Maharashtra",
    category: "Private Estates",
    description: `Immerse yourself in rustic mountain serenity at Terra Cotta Villa, a premier 4-BHK private pool sanctuary perched on the picturesque hills of Panchgani and Mahabaleshwar. Built with warm, earthy terracotta brick-style architecture, this private estate seamlessly blends timeless countryside charm with modern luxury amenities.

Step outside onto your private poolside deck surrounded by manicured lawns and towering hillscapes. Take a refreshing swim in the crystal-clear pool, relax under the private gazebo with misty valley breezes, or host memorable evening barbecues under the stars.

Inside, the villa offers 4 spacious, elegantly furnished air-conditioned bedrooms that comfortably host up to 16 guests, complete with private attached bathrooms, high-speed Wi-Fi, and plush bedding. The sprawling living and dining hall provides ample seating for family reunions, celebrations, and intimate getaways.

Located near Kaswand along the scenic Panchgani-Mahabaleshwar road, Terra Cotta Villa is just minutes away from Mapro Garden (4.5 km) and Lingmala Falls (11 km), offering effortless access to strawberry farms and panoramic viewpoints while remaining a peaceful private retreat.`,
    price: 14000,
    weekendPrice: 22000,
    fridayPrice: 18000,
    saturdayPrice: 22000,
    sundayPrice: 14000,
    baseGuests: 12,
    extraGuestFee: 1000,
    guests: 16,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg", // 1. Illuminated Luxury Exterior & Pool
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0035.jpg", // 2. Master Bedroom Suite
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg", // 3. Private Swimming Pool & Mountain Greenery
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0033.jpg", // 4. Daytime Exterior & Pool Deck
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0047.jpg", // 5. Bedroom Suite 2
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0055.jpg", // 6. Bedroom Suite 3
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0042.jpg", // 7. Bedroom Suite 4
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0053.jpg", // 8. Bedroom Suite 5
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0017.jpg", // 9. Night Pool Lighted View
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0049.jpg", // 10. Evening Villa Facade & Pool
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0031.jpg", // 11. Mountain Balcony Sit-out
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0054.jpg", // 12. Terracotta Brick Balcony Deck
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0034.jpg", // 13. Outdoor Gazebo Hill View Dining
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0043.jpg", // 14. Living Room & Lounge
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0046.jpg", // 15. Panoramic Window Living Area
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0050.jpg", // 16. Dining Area
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0060.jpg", // 17. Gourmet Food & Breakfast Spread
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0045.jpg", // 18. Bonfire & Barbecue Evening Setup
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0051.jpg", // 19. Poolside Carrom & Entertainment
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0059.jpg", // 20. Scenic Mountain Deck
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0032.jpg", // 21. Equipped Kitchen
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0048.jpg", // 22. Architectural Staircase & Interior
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0039.jpg", // 23. Luxury Bathroom
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0052.jpg", // 24. Bathroom with Shower
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0057.jpg", // 25. En-suite Vanity & Mirror
      "/assets/villas/terra-cotta-villa/IMG-20260901-WA0056.jpg"  // 26. Bedroom Suite
    ],
    amenities: [
      "Private Swimming Pool",
      "Expansive Lawn & Gazebo",
      "Air Conditioning",
      "Spacious Living Hall",
      "Music System / Speaker",
      "Indoor Games & Carrom",
      "Super-fast Wi-Fi",
      "Dedicated Caretaker",
      "Meals & Chef On-Demand",
      "BBQ Setup Available",
      "Secure On-Site Parking",
      "Mountain & Valley Views"
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
    // Terra Cotta Villa Reviews
    {
      villaId: "mahabaleshwar-terra-cotta",
      userId: "guest_tanvi_kapoor",
      userName: "Tanvi Kapoor (Juhu, Mumbai)",
      rating: 5,
      comment: "Terra Cotta Villa in Panchgani exceeded all our expectations! The rustic brick architecture and private swimming pool overlooking the hills made our family holiday magical.",
    },
    {
      villaId: "mahabaleshwar-terra-cotta",
      userId: "guest_harsh_patil",
      userName: "Harshvardhan Patil (Kothrud, Pune)",
      rating: 5,
      comment: "Stayed with a group of 14 friends for a 3-day weekend. Very close to Mapro Garden, huge lawn for evening music, and the on-demand chef made incredible local barbecue!",
    },
    {
      villaId: "mahabaleshwar-terra-cotta",
      userId: "guest_neelam_shah",
      userName: "Neelam & Rajesh Shah (Ahmedabad)",
      rating: 5,
      comment: "Peaceful hillside ambiance and spacious 4 BHK layout. The caretaker was exceptionally polite and helped us with strawberry picking recommendations nearby.",
    }
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
