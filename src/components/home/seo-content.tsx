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
    question: "Are private chefs and customized meals available at your villas?",
    answer: "Yes, we specialize in staycations with premium culinary services. Professional in-house chefs cook fresh, customized meals directly inside your villa kitchen. We can arrange specialized menus, including local Maharashtrian dishes, barbecue spreads, or strict Jain food requests."
  },
  {
    question: "Which destinations are closest for a weekend getaway drive?",
    answer: "Our luxury pool villas are located in Maharashtra's best scenic spots: Lonavala (about 2 hours drive via the Expressway), Khopoli (nature valleys near Imagica), Karjat (peaceful riverside properties), and Alibaug (coastal stays accessible by road or a quick catamaran ferry from Mumbai)."
  },
  {
    question: "How do you guarantee the hygiene and safety of the private swimming pools?",
    answer: "Every private pool undergoes a rigorous chlorine filtration cycle and chemical water balance check before each guest's check-in. Our dedicated on-site estate managers perform daily maintenance to ensure maximum hygiene and safety throughout your stay."
  },
  {
    question: "Can I host group get-togethers or corporate retreats at Stay Willas?",
    answer: "Yes, our properties like Canopy Crest (up to 20 guests) and The Angle House (up to 16 guests) are perfect for family reunions, milestone birthdays, and corporate offsites. They offer spacious living halls, lawns, music systems, board games, and bonfire set-ups."
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
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-[#DAA520]/20 select-none text-charcoal relative overflow-hidden">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-800 text-sm sm:text-base leading-relaxed font-light">
            <div className="space-y-6">
              <p>
                Escape the city routine. At <strong>Stay Willas</strong>, we offer premium holiday homes for family 
                getaways. Find a <span className="text-[#1B3564] font-semibold">private pool villa</span> or a luxury 
                estate nestled in the hills. Your stay is your private sanctuary.
              </p>
              <p>
                Our properties feature high-speed Wi-Fi, green lawns, and clean pools. We also offer 
                dedicated <span className="text-[#1B3564] font-semibold">villas with chef</span> services. Enjoy fresh, 
                custom meals cooked at the villa. It is easy and stress-free.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                Book top-rated <span className="text-[#1B3564] font-semibold">villas near mumbai</span> and 
                cozy <span className="text-[#1B3564] font-semibold">villas near pune</span>. Drive down the Expressway to a 
                premium <span className="text-[#1B3564] font-semibold">pool villas lonavala</span>. Or rent a coastal 
                <span className="text-[#1B3564] font-semibold">alibaug pool villa</span> just a short ferry ride away.
              </p>
              <p>
                We also offer serene <span className="text-[#1B3564] font-semibold">karjat pool villa</span> properties and 
                quiet <span className="text-[#1B3564] font-semibold">khopoli villa</span> stays. Many of our getaways are 
                fully <span className="text-[#1B3564] font-semibold">pet friendly villas</span>. Secure your dates today 
                for a relaxing weekend.
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
