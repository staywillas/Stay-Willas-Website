"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Heart, Clock, Award } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Strictly Handpicked",
    description: "We visit every home ourselves to make sure everything is absolutely perfect before you arrive.",
  },
  {
    icon: Sparkles,
    title: "Unforgettable Extras",
    description: "Want a private chef or a guided local tour? Just ask, and we'll handle the rest.",
  },
  {
    icon: Award,
    title: "Warm Hospitality",
    description: "You're our guest. We're here to make sure you have everything you need to feel at home.",
  },
  {
    icon: Clock,
    title: "We Handle the Details",
    description: "We make booking easy. Tell us what you need, and we'll take care of everything else.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
            Why Stay With Us?
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-white">
            We Care About <span className="italic text-gold">Your Stay</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-500">
                <reason.icon className="text-gold group-hover:text-charcoal transition-colors duration-500" size={32} />
              </div>
              <h3 className="text-xl font-heading text-white mb-3 tracking-wide">{reason.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
