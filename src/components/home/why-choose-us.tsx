"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Award, Clock } from "lucide-react";

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
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-border-subtle">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 bg-blue-50 px-4 py-2 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-text-primary mt-6">
              We Care About <span className="italic bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Your Stay</span>
            </h2>
            <p className="text-lg text-text-primary/65 mt-6 max-w-2xl mx-auto">
              Experience uncompromising luxury with genuine hospitality and attention to every detail.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-500 hover:bg-blue-50 hover:shadow-lg">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:border-blue-600 transition-all duration-500">
                  <reason.icon className="text-blue-600 group-hover:text-white transition-colors duration-500" size={32} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-heading text-text-primary mb-4 tracking-wide">
                  {reason.title}
                </h3>
                
                {/* Description */}
                <p className="text-text-primary/60 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
