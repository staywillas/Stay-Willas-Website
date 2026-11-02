export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "willow-peak" | "booking" | "food" | "pools" | "policies" | "cancellations" | "travel" | "owners";
  categoryLabel: string;
  tags: string[];
}

export interface FAQCategory {
  id: string;
  label: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: "all", label: "All Questions" },
  { id: "willow-peak", label: "Willow Peak & Properties" },
  { id: "booking", label: "Booking, Pricing & 0% Fees" },
  { id: "food", label: "Food, Chef & Meal Plans" },
  { id: "pools", label: "Private Pools & Amenities" },
  { id: "policies", label: "Policies, KYC & House Rules" },
  { id: "cancellations", label: "Cancellations & Refunds" },
  { id: "travel", label: "Locations & Driving Times" },
  { id: "owners", label: "Homeowners & Partnerships" },
];

export const FAQS_DATA: FAQItem[] = [
  // ── Willow Peak & Villa Configurations ──
  {
    id: "willow-peak-explanation",
    question: "What is Willow Peak? Is it 1 single villa or 4 different properties?",
    answer: "Willow Peak in Kurwande, Lonavala has three private A-frame cottages: Breeze, Crest and Heaven. Each cottage has an in-room Jacuzzi and sleeps up to four guests. You can book one cottage for a small group or book all three together for up to twelve guests. A booking of all three gives your group private use of the lawns, valley gazebo, dining deck and bonfire area. The website shows each cottage and the all-three-cottage stay as separate booking options; check the calendar for availability.",
    category: "willow-peak",
    categoryLabel: "Willow Peak & Properties",
    tags: ["willow peak", "cottage", "4 listings", "breeze", "crest", "heaven", "all three cottages", "lonavala", "jacuzzi"],
  },
  {
    id: "willow-peak-pool-or-jacuzzi",
    question: "Does Willow Peak have a swimming pool?",
    answer: "No. Willow Peak is a collection of three A-frame cottages in Kurwande, Lonavala. Each cottage has its own private Jacuzzi. For a private swimming pool, explore **The Angle House** in Kamshet, **Canopy Crest** in Khopoli, or **Casa De Reva** in Panchgani.",
    category: "willow-peak",
    categoryLabel: "Willow Peak & Properties",
    tags: ["willow peak", "swimming pool", "jacuzzi", "lonavala", "pool"],
  },
  {
    id: "portfolio-differences",
    question: "What is the difference between The Angle House, Canopy Crest, and Casa De Reva?",
    answer: "Each Stay Willas villa has its own distinct character, architecture, and geographic advantage:\n\n• **The Angle House (Kamshet, Lonavala):** 3-BHK architectural masterwork featuring angular geometry, a private swimming pool, master suite Jacuzzi, double-height glass living lounge, senior-friendly ground-floor bedroom, and fully fenced pet-friendly lawns. Accommodates up to 12 guests.\n• **Canopy Crest (Khopoli):** 4-BHK grand private villa with an expansive 22x12 ft private swimming pool, lush greenery, and scenic mountain views. It is just 75 minutes from Mumbai and conveniently bypasses the Khandala ghat traffic. Accommodates up to 16 guests.\n• **Casa De Reva (Kaswand, Panchgani):** 4-BHK colonial-inspired luxury villa with a 100% private swimming pool, sun deck, gazebo, and crisp mountain breeze, situated just 10 minutes from Mapro Garden and Table Land. Accommodates up to 14 guests.",
    category: "willow-peak",
    categoryLabel: "Willow Peak & Properties",
    tags: ["angle house", "canopy crest", "casa de reva", "difference", "lonavala", "khopoli", "panchgani", "capacity"],
  },
  {
    id: "entire-villa-vs-rooms",
    question: "Can we rent just one room in a villa, or do we have to book the entire villa?",
    answer: "For our luxury villas (**The Angle House**, **Canopy Crest**, and **Casa De Reva**), you book the whole villa for your group. We never rent rooms to strangers or separate parties at the same time, so you have private use of the villa and pool.\n\nAt **Willow Peak**, you can book Breeze, Crest or Heaven separately for up to four guests, or book all three cottages together for up to twelve guests.",
    category: "willow-peak",
    categoryLabel: "Willow Peak & Properties",
    tags: ["entire villa", "rooms", "privacy", "exclusive", "sharing"],
  },

  // ── Booking, Pricing & 0% Fees ──
  {
    id: "zero-commission-booking",
    question: "Why should I book directly on StayWillas.com instead of Airbnb or MakeMyTrip?",
    answer: "When you book directly on StayWillas.com, you get **100% direct homeowner pricing with 0% platform booking commission**, which saves you 15% to 25% compared to online travel agencies (OTAs). Additionally, direct bookings unlock:\n\n• Direct access to our on-ground concierge team via WhatsApp.\n• Direct coordination for customized Jain, vegetarian, or regional chef menus.\n• Exclusive direct weekday discount codes (such as coupon code **Stayw26** for up to 26% off select weekday stays).\n• Flexible scheduling and transparent communication with zero third-party call center delays.",
    category: "booking",
    categoryLabel: "Booking, Pricing & 0% Fees",
    tags: ["direct booking", "airbnb", "makemytrip", "commission", "cheaper", "discount", "stayw26"],
  },
  {
    id: "starting-price-breakdown",
    question: "What does the starting price shown on property cards include?",
    answer: "The price shown on property cards is the base accommodation rate per night for the villa's base guest capacity. It includes exclusive private access to the entire villa, private pool or Jacuzzi, private lawns, Wi-Fi, power backup, and dedicated on-site caretaker assistance.\n\nExtra guests and optional meals may affect the quote. Discuss the full price and any applicable charges with the team before confirming.",
    category: "booking",
    categoryLabel: "Booking, Pricing & 0% Fees",
    tags: ["price", "starting price", "breakdown", "hidden charges", "taxes", "cost"],
  },
  {
    id: "extra-guest-charges",
    question: "How do extra guest fees work if our group size is larger than base capacity?",
    answer: "Each villa specifies a base capacity (e.g. 10 or 12 guests). If your party includes additional guests beyond this base number, an extra guest fee (per person, per night) applies. This nominal charge covers extra premium floor mattresses, sanitized fresh bed linens, blankets, towels, toiletries, and additional caretaker staffing to ensure comfort for everyone.",
    category: "booking",
    categoryLabel: "Booking, Pricing & 0% Fees",
    tags: ["extra guests", "mattress", "group size", "capacity", "charges"],
  },
  {
    id: "payment-methods",
    question: "What payment methods are accepted for confirming a reservation?",
    answer: "We support all major payment modes including Credit Cards (Visa, MasterCard, American Express), Debit Cards, Net Banking, and UPI handles via our secure Stripe payment gateway. You can also confirm bookings directly via official company bank transfer or UPI with our concierge team on WhatsApp.",
    category: "booking",
    categoryLabel: "Booking, Pricing & 0% Fees",
    tags: ["payment", "credit card", "upi", "stripe", "bank transfer"],
  },
  {
    id: "day-visitors-events",
    question: "Can we invite day visitors or non-staying guests for an evening celebration?",
    answer: "Every property has a licensed municipal guest capacity limit. Canopy Crest accommodates up to 16 guests, The Angle House up to 12 guests, and Casa De Reva up to 14 guests. If you wish to host day visitors who will not stay overnight, you must inform and receive prior written approval from our concierge before booking. Unregistered visitors arriving without notice are strictly prohibited.",
    category: "booking",
    categoryLabel: "Booking, Pricing & 0% Fees",
    tags: ["day visitors", "visitors", "party guests", "capacity", "events"],
  },

  // ── Food, Chef & Meal Plans ──
  {
    id: "chef-and-meals",
    question: "How do meals and chef services work at Stay Willas properties?",
    answer: "Every Stay Willas property features dedicated on-site culinary caretakers or personal chefs. You can enjoy wholesome, home-style meals without leaving the villa:\n\n• **All-Inclusive Meal Packages:** Covering hearty breakfast, traditional lunch, evening high-tea with hot snacks, and dinner.\n• **Catering Flexibility:** We share the complete food menu with you upon booking so you can pre-select dishes for each meal.\n• **Grocery at Actuals:** For select properties, you can provide groceries or reimburse our caretaker at actual market rates plus a reasonable culinary preparation charge. Connect with our concierge to select the right dining option for your stay.",
    category: "food",
    categoryLabel: "Food, Chef & Meal Plans",
    tags: ["chef", "meals", "food", "cook", "menu", "breakfast", "dinner"],
  },
  {
    id: "pure-veg-and-jain-food",
    question: "Do you cater 100% Pure Vegetarian and authentic Jain food?",
    answer: "Yes, absolutely! We regularly host vegetarian and Jain families. Our culinary team prepares strictly authentic Jain meals (with zero onion, zero garlic, and no root vegetables) and pure vegetarian dishes using clean, dedicated cookware and separate utensils to honor your religious and dietary practices.",
    category: "food",
    categoryLabel: "Food, Chef & Meal Plans",
    tags: ["jain", "pure veg", "vegetarian", "no onion", "no garlic", "separate utensils"],
  },
  {
    id: "non-veg-and-barbecue",
    question: "Can we request non-vegetarian dishes and live poolside barbecues?",
    answer: "Yes! Our chefs specialize in authentic regional non-vegetarian delicacies including Maharashtrian chicken and mutton curries, coastal fish fry, Kolhapuri gravy, and butter chicken. We also arrange evening coal barbecue grills (marinated chicken skewers, paneer tikka, grilled pineapple, and spiced corn) set up by the pool deck or lawn upon prior request.",
    category: "food",
    categoryLabel: "Food, Chef & Meal Plans",
    tags: ["non veg", "chicken", "mutton", "bbq", "barbecue", "grill", "poolside"],
  },
  {
    id: "kitchen-access",
    question: "Can guests cook in the villa kitchen themselves?",
    answer: "To maintain commercial hygiene and kitchen equipment safety, our in-villa kitchens are managed by our trained caretakers and chefs. However, guests are welcome to use the kitchen for heating milk, warming baby food, making tea/coffee, or preparing light infant meals. Full self-cooking arrangements must be approved by the concierge prior to arrival.",
    category: "food",
    categoryLabel: "Food, Chef & Meal Plans",
    tags: ["self cooking", "kitchen access", "baby food", "cook ourselves"],
  },

  // ── Private Pools & Amenities ──
  {
    id: "pool-privacy",
    question: "Is the swimming pool 100% private, or is it shared with other guests?",
    answer: "At **The Angle House**, **Canopy Crest**, and **Casa De Reva**, the swimming pool is **100% exclusive to your group**. You will never share the pool or pool deck with any strangers, and there are no rigid hotel closing hours like 7:00 PM. You can swim, sunbathe, and enjoy private evening pool sessions at your leisure.",
    category: "pools",
    categoryLabel: "Private Pools & Amenities",
    tags: ["pool", "private pool", "shared pool", "privacy", "timings"],
  },
  {
    id: "pool-cleaning-hygiene",
    question: "How are the swimming pools cleaned and maintained for hygiene?",
    answer: "Pool hygiene is our highest operational priority. Before every single check-in, our pools undergo a multi-stage filtration and sanitization cycle. On-site staff perform daily morning maintenance, skim leaves, check chlorine/pH balances, and log pool inspection photos directly into our proprietary Stay Willas Care app.",
    category: "pools",
    categoryLabel: "Private Pools & Amenities",
    tags: ["pool cleaning", "hygiene", "sanitized", "water quality", "filtration"],
  },
  {
    id: "pool-safety-kids-seniors",
    question: "Are the pools safe for young children and elderly family members?",
    answer: "Yes. All our private pools are built with gradual entry steps and non-slip pool deck tiles. Pool depths generally range from 4 to 4.5 feet, making them comfortable for leisure swimming and family water games. Children must always be supervised by an adult when near or inside the pool area.",
    category: "pools",
    categoryLabel: "Private Pools & Amenities",
    tags: ["kids safety", "child friendly", "elderly", "depth", "steps", "safety"],
  },
  {
    id: "wifi-and-power-backup",
    question: "Is there high-speed Wi-Fi and power backup for remote work or workations?",
    answer: "Yes. All our luxury properties are equipped with high-speed fiber broadband Wi-Fi (speeds typically 50–100 Mbps) capable of handling video calls and remote work. Additionally, our villas have inverter / generator power backup systems in place to ensure lights, Wi-Fi, and ceiling fans stay running seamlessly even during localized grid outages or monsoon weather.",
    category: "pools",
    categoryLabel: "Private Pools & Amenities",
    tags: ["wifi", "internet", "power backup", "inverter", "generator", "workation"],
  },
  {
    id: "games-and-entertainment",
    question: "What indoor and outdoor entertainment options are available?",
    answer: "Our villas feature private manicured lawns for box cricket, badminton, and outdoor lounging, alongside indoor entertainment amenities including smart TVs (with OTT streaming apps), Bluetooth sound systems, carrom boards, playing cards, board games, and book corners.",
    category: "pools",
    categoryLabel: "Private Pools & Amenities",
    tags: ["entertainment", "games", "cricket", "badminton", "carrom", "smart tv", "music system"],
  },

  // ── Policies, Rules, KYC & Pets ──
  {
    id: "checkin-checkout-times",
    question: "What are the standard Check-in and Check-out timings? Can we request early check-in?",
    answer: "Our standard timings are:\n\n• **Check-in:** 2:00 PM\n• **Check-out:** 11:00 AM\n\nThis 3-hour buffer between 11:00 AM and 2:00 PM is essential for our housekeeping staff to sanitize the swimming pool, change all bed linens and towels, and deep-clean the villa. Early check-in or late check-out is subject to calendar availability and can be arranged with our concierge (nominal hourly fees may apply if another guest is checking out or checking in on the same day).",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["check in", "check out", "timings", "early check in", "late check out"],
  },
  {
    id: "kyc-requirements",
    question: "What documents are required for KYC guest verification?",
    answer: "Under Maharashtra state lodging regulations and police safety compliance, all adult guests (18+) staying overnight must submit a valid government-issued photo ID (such as an **Aadhaar Card, Passport, or Driving License**) prior to or upon check-in. PAN cards are not accepted as valid proof of address.",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["kyc", "id proof", "aadhaar", "passport", "police verification", "rules"],
  },
  {
    id: "pet-friendly-policy",
    question: "Are pets allowed at Stay Willas villas?",
    answer: "Yes, we love pets! Signature villas like **The Angle House** and **Canopy Crest** feature fully enclosed, gated green lawns where dogs and pets can play safely. We ask pet owners to inform the concierge in advance, bring their pet's own bedding and food bowls, and ensure pets do not enter the swimming pool or recline directly on bedroom sofas and mattresses.",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["pets", "dog friendly", "pet friendly", "animals", "lawn"],
  },
  {
    id: "music-and-noise-rules",
    question: "Can we play music and host parties at the villa?",
    answer: "Yes! Our villas have sound systems and private living lounges perfect for celebrations, cake cuttings, and family fun. In compliance with local government tranquility and environmental norms, outdoor loud speakers must be turned down after **10:00 PM**. You can continue playing music and celebrating inside the sound-insulated, air-conditioned living rooms throughout the night.",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["music", "noise", "party", "loud music", "10 pm", "speakers"],
  },
  {
    id: "unmarried-couples-and-bachelors",
    question: "Are unmarried couples and bachelor groups allowed?",
    answer: "Yes, all adult guests (18+) with valid government photo identification are welcome at Stay Willas. We do not discriminate based on marital status. We simply expect all guests to maintain social decency, treat the property and staff respectfully, and adhere to standard house rules.",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["unmarried couples", "bachelors", "couples friendly", "rules"],
  },
  {
    id: "security-deposit",
    question: "Is there a security deposit, and when is it refunded?",
    answer: "Yes, a refundable security deposit (typically ₹5,000 to ₹10,000 depending on villa size and party composition) is collected at the time of check-in to cover accidental breakages or property damages. The deposit is refunded in full via UPI or bank transfer on the day of check-out after a quick property walkthrough by our caretaker.",
    category: "policies",
    categoryLabel: "Policies, KYC & House Rules",
    tags: ["security deposit", "refundable", "damage deposit", "refund"],
  },

  // ── Cancellations & Refunds ──
  {
    id: "cancellation-slabs",
    question: "What is the cancellation and refund policy if our plans change?",
    answer: "Please call the Stay Willas team to discuss cancellation, refund or rescheduling arrangements for your booking. Ask for the applicable terms before confirming your stay.",
    category: "cancellations",
    categoryLabel: "Cancellations & Refunds",
    tags: ["cancellation", "refund", "cancel booking", "refund slabs", "rescheduling"],
  },
  {
    id: "rescheduling-booking",
    question: "Can we reschedule our stay to different dates instead of cancelling?",
    answer: "Please call the Stay Willas team to discuss changing your dates, availability and any change in the price.",
    category: "cancellations",
    categoryLabel: "Cancellations & Refunds",
    tags: ["reschedule", "change dates", "postpone", "modify booking"],
  },

  // ── Locations & Driving Times ──
  {
    id: "driving-distances-times",
    question: "How far are the properties from Mumbai and Pune?",
    answer: "Our stays are in several destinations:\n\n• **Canopy Crest:** Khopoli.\n• **The Angle House:** Kamshet, near Lonavala.\n• **Willow Peak:** Kurwande, Lonavala.\n• **Casa De Reva:** Kaswand, Panchgani.\n\nDriving times vary with your starting point, traffic and weather; check a current map before leaving.",
    category: "travel",
    categoryLabel: "Locations & Driving Times",
    tags: ["distance", "driving time", "mumbai to lonavala", "pune to lonavala", "khopoli", "panchgani", "directions"],
  },
  {
    id: "parking-facilities",
    question: "Is secure parking available on premises for multiple cars?",
    answer: "Yes. All Stay Willas villas feature secure, gated, on-premise private parking with ample space for 3 to 6 cars, including easy driveway access for SUVs and vans.",
    category: "travel",
    categoryLabel: "Locations & Driving Times",
    tags: ["parking", "cars", "suv", "safe parking", "driveway"],
  },
  {
    id: "senior-citizen-friendly",
    question: "Are the villas accessible and comfortable for grandparents and senior citizens?",
    answer: "Yes. Signature villas like **The Angle House** and **Canopy Crest** feature step-free ground-floor master bedrooms with attached ensuite bathrooms, wide corridors, and flat paved pathways connecting the living room, dining area, and veranda so elderly family members can move around with ease and comfort.",
    category: "travel",
    categoryLabel: "Locations & Driving Times",
    tags: ["senior citizens", "grandparents", "elderly", "ground floor bedroom", "wheelchair friendly"],
  },

  // ── Homeowners & Partnerships ──
  {
    id: "partner-with-stay-willas",
    question: "I own a luxury villa in Maharashtra. How can I partner with Stay Willas?",
    answer: "We partner with selected luxury property owners across Lonavala, Khopoli, Alibaug, Panchgani, and Mahabaleshwar. Stay Willas handles end-to-end turnkey operations:\n\n• Curated marketing and high-yield guest reservations.\n• Elite, verified guest screening.\n• 24/7 on-ground caretakers, housekeeping, and pool maintenance.\n• Dynamic pricing algorithms to maximize annual yield.\n• 100% owner stay flexibility with zero blackout date restrictions.\n\nVisit our [Partner With Us](/partner) page or speak with our homeowner acquisition team to request a confidential property review.",
    category: "owners",
    categoryLabel: "Homeowners & Partnerships",
    tags: ["partner", "list villa", "homeowner", "property management", "monetize", "earn"],
  },
];
