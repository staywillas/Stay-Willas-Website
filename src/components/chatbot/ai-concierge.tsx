"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import { usePathname } from "next/navigation";
import VillaCard from "@/components/home/villa-card";
import { getConciergeRecommendation } from "@/app/actions/villa";

type Role = "bot" | "user";

interface Message {
  id: string;
  role: Role;
  content: React.ReactNode | string;
  options?: string[];
}

// Mock Villa for recommendation (Fallback)
const recommendedVilla = {
  id: "the-angle-house",
  name: "The Angle House",
  location: "Lonavala",
  image: "/assets/villas/the-angle-house/gallery-11.webp",
  price: "13,000",
  guests: 16,
  bedrooms: 3,
  bathrooms: 3,
};

export default function AiConcierge() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showCenterPopup, setShowCenterPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<"greeting" | "budget" | "guests" | "recommendation">("greeting");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("");
  const [matchedVilla, setMatchedVilla] = useState<any>(recommendedVilla);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-open assistant center popup after 5 seconds on landing (session-based, homepage only)
  useEffect(() => {
    if (pathname !== "/") return;

    const autoOpenTimer = setTimeout(() => {
      const hasAutoOpened = sessionStorage.getItem("willa_assistant_auto_opened");
      if (!hasAutoOpened && !isOpen) {
        setShowCenterPopup(true);
        sessionStorage.setItem("willa_assistant_auto_opened", "true");
      }
    }, 5000);

    return () => clearTimeout(autoOpenTimer);
  }, [isOpen, pathname]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "msg-1",
            role: "bot",
            content: "Greetings! 🌟 I am your Stay Willas Luxury Concierge. I specialize in matching discerning travelers with our handpicked collection of premium private pool estates. Let's design your perfect getaway. Where would you like to escape next?",
            options: ["Lonavala", "Khopoli", "Alibaug", "Karjat", "Anywhere"],
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userText },
    ]);

    // Bot response logic after a brief delay
    setTimeout(async () => {
      const reply = await getBotReply(userText);
      setMessages((prev) => [...prev, reply]);
    }, 600);
  };

  const getBotReply = async (text: string): Promise<Message> => {
    const lowercaseText = text.toLowerCase();

    // 1. Greetings
    if (lowercaseText.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/)) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "Hello! 🌟 I'm your Stay Willas Luxury Concierge. How can I help you design your perfect private villa getaway today?",
        options: ["Find a Villa", "Pet Friendly Stays", "Check Rates", "Speak to Support"],
      };
    }

    // 2. Pet friendly queries
    if (lowercaseText.includes("pet") || lowercaseText.includes("dog") || lowercaseText.includes("cat") || lowercaseText.includes("animal")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left">
            <p>🐾 <strong>We love pets!</strong> Both of our active estates are fully pet-friendly and offer spacious lawns for your furry companions to run freely:</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>The Angle House (Lonavala):</strong> Lush enclosed lawns and pet-loving caretakers who can prepare custom pet meals.</li>
              <li><strong>Canopy Crest (Khopoli):</strong> Expansive fields and large lawn terrace for absolute freedom.</li>
            </ul>
            <p>Would you like to explore one of these sanctuaries?</p>
          </div>
        ),
        options: ["The Angle House", "Canopy Crest", "Main Menu"],
      };
    }

    // 3. Pool / Infinity Pool queries
    if (lowercaseText.includes("pool") || lowercaseText.includes("swim") || lowercaseText.includes("infinity")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left">
            <p>🏊‍♂️ <strong>Spectacular Pools!</strong> A private pool is the heart of the Stay Willas experience:</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>The Angle House (Lonavala):</strong> Stunning private pool with a calming waterfall feature, lounge chairs, and cozy decks.</li>
              <li><strong>Canopy Crest (Khopoli):</strong> A massive 22x12 ft private pool set against a lush backdrop of Sahyadri hills.</li>
            </ul>
            <p>Which location would you prefer?</p>
          </div>
        ),
        options: ["Lonavala", "Khopoli", "Main Menu"],
      };
    }

    // 4. Chef / Food / Meals
    if (lowercaseText.match(/\b(chef|cook|food|meal|breakfast|lunch|dinner|eat|jain|veg)\b/)) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left">
            <p>👨‍🍳 <strong>Gourmet Dining:</strong> Both of our estates offer private chef services with customized menus:</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>The Angle House:</strong> Features a dedicated private chef specializing in custom veg-only and Jain spreads in a separate setup.</li>
              <li><strong>Canopy Crest:</strong> Local delicacies, outdoor barbecues, and custom multi-cuisine options.</li>
            </ul>
            <p>Would you like to see these villas?</p>
          </div>
        ),
        options: ["The Angle House", "Canopy Crest", "Main Menu"],
      };
    }

    // 5. Locations / Areas queries
    if (lowercaseText.includes("lonavala")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "Lonavala is our premier mountain sanctuary! Cool mountain breeze, misty green valleys, and our designer villa 'The Angle House' (3 BHK, sleeps up to 16, private pool with waterfall & jacuzzi).",
        options: ["The Angle House", "Check Price", "Main Menu"],
      };
    }
    if (lowercaseText.includes("khopoli")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "Khopoli is a gorgeous nature escape near the Sahyadri hills. Features our sprawling estate 'Canopy Crest' (4 BHK, sleeps up to 20, 22x12 ft pool, spacious charpai lawns).",
        options: ["Canopy Crest", "Check Price", "Main Menu"],
      };
    }
    if (lowercaseText.includes("alibaug")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "🌊 Alibaug is currently in our Coming Soon collection. We are actively curating premium beachside pool sanctuaries to launch there soon! You can sign up to get notified on WhatsApp when we go live.",
        options: ["Get Notified - Alibaug", "Find a Villa", "Main Menu"],
      };
    }
    if (lowercaseText.includes("karjat")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "🌿 Karjat is currently in our Coming Soon collection. We are curating beautiful riverside estates and farm-stays. Sign up to get notified when they become available!",
        options: ["Get Notified - Karjat", "Find a Villa", "Main Menu"],
      };
    }
    if (lowercaseText.includes("goa") || lowercaseText.includes("igatpuri")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: "✈️ Goa and Igatpuri are upcoming destinations! We are setting up high-end private pool retreats. We'd love to notify you as soon as they open.",
        options: ["Speak to Support", "Main Menu"],
      };
    }

    // 6. Specific Villa Queries
    if (lowercaseText.includes("angle house") || lowercaseText.includes("anglehouse")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left font-light">
            <p>📐 <strong>The Angle House (Lonavala):</strong></p>
            <p className="text-xs">An architectural glass masterpiece. 3 air-conditioned master bedrooms (sleeps 12-16), private pool with waterfall, master suite jacuzzi, fully pet-friendly, and veg/Jain chef service available.</p>
            <div className="mt-2 scale-95 origin-left">
              <VillaCard
                id="the-angle-house"
                name="The Angle House"
                location="Lonavala"
                image="/assets/villas/the-angle-house/gallery-11.webp"
                price="13,000"
                guests={16}
                bedrooms={3}
                bathrooms={3}
                className="w-[280px]"
              />
            </div>
          </div>
        ),
        options: ["Book via WhatsApp", "Check Price", "Main Menu"],
      };
    }
    if (lowercaseText.includes("canopy crest") || lowercaseText.includes("canopycrest") || lowercaseText.includes("canopy")) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left font-light">
            <p>🌳 <strong>Canopy Crest (Khopoli):</strong></p>
            <p className="text-xs">A massive countryside estate. 4 spacious bedrooms (sleeps 12-20), 5 bathrooms, 22x12 ft private pool, indoor/outdoor games, music system, senior citizen friendly, and sprawling lawns.</p>
            <div className="mt-2 scale-95 origin-left">
              <VillaCard
                id="canopy-crest"
                name="Canopy Crest"
                location="Khopoli"
                image="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"
                price="15,000"
                guests={20}
                bedrooms={4}
                bathrooms={5}
                className="w-[280px]"
              />
            </div>
          </div>
        ),
        options: ["Book via WhatsApp", "Check Price", "Main Menu"],
      };
    }

    // 7. Booking / Price / WhatsApp
    if (lowercaseText.match(/\b(book|reserve|whatsapp|phone|number|contact|price|cost|rate|rent)\b/)) {
      return {
        id: Date.now().toString(),
        role: "bot",
        content: (
          <div className="flex flex-col gap-2 text-left">
            <p>💰 <strong>Rates & Booking:</strong></p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>The Angle House:</strong> Starts from ₹13,000/night (weekdays) / ₹20,000/night (weekends).</li>
              <li><strong>Canopy Crest:</strong> Starts from ₹15,000/night (weekdays) / ₹22,000/night (weekends).</li>
            </ul>
            <p>Our concierge team is available on WhatsApp to check availability, help you choose, or customize menus! 🥂</p>
          </div>
        ),
        options: ["Book via WhatsApp", "Main Menu"],
      };
    }

    // 8. Help / Default fallback
    return {
      id: Date.now().toString(),
      role: "bot",
      content: "I want to make sure you get the best match! 🌟 You can ask me about pet-friendly stays, private pool sizes, veg/Jain chef services, or check prices. Or feel free to choose an option below:",
      options: ["Find a Villa", "Pet Friendly Stays", "Check Rates", "Speak to Support"],
    };
  };

  const handleOptionClick = async (option: string, msgId: string) => {
    // Remove options from the message that was clicked so they don't stay on screen
    setMessages((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, options: undefined } : msg))
    );

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: option },
    ]);

    // Handle special menu options
    if (option === "Find a Villa" || option === "Start over" || option === "Main Menu") {
      setStage("greeting");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Where would you like to escape next? 🌿",
            options: ["Lonavala", "Khopoli", "Alibaug", "Karjat", "Anywhere"],
          },
        ]);
      }, 500);
      return;
    }

    if (option === "Pet Friendly Stays") {
      setTimeout(async () => {
        const reply = await getBotReply("pet");
        setMessages((prev) => [...prev, reply]);
      }, 600);
      return;
    }

    if (option === "Check Rates" || option === "Check Price") {
      setTimeout(async () => {
        const reply = await getBotReply("price");
        setMessages((prev) => [...prev, reply]);
      }, 600);
      return;
    }

    if (option === "Speak to Support" || option === "Book via WhatsApp") {
      const waUrl = "https://wa.me/919619042310?text=Hello%20Stay%20Willas%20team!%20%F0%9F%A5%82%20I'm%20exploring%20your%20getaways%20and%20would%20love%20to%20check%20availability%20for%20an%20upcoming%20escape.%20Could%20you%20share%20some%20suggestions%3F";
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Opening WhatsApp to connect with our Booking Relations team... 🥂",
          }
        ]);
        setTimeout(() => {
          window.location.href = waUrl;
        }, 1000);
      }, 500);
      return;
    }

    if (option === "Get Notified - Alibaug" || option === "Get Notified - Karjat") {
      const area = option.split(" - ")[1];
      const waUrl = `https://wa.me/919619042310?text=Hello%20Stay%20Willas%20team!%20%F0%9F%8C%9F%20Please%20let%20me%20know%20when%20your%20private%20pool%20villas%20in%20*${area}*%20are%20live.`;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: `Opening WhatsApp to register your interest for ${area}... 🥂`,
          }
        ]);
        setTimeout(() => {
          window.location.href = waUrl;
        }, 1000);
      }, 500);
      return;
    }

    if (option === "The Angle House" || option === "Canopy Crest") {
      setTimeout(async () => {
        const reply = await getBotReply(option);
        setMessages((prev) => [...prev, reply]);
      }, 600);
      return;
    }

    // Bot response logic
    if (stage === "greeting") {
      setSelectedLocation(option);
      if (option === "Alibaug" || option === "Karjat") {
        setStage("recommendation");
        const waText = `Hello Stay Willas team! 🌟 Please let me know when your private pool villas in *${option}* are live.`;
        const waUrl = `https://wa.me/919619042310?text=${encodeURIComponent(waText)}`;
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: `A wonderful choice! 🌊 ${option} is currently in our Coming Soon collection. We are actively curating premium private pool sanctuaries there to offer you the signature Stay Willas experience.`,
            },
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              content: (
                <div className="flex flex-col gap-3 text-left">
                  <p>Would you like to be notified as soon as these properties go live? 🥂</p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-1 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-[11px] tracking-wider rounded-xl shadow-[0_4px_12px_rgba(37,211,102,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase text-center"
                  >
                    Get Notified on WhatsApp
                  </a>
                </div>
              ),
              options: ["Find a Villa", "Speak to Support"],
            }
          ]);
        }, 800);
        return;
      }

      setStage("budget");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: `A beautiful choice! ✨ To help me narrow down our exclusive selection, what is your preferred nightly budget range?`,
            options: [
              "₹10,000 - ₹12,000",
              "₹12,000 - ₹15,000",
              "₹15,000 - ₹18,000",
              "₹18,000 - ₹20,000"
            ],
          },
        ]);
      }, 800);
    } else if (stage === "budget") {
      setSelectedBudget(option);
      setStage("guests");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Understood. To ensure we select a sanctuary with perfect accommodations and spacing, how many guests will be joining you on this luxury staycation?",
            options: ["1-4 Guests", "5-8 Guests", "9+ Guests"],
          },
        ]);
      }, 800);
    } else if (stage === "guests") {
      setSelectedGuests(option);
      setStage("recommendation");

      // Match only between Angle House & Canopy Crest client-side to ensure 100% success
      let finalVilla = recommendedVilla; // default is The Angle House

      const loc = (selectedLocation || "").toLowerCase();
      if (loc.includes("khopoli")) {
        finalVilla = {
          id: "canopy-crest",
          name: "Canopy Crest",
          location: "Khopoli",
          image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
          price: "15,000",
          guests: 20,
          bedrooms: 4,
          bathrooms: 5,
        };
      } else if (loc.includes("lonavala")) {
        finalVilla = recommendedVilla;
      } else {
        // If Anywhere or other location chosen, select based on group size
        if (option.includes("9+")) {
          finalVilla = {
            id: "canopy-crest",
            name: "Canopy Crest",
            location: "Khopoli",
            image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
            price: "15,000",
            guests: 20,
            bedrooms: 4,
            bathrooms: 5,
          };
        } else {
          finalVilla = recommendedVilla;
        }
      }

      setMatchedVilla(finalVilla);

      // Construct pre-filled WhatsApp message based on collected guest inputs
      const whatsappMsg = `✨ *Stay Willas - AI Concierge Match* ✨\n` +
        `------------------------------------------\n` +
        `🏰 *Recommended Sanctuary:* ${finalVilla.name}\n` +
        `📍 *Destination:* ${selectedLocation || "Anywhere"}\n` +
        `👥 *Our Group Size:* ${option || "Flexible"}\n` +
        `💰 *Target Budget:* ${selectedBudget || "Flexible"}\n` +
        `------------------------------------------\n` +
        `🌿 *Hello Stay Willas team!* I just used your delightful AI Concierge which matched me with this stunning villa. I would love to check its availability and talk about securing our reservation! 🥂`;
      const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(whatsappMsg)}`;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Excellent selection! 🏰 Based on your group size and preferences, I have matched you with this breathtaking, handpicked private pool sanctuary:",
          },
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: (
              <div className="mt-4 w-full scale-95 origin-left">
                <VillaCard
                  id={finalVilla.id}
                  name={finalVilla.name}
                  location={finalVilla.location}
                  image={finalVilla.image}
                  price={finalVilla.price}
                  guests={finalVilla.guests}
                  bedrooms={finalVilla.bedrooms}
                  bathrooms={finalVilla.bathrooms}
                  className="w-[280px]"
                />
              </div>
            ),
          },
          {
            id: (Date.now() + 2).toString(),
            role: "bot",
            content: (
              <div className="flex flex-col gap-3 text-left">
                <p>Would you like to connect directly with our Booking Relations team on WhatsApp to check availability, secure your dates, or customize your luxury stay? 🥂</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-1 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-[11px] tracking-wider rounded-xl shadow-[0_4px_12px_rgba(37,211,102,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase text-center"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.987 11.48.987 6.045.987 1.62 5.357 1.617 10.787c-.001 1.706.46 3.376 1.336 4.851l-.97 3.545 3.639-.949zM15.93 11.66c-.237-.117-1.4-.689-1.617-.768-.217-.078-.375-.117-.533.117-.158.234-.61.768-.748.922-.138.154-.276.176-.513.058-.237-.117-.999-.368-1.902-1.173-.703-.627-1.177-1.4-1.315-1.634-.138-.234-.015-.36.103-.476.106-.105.237-.276.355-.414.118-.138.158-.234.237-.39.079-.156.039-.293-.02-.41-.059-.117-.533-1.282-.73-1.758-.192-.464-.388-.4-.533-.408-.138-.006-.296-.007-.454-.007-.158 0-.414.059-.63.293-.217.234-.827.809-.827 1.97 0 1.161.847 2.282.965 2.44.118.156 1.666 2.544 4.037 3.565.564.243 1.004.388 1.347.497.567.18 1.082.155 1.49.094.454-.068 1.4-.57 1.597-1.12.197-.55.197-1.021.138-1.12-.059-.098-.217-.156-.454-.273z" />
                  </svg>
                  Connect on WhatsApp
                </a>
              </div>
            ),
            options: ["Chat on WhatsApp", "Start over"],
          },
        ]);
      }, 800);
    } else if (stage === "recommendation" && option === "Start over") {
      setSelectedLocation("");
      setSelectedBudget("");
      setSelectedGuests("");
      setMatchedVilla(recommendedVilla);
      setStage("greeting");
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            role: "bot",
            content: "Certainly! Let's find the perfect villa for your next getaway. Where would you like to travel?",
            options: ["Lonavala", "Khopoli", "Alibaug", "Karjat", "Anywhere"],
          },
        ]);
      }, 800);
    } else if (stage === "recommendation" && option === "Yes, please") {
      const finalVilla = matchedVilla || recommendedVilla;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `Connecting you directly with our Luxury Concierge Team on WhatsApp to secure your preferred dates at ${finalVilla.name}... 🥂`,
        }
      ]);

      // Construct pre-filled WhatsApp message based on collected guest inputs
      const whatsappMsg = `✨ *Stay Willas - AI Concierge Match* ✨\n` +
        `------------------------------------------\n` +
        `🏰 *Recommended Sanctuary:* ${finalVilla.name}\n` +
        `📍 *Destination:* ${selectedLocation || "Anywhere"}\n` +
        `👥 *Our Group Size:* ${selectedGuests || "Flexible"}\n` +
        `💰 *Target Budget:* ${selectedBudget || "Flexible"}\n` +
        `------------------------------------------\n` +
        `🌿 *Hello Stay Willas team!* I just used your delightful AI Concierge which matched me with this stunning villa. I would love to check its availability and talk about securing our reservation! 🥂`;

      // Redirect after a premium short transition delay
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(whatsappMsg)}`;
        window.location.href = whatsappUrl;
      }, 1500);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-24 right-4 md:top-auto md:bottom-10 md:right-10 z-50 w-12 h-12 md:w-16 md:h-16 bg-[#FFCC00] hover:bg-[#FFD700] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,204,0,0.4)] transition-all duration-300 group overflow-hidden border-2 border-white/20"
          >
            <img 
              src="/images/chatbot.png" 
              alt="Willa Assistant" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-6rem)] bg-bg-primary border border-border-subtle rounded-3xl shadow-[0_20px_60px_rgba(44,31,14,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle bg-accent-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                  <img src="/images/chatbot.png" alt="Willa Assistant" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-heading text-lg leading-tight">Willa Assistant</h3>
                  <p className="text-[10px] text-accent-primary tracking-widest uppercase font-bold">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.role === "bot" && (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-border-subtle bg-bg-secondary flex-shrink-0 flex items-center justify-center mb-1">
                        <img src="/images/chatbot.png" alt="Willa Assistant" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-accent-primary text-white rounded-br-sm font-medium"
                            : "bg-bg-secondary text-text-primary rounded-bl-sm border border-border-subtle"
                        }`}
                      >
                        {msg.content}
                      </div>
                      
                      {/* Options */}
                      {msg.options && (
                        <div className="flex flex-col gap-2 mt-2">
                          {msg.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(opt, msg.id)}
                              className="text-left px-4 py-2 rounded-xl border border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex-shrink-0 flex items-center justify-center mb-1">
                        <User size={12} className="text-accent-primary" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border-subtle bg-bg-secondary/50">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything or choose an option..."
                  className="w-full bg-white border border-border-subtle rounded-full py-3 pl-4 pr-12 text-sm text-text-primary placeholder:text-text-primary/30 focus:outline-none focus:border-accent-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1B3564] hover:bg-[#152A50] flex items-center justify-center text-white disabled:bg-[#E2E8F0]/40 disabled:text-text-primary/30 transition-colors cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Proactive Bot Popup */}
      <AnimatePresence>
        {showCenterPopup && (
          <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCenterPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Popup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[420px] bg-[#FDFBF7] border border-[#DAA520]/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(27,53,100,0.25)] p-8 text-center z-10 flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCenterPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564]/60 hover:text-[#1B3564] transition-all cursor-pointer hover:scale-105"
              >
                <X size={16} />
              </button>

              {/* Bot Image */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-accent-primary flex items-center justify-center mb-6 relative">
                <img 
                  src="/images/chatbot.png" 
                  alt="Willa Assistant" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              {/* Title & Description */}
              <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.2em] mb-2 block">Personal Assistant</span>
              <h3 className="text-2xl font-heading text-[#1B3564] italic mb-3 font-semibold">
                Need help finding <span className="not-italic font-bold font-sans text-accent-primary">the best property?</span>
              </h3>
              <p className="text-xs text-text-primary/70 leading-relaxed mb-6 font-medium">
                Would you like help in finding the best property for your needs and pet-friendly properties?
              </p>

              {/* Action Buttons */}
              <div className="w-full flex flex-row gap-4">
                <button
                  onClick={() => {
                    setShowCenterPopup(false);
                    setIsOpen(true);
                  }}
                  className="flex-1 bg-[#1B3564] hover:bg-[#152A50] text-white py-3.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-none font-bold"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowCenterPopup(false)}
                  className="flex-1 bg-transparent hover:bg-slate-100 text-text-primary/60 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border border-[#1B3564]/10"
                >
                  No
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(27, 53, 100, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
