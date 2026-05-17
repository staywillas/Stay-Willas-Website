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
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block text-center">
            What Are You Looking For?
          </span>
          <h2 className="text-4xl md:text-6xl font-heading text-center mb-6">
            Find Your <span className="italic text-gold">Perfect Trip</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
          {/* Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 relative overflow-hidden rounded-3xl group cursor-pointer"
          >
            <Image
              src={categories[0].image}
              alt={categories[0].title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <h3 className="text-4xl font-heading mb-2">{categories[0].title}</h3>
              <p className="text-white/70 max-w-md mb-6">{categories[0].description}</p>
              <div className="flex items-center gap-2 text-gold font-medium uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                Explore <ArrowRight size={16} />
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
                className="relative flex-1 overflow-hidden rounded-3xl group cursor-pointer"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-heading mb-1">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-gold font-medium uppercase tracking-widest text-[10px] group-hover:gap-3 transition-all">
                    Explore <ArrowRight size={12} />
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
