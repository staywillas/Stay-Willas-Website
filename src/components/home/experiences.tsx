"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Pool Villas",
    description: "Jump right in—every home comes with your own private pool.",
    image: "/images/exp-pool.png",
    link: "/category/pool-villas",
    size: "large",
  },
  {
    title: "Mountain Escapes",
    description: "Take a break from the city and enjoy the quiet mountain life.",
    image: "/images/exp-mountain.png",
    link: "/category/mountain-escapes",
    size: "small",
  },
  {
    title: "Pet Friendly",
    description: "Bring your furry friends along! They deserve a holiday too.",
    image: "/images/villa-mahabaleshwar.png",
    link: "/category/pet-friendly",
    size: "small",
  },
  {
    title: "Couple Retreats",
    description: "Intimate, cozy settings just for the two of you.",
    image: "/images/villa-alibaug.png",
    link: "/category/couple-retreats",
    size: "medium",
  },
];

const Experiences = () => {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 bg-blue-50 px-4 py-2 rounded-full">
              Curated Experiences
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-text-primary mt-6">
              Find Your <span className="italic bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Perfect Trip</span>
            </h2>
            <p className="text-lg text-text-primary/60 mt-6 max-w-2xl mx-auto">
              From poolside relaxation to mountain adventures, we have the perfect villa for every mood.
            </p>
          </motion.div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
          {/* Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg hover:shadow-elevated transition-all duration-500"
          >
            <Image
              src={categories[0].image}
              alt={categories[0].title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              loading="lazy"
              quality={75}
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <h3 className="text-4xl lg:text-5xl font-heading text-white mb-3 tracking-tight">{categories[0].title}</h3>
              <p className="text-white/85 max-w-md mb-8 text-lg leading-relaxed">{categories[0].description}</p>
              <div className="flex items-center gap-3 text-blue-300 font-bold uppercase tracking-widest text-sm group-hover:gap-5 transition-all">
                Explore Collection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Vertical Grid for Others */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {categories.slice(1, 3).map((cat, index) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative flex-1 overflow-hidden rounded-3xl group cursor-pointer shadow-md hover:shadow-lg transition-all duration-500"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  quality={75}
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-heading text-white mb-2">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
