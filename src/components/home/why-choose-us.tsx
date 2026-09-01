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
    <section className="py-12 sm:py-32 px-4 sm:px-12 lg:px-24 bg-white border-t border-border-subtle">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 70,
              damping: 18,
              duration: 0.7 
            }}
          >
            <span className="inline-block text-[#559C24] font-bold tracking-[0.3em] uppercase text-[9px] sm:text-xs mb-2 sm:mb-4 bg-[#559C24]/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-text-primary mt-2 sm:mt-6">
              We Care About <span className="italic bg-gradient-to-r from-[#1B3564] to-[#DAA520] bg-clip-text text-transparent pr-2 inline-block">Your Stay</span>
            </h2>
            <p className="text-xs sm:text-lg text-text-primary/65 mt-2 sm:mt-6 max-w-2xl mx-auto">
              Experience uncompromising luxury with genuine hospitality and attention to every detail.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: index * 0.08 
              }}
              className="group"
            >
              <div className="h-full flex flex-col items-center text-center p-3 sm:p-6 rounded-2xl transition-all duration-500 hover:bg-blue-50 hover:shadow-lg">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center mb-3 sm:mb-6 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:border-blue-600 transition-all duration-500">
                  <reason.icon className="text-blue-600 group-hover:text-white transition-colors duration-500 w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                
                {/* Title */}
                <h3 className="text-sm sm:text-xl font-heading text-text-primary mb-1.5 sm:mb-4 tracking-wide">
                  {reason.title}
                </h3>
                
                {/* Description */}
                <p className="text-text-primary/60 text-[10px] sm:text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-Converting Bottom Conversion Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 bg-[#1B3564] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#DAA520]/40 shadow-xl"
        >
          <div className="text-center md:text-left">
            <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-[0.2em] block mb-1">
              Direct Booking Privilege
            </span>
            <h3 className="text-xl sm:text-3xl font-heading font-bold text-white">
              Ready for your private luxury getaway?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Book directly with Stay Willas to lock in exclusive seasonal discounts, complimentary amenities & zero middleman fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="/villas"
              className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#c4941a] text-[#1B3564] px-6 py-3.5 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-md text-center cursor-pointer"
            >
              Browse All Villas
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd love to get a direct quote and check availability for a weekend villa stay.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3.5 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
              </svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
