"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Users, Shield, Globe } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Earn More",
    value: "Max",
    suffix: "Higher Earnings",
  },
  {
    icon: Users,
    title: "Great Guests",
    value: "Global",
    suffix: "Happy Travelers",
  },
  {
    icon: Globe,
    title: "We Handle It All",
    value: "Full",
    suffix: "Care & Service",
  },
];

const PartnerSection = () => {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-[#4A5D23] via-[#559C24] to-[#2E3C14] overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#559C24]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-[#DAA520] font-bold tracking-[0.3em] uppercase text-xs mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              🏠 Partnership Opportunity
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-white mb-8 sm:mb-10 leading-tight">
              Own a Villa? <br />
              <span className="italic bg-gradient-to-r from-[#FAF7F0] via-[#DAA520] to-[#FAF7F0] bg-clip-text text-transparent pr-2 inline-block">Let's Share It</span> <br />
              With The World.
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl leading-relaxed font-light">
              We treat your home like our own. From curating exceptional guests to handling 
              maintenance and operations, we manage everything so you can enjoy the rewards.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/partner" className="inline-flex items-center justify-center bg-white text-[#4A5D23] hover:bg-[#F5F2EA] rounded-full px-8 py-4 text-sm font-bold tracking-widest h-auto shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                LIST YOUR PROPERTY
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#4A5D23] rounded-full px-8 py-4 text-sm font-bold tracking-widest h-auto transition-all duration-300 hover:-translate-y-1">
                CONTACT SALES
              </Link>
            </div>
          </motion.div>

          {/* Right Benefits Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/95 backdrop-blur-md p-3 sm:p-8 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg sm:shadow-xl text-center flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-56 hover:bg-white hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-[#559C24]/10 flex items-center justify-center mb-2.5 sm:mb-5 text-[#559C24] transition-colors shrink-0">
                  <benefit.icon size={18} className="group-hover:scale-110 transition-transform sm:hidden" />
                  <benefit.icon size={26} className="group-hover:scale-110 transition-transform hidden sm:block" />
                </div>
                <div className="text-lg sm:text-4xl font-black text-[#1B3564] tracking-tight mb-0.5 sm:mb-1">{benefit.value}</div>
                <div className="text-[7px] sm:text-xs text-[#559C24] uppercase tracking-widest font-extrabold mb-1.5 sm:mb-3 leading-none">{benefit.suffix}</div>
                <div className="text-[9px] sm:text-sm text-[#1B3564]/80 font-bold leading-tight">{benefit.title}</div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="col-span-3 bg-white/95 backdrop-blur-md p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/80 shadow-lg sm:shadow-xl flex items-center justify-between hover:bg-white hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center gap-2.5 sm:gap-4">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#559C24]/10 flex items-center justify-center text-[#559C24] shrink-0">
                  <Shield className="text-[#559C24] sm:hidden" size={18} />
                  <Shield className="text-[#559C24] hidden sm:block" size={24} />
                </div>
                <div className="text-left">
                  <h4 className="text-[#1B3564] font-black tracking-wide text-xs sm:text-base leading-tight">Trusted by Owners</h4>
                  <p className="text-[#1B3564]/70 text-[9px] sm:text-xs font-semibold mt-0.5 leading-tight">Join our premium hospitality network.</p>
                </div>
              </div>
              <div className="text-[#DAA520] font-black text-xs sm:text-2xl tracking-tight shrink-0 ml-2">
                Top Rated ⭐
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
