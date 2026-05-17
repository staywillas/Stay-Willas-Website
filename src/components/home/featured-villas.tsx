"use client";

import React from "react";
import { motion } from "framer-motion";
import VillaCard from "./villa-card";
import { Button } from "@/components/ui/button";

// Static list of our top favorite properties we recommend to friends
const villas = [
  {
    id: "lonavala-estate",
    name: "Misty Mornings Cliffhouse",
    location: "Lonavala",
    image: "/images/villa-lonavala.png",
    price: "45,000",
    guests: 12,
    bedrooms: 5,
    bathrooms: 6,
  },
  {
    id: "alibaug-retreat",
    name: "Alibaug Palms Beachhouse",
    location: "Alibaug",
    image: "/images/villa-alibaug.png",
    price: "60,000",
    guests: 10,
    bedrooms: 4,
    bathrooms: 5,
  },
  {
    id: "mahabaleshwar-heritage",
    name: "Panchgani Whispering Pines",
    location: "Panchgani",
    image: "/images/villa-mahabaleshwar.png",
    price: "35,000",
    guests: 8,
    bedrooms: 3,
    bathrooms: 4,
  },
];

const FeaturedVillas = () => {
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
            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold hover:text-charcoal rounded-full px-8 py-6">
              VIEW ALL PROPERTIES
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
};

export default FeaturedVillas;
