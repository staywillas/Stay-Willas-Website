"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Users, Shield, Globe } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Earn More",
    value: "35%+",
    suffix: "Higher Earnings",
  },
  {
    icon: Users,
    title: "Great Guests",
    value: "100k+",
    suffix: "Happy Travelers",
  },
  {
    icon: Globe,
    title: "We Handle It All",
    value: "360°",
    suffix: "Care & Service",
  },
];

const PartnerSection = () => {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block text-blue-200 font-bold tracking-[0.3em] uppercase text-xs mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              🏠 Partnership Opportunity
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-white mb-10 leading-tight">
              Own a Villa? <br />
              <span className="italic bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent pr-2 inline-block">Let's Share It</span> <br />
              With The World.
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl leading-relaxed font-light">
              We treat your home like our own. From curating exceptional guests to handling 
              maintenance and operations, we manage everything so you can enjoy the rewards.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/partner" className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 py-4 text-sm font-bold tracking-widest h-auto shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                LIST YOUR PROPERTY
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-blue-700 rounded-full px-8 py-4 text-sm font-bold tracking-widest h-auto transition-all duration-300 hover:-translate-y-1">
                CONTACT SALES
              </Link>
            </div>
          </motion.div>

          {/* Right Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-xl text-center flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-56 hover:bg-white hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-5 text-blue-600 transition-colors">
                  <benefit.icon size={26} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-black text-[#1B3564] tracking-tight mb-1">{benefit.value}</div>
                <div className="text-xs text-blue-600 uppercase tracking-widest font-extrabold mb-3">{benefit.suffix}</div>
                <div className="text-sm text-[#1B3564]/80 font-bold">{benefit.title}</div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="sm:col-span-3 bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-xl flex items-center justify-between hover:bg-white hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="text-[#1B3564] font-black tracking-wide">Trusted by 50+ Villa Owners</h4>
                  <p className="text-[#1B3564]/70 text-xs font-semibold mt-1">Join the most premium hospitality network.</p>
                </div>
              </div>
              <div className="hidden sm:block text-blue-600 font-black text-2xl tracking-tight">
                4.9/5 ⭐
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
