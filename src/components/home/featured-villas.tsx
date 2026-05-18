"use client";

import React from "react";
import { motion } from "framer-motion";
import VillaCard from "./villa-card";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Villa {
  id: string;
  name: string;
  location: string;
  image: string;
  price: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

interface FeaturedVillasProps {
  villas: Villa[];
}

const FeaturedVillas = ({ villas }: FeaturedVillasProps) => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-charcoal relative overflow-hidden">
      {/* Some smooth glowing ambient gradients to frame the cards nicely */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
              Our Favorite Homes
            </span>
            <h2 className="text-4xl md:text-6xl font-heading text-white">
              Places We <span className="italic text-gold">Love</span>
            </h2>
            <p className="text-white/60 mt-6 text-lg">
              Here are some of our favorite spots. Handpicked for comfort, style, 
              and that perfect holiday feeling.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/villas" className="bg-[#FFCC00] hover:bg-[#FFD700] text-black font-extrabold rounded-full px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,204,0,0.2)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)] inline-block">
              VIEW ALL PROPERTIES
            </Link>
          </motion.div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa, index) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <VillaCard {...villa} />
            </motion.div>
          ))}
        </div>

        {/* Mobile 3D Coverflow Slider Layout */}
        <div className="block md:hidden">
          <Swiper
            modules={[EffectCoverflow, Pagination]}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 15,
              stretch: -15,
              depth: 120,
              modifier: 1.1,
              slideShadows: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="villas-mobile-swiper py-10"
          >
            {villas.map((villa) => (
              <SwiperSlide key={villa.id} className="max-w-[310px] px-3">
                <VillaCard {...villa} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .villas-mobile-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.2);
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .villas-mobile-swiper .swiper-pagination-bullet-active {
          background: #c5a059;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedVillas;
