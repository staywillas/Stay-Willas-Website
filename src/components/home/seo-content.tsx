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
    question: "What makes Stay Willas the top choice for luxury villas near Mumbai?",
    answer: "Stay Willas provides handpicked luxury villas near Mumbai featuring private swimming pools, architectural design, lush green lawns, and dedicated in-house chef services for unmatched privacy and relaxation."
  },
  {
    question: "Why should I book private pool villas in Lonavala?",
    answer: "Our private pool villas in Lonavala like The Angle House offer complete seclusion, temperature-filtered private pools, mountain valley views, master suite jacuzzis, and pet-friendly fenced grounds."
  },
  {
    question: "How far are your villas near mumbai for a weekend trip?",
    answer: "All our villas near mumbai are located within a scenic 90-minute to 2-hour drive via the Mumbai-Pune Expressway, giving you fast access to Lonavala, Khopoli, and Karjat without heavy travel."
  },
  {
    question: "Are your luxury villas near Mumbai pet-friendly?",
    answer: "Yes, many of our luxury villas near Mumbai feature secure, fully fenced lawns and safe open layouts designed so your pets can run freely while you relax by the pool."
  },
  {
    question: "Do private pool villas in Lonavala include in-house chef dining?",
    answer: "Yes, our private pool villas in Lonavala offer customized culinary services with on-site chefs who prepare fresh multi-cuisine spreads, local Maharashtrian dishes, poolside barbecues, and Jain meals."
  },
  {
    question: "How do I book villas near mumbai with Stay Willas?",
    answer: "You can easily browse real-time availability and book villas near mumbai directly through our website or connect with our Stay Willas concierge team on WhatsApp for custom quotes."
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
            Discover <span className="italic text-[#DAA520] font-serif font-normal">Luxury Villas Near Mumbai</span> & Private Pool Retreats
          </h2>

          <div className="space-y-8 text-slate-800 text-sm sm:text-base leading-relaxed font-light font-sans select-text">
            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Why Choose Luxury Villas Near Mumbai for Staycations
              </h3>
              <p>
                When planning a peaceful weekend retreat, booking <strong className="text-[#1B3564]">luxury villas near Mumbai</strong> offers an ideal blend of luxury, convenience, and privacy. Located within a comfortable 2-hour drive, these exclusive estates provide city dwellers with a serene escape from urban routines. Rather than staying at crowded hotels with shared amenities, choosing private <strong className="text-[#1B3564]">villas near mumbai</strong> guarantees your family and friends full access to secluded gardens, sun lounges, and dedicated hospitality.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Unwind at Signature Private Pool Villas in Lonavala
              </h3>
              <p>
                A major favorite for weekend travelers is our collection of <strong className="text-[#1B3564]">private pool villas in Lonavala</strong>. Set against the misty Sahyadri mountains, these properties feature temperature-filtered swimming pools, cascading waterfalls, and master suite jacuzzis. Whether swimming laps in the morning or enjoying late-night poolside conversations, staying at our <strong className="text-[#1B3564]">private pool villas in Lonavala</strong> turns every weekend trip into a memorable retreat.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Customized Culinary Services at Luxury Villas Near Mumbai
              </h3>
              <p>
                Dining at our <strong className="text-[#1B3564]">luxury villas near Mumbai</strong> is completely customized to your taste. Dedicated on-site chefs prepare fresh meals directly inside your villa kitchen. From authentic Maharashtrian specialties and poolside barbecues to customized Jain meals, our culinary team caters to every preference. Combined with the privacy of our <strong className="text-[#1B3564]">villas near mumbai</strong>, your staycation becomes effortless and deeply relaxing.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Effortless Travel to Villas Near Mumbai
              </h3>
              <p>
                Quick road accessibility is a major reason why families and corporate groups prefer our <strong className="text-[#1B3564]">villas near mumbai</strong>. Smooth highway connectivity via the Mumbai-Pune Expressway lets you reach your destination without long, exhausting journeys. You can easily head out on Friday evening and arrive at our <strong className="text-[#1B3564]">private pool villas in Lonavala</strong> or nearby estates in time for dinner.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Pet-Friendly Comfort at Private Pool Villas in Lonavala
              </h3>
              <p>
                Leaving your pets behind during vacation is no longer a worry. Many of our <strong className="text-[#1B3564]">luxury villas near Mumbai</strong> and <strong className="text-[#1B3564]">private pool villas in Lonavala</strong> are designed to be pet-friendly. Fully secure, manicured green lawns give your pets plenty of room to play safely while you enjoy the poolside deck with your family.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold">
                Book Your Next Escape at Luxury Villas Near Mumbai
              </h3>
              <p>
                Experience slow luxury with Stay Willas. Browse our handpicked catalog of <strong className="text-[#1B3564]">luxury villas near Mumbai</strong>, explore verified <strong className="text-[#1B3564]">private pool villas in Lonavala</strong>, and reserve your ideal <strong className="text-[#1B3564]">villas near mumbai</strong> for your upcoming weekend getaway.
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
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-slate-700 font-light leading-relaxed border-t border-[#DAA520]/10 mt-1">
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
