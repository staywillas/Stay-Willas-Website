"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-black overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
              Got a beautiful home?
            </span>
            <h2 className="text-4xl md:text-6xl font-heading text-white mb-8 leading-tight">
              Own a Villa? <br />
              <span className="italic text-gold">Let&apos;s Share It</span> <br />
              With The World.
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed">
              We treat your home like our own. From finding great guests to taking care 
              of maintenance and operations, we handle everything for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" className="bg-gold hover:bg-gold/80 text-charcoal rounded-full px-10 py-7 text-lg font-semibold h-auto">
                LIST YOUR PROPERTY
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 py-7 text-lg font-semibold h-auto">
                DOWNLOAD BROCHURE
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="glass-dark p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-64"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                  <benefit.icon size={24} />
                </div>
                <div className="text-3xl font-heading text-white mb-1">{benefit.value}</div>
                <div className="text-[10px] text-gold uppercase tracking-widest mb-4">{benefit.suffix}</div>
                <div className="text-sm text-white/50">{benefit.title}</div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="sm:col-span-3 glass-dark p-8 rounded-3xl border border-gold/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Shield className="text-gold" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-medium">Trusted by 50+ Villa Owners</h4>
                  <p className="text-white/40 text-sm">Join the most premium hospitality network.</p>
                </div>
              </div>
              <div className="hidden sm:block text-gold font-semibold text-2xl font-heading">
                4.9/5
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
