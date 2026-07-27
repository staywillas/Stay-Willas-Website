"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, Shield, Award, MapPin } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do you have pet friendly private pool villas near Mumbai & Pune?",
    answer: "Absolutely. Many of our handpicked private estates feature large, fully fenced lawns and safe layouts designed specifically to welcome your furry friends. When booking, you can filter for our pet-friendly sanctuaries which are located just a short 2-hour drive from Mumbai and Pune."
  },
  {
    question: "Are curated meals and in-house dining available at your villas?",
    answer: "Yes, we specialize in staycations with premium culinary services. Professional in-house culinary teams prepare fresh, customized meals directly inside your villa kitchen. We can arrange specialized menus, including local Maharashtrian dishes, barbecue spreads, or strict Jain food requests."
  },
  {
    question: "Which destinations are closest for a weekend getaway drive?",
    answer: "Our luxury pool villas are located in Maharashtra's best scenic spots, with a strong focus on Lonavala and Khopoli. Lonavala is just about a 2-hour drive via the Expressway, offering misty valleys, while Khopoli provides absolute serene nature near Imagica. We also have properties in Karjat and Alibaug."
  },
  {
    question: "How do you guarantee the hygiene and safety of the private swimming pools?",
    answer: "Every private pool undergoes a rigorous chlorine filtration cycle and chemical water balance check before each guest's check-in. Our dedicated on-site estate managers perform daily maintenance to ensure maximum hygiene and safety throughout your stay."
  },
  {
    question: "Can I host group get-togethers or corporate retreats at Stay Willas?",
    answer: "Yes, our properties like Canopy Crest (up to 20 guests) and The Angle House (up to 16 guests) are perfect for family reunions, milestone birthdays, and corporate offsites. They offer spacious living halls, lawns, music systems, board games, and bonfire set-ups."
  },
  {
    question: "Why the spelling 'Stay Willas' with a 'W' instead of 'Stay Villas'?",
    answer: "Stay Willas (with a 'W') is our unique, registered trademark and brand identity. We chose the name 'Willas' to reflect the dedicated 'will' and warm hospitality that define our curated vacation collection. When searching for our properties or recommending us, please ensure you use 'Stay Willas' with a 'W' to find our verified website and customer service."
  }
];

export default function SEOContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-[#DAA520]/20 text-charcoal relative overflow-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3564]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Rich SEO Content Column */}
        <div className="mb-20 text-left">
          <span className="text-accent-secondary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            Slow Luxury Escapes
          </span>
          <h2 className="text-3xl md:text-5xl font-heading text-[#1B3564] mb-8 font-bold leading-tight">
            Premium <span className="italic text-[#DAA520] font-serif font-normal">Private Pool Villas</span> near Mumbai & Pune
          </h2>

          <div className="space-y-8 text-slate-800 text-sm sm:text-base leading-relaxed font-light">
            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                The Rise of Private Pool Stays
              </h3>
              <p>
                For city dwellers seeking a break from the fast-paced urban lifestyle, the popularity of <strong className="text-[#1B3564]">private pool villas near Mumbai</strong> has soared. The convenience of driving just a couple of hours to a private sanctuary is unmatched. Staying in <strong className="text-[#1B3564]">private villas around Mumbai</strong> offers families and friends the perfect setting to relax and reconnect. Rather than booking crowded hotels with shared amenities, renting a secluded holiday estate is the ultimate way to enjoy <strong className="text-[#1B3564]">staycations near mumbai</strong> with absolute seclusion. You can swim, dine, and unwind without any external interruptions. At Stay Willas, we recognize that a weekend getaway is about comfort and ease. That is why our selection of luxury pool getaways is curated to the highest standards. Each property is handpicked to guarantee that the pool, lawns, and bedrooms meet our luxury criteria. Booking premium weekend rentals is no longer just about accommodation; it is about creating unforgettable experiences.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Bespoke Dining and Premium Comfort
              </h3>
              <p>
                When you choose our private pool stays, you gain access to luxury amenities. Many of our <strong className="text-[#1B3564]">villas in lonavla</strong> and Khopoli feature customized culinary options with private chefs. Enjoying fresh meals cooked inside your own kitchen is a staple when you stay in these holiday homes. These estates cater to all food preferences, including local Maharashtrian dishes, barbecues, and Jain meals. This combination of privacy and bespoke hospitality makes our managed estates stand out from traditional luxury resorts. Moreover, the layout of each property is designed to host groups comfortably. Large living rooms, dining spaces, and open-air decks provide ample room for interactions, while the quiet bedrooms offer a peaceful space to retreat. The inclusion of modern facilities like high-speed internet, smart televisions, and power backup ensures that you can enjoy a luxurious getaway without sacrificing any modern conveniences.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Regional Highlights: Lonavala and Khopoli
              </h3>
              <p>
                Location plays a vital role when choosing the right weekend escape. Our core portfolio of luxury weekend retreats is heavily focused on the stunning, accessible destinations of Lonavala and Khopoli, bringing you the finest <strong className="text-[#1B3564]">luxury villas in lonavla and khopoli</strong>. Lonavala is famous for its misty valleys, viewpoints, and cool climate, making our <strong className="text-[#1B3564]">villas in lonavla</strong> a top choice year-round. If you want a quick escape surrounded by untouched nature and serene valleys, our <strong className="text-[#1B3564]">luxury villas in khopoli</strong> provide absolute serenity just a stone's throw from major attractions like Imagica. Each of these spots has a range of <strong className="text-[#1B3564]">private pool villas near Mumbai</strong> designed to make the most of the natural landscape. Whether you prefer a modern villa perched on a hill or a traditional home surrounded by trees, our Stay Willas properties offer diverse architectural styles to match your tastes. We also offer select estates in Karjat and Alibaug, all sharing the convenience of being close to the city, making them excellent choices for any quick getaway.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Effortless Travel and Quick Commutes
              </h3>
              <p>
                Accessibility is another reason why travelers prefer booking <strong className="text-[#1B3564]">private pool villas near Mumbai</strong> within a scenic two-hour drive. With smooth highway connectivity, reaching your getaway home is stress-free. For coastal destinations like Alibaug, you can access our coastal getaways via a quick catamaran ferry from Gateway of India. This ease of travel makes our <strong className="text-[#1B3564]">staycations near mumbai</strong> the perfect choice for spontaneous weekend breaks. You can finish your workday in the city and arrive at your luxurious estate in time for dinner, completely bypassing the hassles of airports or long-distance train journeys. This convenience is a primary driver behind the rising demand for premium weekend rentals.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Designing the Perfect Staycation Experience
              </h3>
              <p>
                A successful staycation is built on detail and personal touches. Selecting one of our <strong className="text-[#1B3564]">villas in lonavla</strong> or Khopoli offers a sense of home where you define the schedule. You can wake up to a sunrise over the mountains, enjoy breakfast in the garden, and spend the afternoon reading by the water. For families with children, having a private outdoor space means kids can play freely and safely. Many of our properties feature indoor games, table tennis, and dedicated lawns for outdoor activities. If you are planning a corporate retreat, these spacious homes offer the perfect mix of business and leisure, allowing teams to collaborate in a relaxed environment and build stronger bonds. The flexibility of a private estate means your itinerary can be as active or as relaxed as you desire, with our guest relations team ready to assist with any special requests.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Making the Most of Pet-Friendly Spaces
              </h3>
              <p>
                Leaving pets behind when going on vacation is a common challenge for pet owners. That is why many of our <strong className="text-[#1B3564]">luxury villas in lonavla and khopoli</strong> are designed to be pet-friendly. Sprawling, fully fenced lawns allow your dogs to run around and explore safely. Our staff is trained to be welcoming to pets, ensuring a stress-free experience for the entire family. You do not have to worry about finding boarding services or dealing with the anxiety of leaving your animals at home. Having your pets join you by the pool adds an extra layer of joy to your weekend getaway, making the trip complete for everyone involved.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Sustainable and Responsible Tourism
              </h3>
              <p>
                We believe in preserving the beauty of the destinations where our properties are located. When staying at our <strong className="text-[#1B3564]">luxury villas in khopoli</strong> or Lonavla, we encourage our guests to respect the local environment and community guidelines. From minimizing single-use plastics to conserving water and electricity, small actions contribute to sustainable tourism. Our local estate managers are recruited from nearby villages, supporting the local economy and providing authentic hospitality. By choosing Stay Willas, you are not only enjoying a premium holiday but also contributing to the community and supporting sustainable practices in these beautiful tourist destinations.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Planning Your Booking
              </h3>
              <p>
                Booking your next stay is straightforward and secure. Our online platform provides detailed descriptions, high-resolution photos, and real-time availability for all our homes. Our customer support team is available to answer any questions and assist you with the booking process, ensuring a smooth experience from start to finish. We offer flexible cancellation options and transparent pricing with no hidden fees, so you can book with confidence. Security and safety are our top priorities, and all our estates are equipped with security systems and on-site staff to ensure peace of mind during your stay. Plan your next holiday today and discover the comfort of our <strong className="text-[#1B3564]">private villas around Mumbai</strong>.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                A Sanctuary for Rejuvenation
              </h3>
              <p>
                Ultimately, a weekend getaway is an investment in your well-being. Leaving behind the digital noise and urban stress allows you to recharge your mind and body. Spending time in nature, breathing fresh air, and enjoying the company of loved ones can significantly improve your health. When booking our <strong className="text-[#1B3564]">staycations near mumbai</strong>, our properties are designed to facilitate this rejuvenation, offering peaceful corners, comfortable seating, and beautiful views. Whether you spend your time swimming, reading, or simply doing nothing, you will return to the city feeling refreshed. Experience the perfect balance of luxury and nature at our signature getaway homes.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars of Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Shield, title: "100% Handpicked & Verified", desc: "Every villa is checked in person to guarantee quality, safety, and luxury standards." },
            { icon: Award, title: "Premium Concierge Care", desc: "From customized meal plans to setting up poolside events, we handle all details." },
            { icon: MapPin, title: "Scenic Weekend Valleys", desc: "Sanctuaries located within a scenic 2-hour drive from Mumbai and Pune." }
          ].map((pillar, i) => (
            <div key={i} className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 text-left hover:border-[#DAA520]/60 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] mb-4">
                <pillar.icon size={20} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-sm uppercase tracking-wider mb-2">{pillar.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-[#DAA520]/20 pt-16">
          <div className="text-center mb-12">
            <span className="text-accent-secondary font-bold tracking-[0.25em] uppercase text-[10px] block mb-2">FAQs</span>
            <h3 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold">Frequently Asked Questions</h3>
            <div className="h-[2px] w-12 bg-[#DAA520] mx-auto mt-4" />
          </div>

          <div className="space-y-4 max-w-4xl mx-auto text-left">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#FAF8F5] border border-[#DAA520]/20 hover:border-[#DAA520]/40 rounded-3xl overflow-hidden transition-colors shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-heading text-sm md:text-base text-[#1B3564] font-bold focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle size={18} className="text-[#DAA520] shrink-0" />
                      {faq.question}
                    </span>
                    <span className="ml-4 shrink-0 w-8 h-8 rounded-full border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] bg-white">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-[#DAA520]/10 bg-white/50 font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
