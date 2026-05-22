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
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 bg-blue-50 px-4 py-2 rounded-full">
              Handpicked Properties
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-text-primary mt-6">
              Places We <span className="italic bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent pr-2 inline-block">Love</span>
            </h2>
            <p className="text-lg text-text-primary/65 mt-8">
              Every villa in our collection has been carefully selected for its unique charm, 
              luxury amenities, and unforgettable experience. Discover your next perfect escape.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/villas" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full px-8 py-4 text-sm tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-glow-blue inline-block hover:-translate-y-1">
              VIEW ALL VILLAS
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
              className="h-full flex flex-col"
            >
              <VillaCard {...villa} className="h-full" />
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
              <SwiperSlide key={villa.id} className="max-w-[310px] px-3 h-full flex flex-col">
                <VillaCard {...villa} className="h-full" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .villas-mobile-swiper {
          overflow: visible !important;
        }
        .villas-mobile-swiper .swiper-pagination {
          bottom: -20px !important;
        }
        .villas-mobile-swiper .swiper-pagination-bullet {
          background: rgba(59, 130, 246, 0.2);
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .villas-mobile-swiper .swiper-pagination-bullet-active {
          background: #3B82F6;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedVillas;
