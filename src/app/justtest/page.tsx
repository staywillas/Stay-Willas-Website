"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import {
  MapPin,
  Calendar,
  Users,
  Waves,
  Sparkles,
  Phone,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
  ExternalLink,
  X,
  MessageCircle,
  Download,
  Star,
  ShieldCheck,
  Maximize2,
  Bed,
  BedDouble,
  Bath,
  Compass,
  Clock,
  Car,
  UtensilsCrossed,
  Wind,
  Wifi,
  Tv,
  Trees,
  Flame,
  Speaker,
  Heart,
  UserCheck,
  ChefHat,
  DoorClosed,
  ShowerHead,
  Sun,
  ShieldAlert,
  Coffee,
  HelpCircle
} from "lucide-react";

export default function JustTestPage() {
  // Modal states
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeAmenityTab, setActiveAmenityTab] = useState<"all" | "wellness" | "living" | "dining" | "outdoor">("all");

  // Gallery images for lightbox & showcase
  const galleryPhotos = [
    {
      src: "/images/angle-house-hero-clean.webp",
      alt: "The Angle House Lonavala - Panoramic Exterior with Swimming Pool",
      title: "Signature Angular Facade & Private Cascade Pool",
      category: "Exterior"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-11.webp",
      alt: "Private Waterfall Swimming Pool and Sunken Deck",
      title: "Cascade Swimming Pool & Sun Deck",
      category: "Pool"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-15.webp",
      alt: "Luxe Master Suite with In-Room Private Jacuzzi",
      title: "Master Bedroom with In-Room Jacuzzi",
      category: "Suites"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-16.webp",
      alt: "Double-Height Glass Living Pavilion",
      title: "Double-Height Glass Living Pavilion",
      category: "Living"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-14.webp",
      alt: "The Angle House Golden Hour Evening Ambiance",
      title: "Warm Golden Hour Exterior & Starlit Garden",
      category: "Exterior"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-10.webp",
      alt: "Spacious Dining and Indoor Lounge",
      title: "Indoor Dining & Lounge Area",
      category: "Dining"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-6.webp",
      alt: "Outdoor Deck and Green Lawn Area",
      title: "Manicured Lawn & Alfresco Gazebo Deck",
      category: "Outdoor"
    },
    {
      src: "/assets/villas/the-angle-house/gallery-4.webp",
      alt: "Scenic Mountain Balcony View",
      title: "Private Mountain View Balcony",
      category: "Views"
    }
  ];

  // Verified Reviews from real guests
  const reviews = [
    {
      name: "Rohan & Priya Mehta",
      tag: "Family Monsoon Getaway",
      rating: 5,
      date: "July 2026",
      comment:
        "The Monsoon Escape at The Angle House was breathtaking! The waterfall pool in the rain and glass facade view of Sahyadri clouds made it unforgettable. Kailash's culinary team prepared steaming hot pakoras & tea!"
    },
    {
      name: "Vikram Singhania",
      tag: "Direct Weekday Stay",
      rating: 5,
      date: "June 2026",
      comment:
        "Booked directly via WhatsApp for our weekday stay. Saved significantly compared to OTA platforms, and the caretaker had the master jacuzzi ready before check-in. Absolute tranquility."
    },
    {
      name: "Aditi Deshmukh",
      tag: "Pet Parent Staycation",
      rating: 5,
      date: "May 2026",
      comment:
        "Our Golden Retriever had the best time running across the secure fenced lawns! Total peace of mind for pet parents. The villa staff treated our pet like family."
    },
    {
      name: "Sameer Kulkarni",
      tag: "30th Birthday Celebration",
      rating: 5,
      date: "August 2026",
      comment:
        "Celebrated my 30th birthday here with 12 friends on a weekday. Cleanest pool in Lonavala, powerful sound system for daytime lounge music, and zero noise disturbances."
    }
  ];

  // Categorized Amenities
  const amenitiesData = [
    {
      category: "wellness",
      name: "Private Waterfall Pool",
      desc: "Private swimming pool featuring cascading natural waterfall rock feature & sun loungers.",
      icon: Waves
    },
    {
      category: "wellness",
      name: "In-Room Jacuzzi Suite",
      desc: "Master suite equipped with a private heated jacuzzi bath overlooking forest trees.",
      icon: Sparkles
    },
    {
      category: "living",
      name: "Double-Height Glass Lounge",
      desc: "Double-height geometric glass living hall framing 360° views of Western Ghat mist.",
      icon: Sun
    },
    {
      category: "living",
      name: "Chilled Air Conditioning",
      desc: "Individual climate-controlled AC units in all 3 master suites and living pavilion.",
      icon: Wind
    },
    {
      category: "living",
      name: "Super-Fast Optical Wi-Fi",
      desc: "High-speed broadband network throughout the estate for seamless streaming & workcations.",
      icon: Wifi
    },
    {
      category: "dining",
      name: "Dedicated Private Chef",
      desc: "Private chef Kailash preparing fresh customized home-style buffet spreads on demand.",
      icon: ChefHat
    },
    {
      category: "dining",
      name: "Separate Veg & Jain Kitchen",
      desc: "Strictly separate cooking utensils, surfaces, and cookware for pure vegetarian & Jain diets.",
      icon: UtensilsCrossed
    },
    {
      category: "dining",
      name: "Poolside BBQ Station",
      desc: "Live evening barbecue setup with marinated skewers & outdoor dining under starlight.",
      icon: Flame
    },
    {
      category: "outdoor",
      name: "100% Pet-Friendly Lawns",
      desc: "Expansive enclosed green lawns with tall boundary fencing for dogs to play safely.",
      icon: Trees
    },
    {
      category: "outdoor",
      name: "Alfresco Gazebo & Balconies",
      desc: "2 private balconies and covered sit-outs capturing cool morning breezes from the valley.",
      icon: Compass
    },
    {
      category: "living",
      name: "100% Generator Backup",
      desc: "Heavy-duty automated generator backup guaranteeing uninterrupted AC, lights, and pool.",
      icon: ShieldCheck
    },
    {
      category: "outdoor",
      name: "Dedicated Caretaker",
      desc: "Resident 24/7 on-site caretaker and daily housekeeping ensuring a pristine villa stay.",
      icon: UserCheck
    }
  ];

  const filteredAmenities =
    activeAmenityTab === "all"
      ? amenitiesData
      : amenitiesData.filter((a) => a.category === activeAmenityTab);

  // House Rules
  const houseRules = [
    { title: "Check-In / Out", desc: "Check-in from 2:00 PM • Check-out by 11:00 AM" },
    { title: "Pet Policy", desc: "100% Pet friendly! Furry friends welcome with open paws" },
    { title: "Smoking Policy", desc: "Permitted in outdoor open-air decks and gazebo areas" },
    { title: "Quiet Hours", desc: "Outdoor music to be lowered post 10:00 PM for serene hill ambiance" }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: "Does The Angle House have both a private swimming pool and jacuzzi?",
      a: "Yes! The Angle House boasts a private swimming pool with a soothing waterfall cascade feature on the outdoor deck, plus a private in-room jacuzzi bath inside the master bedroom suite."
    },
    {
      q: "Is Jain and vegetarian food prepared separately?",
      a: "Absolutely. We pride ourselves on accommodating strict dietary needs. Chef Kailash maintains dedicated cookware, utensils, and oil for pure vegetarian and Jain meal preparations."
    },
    {
      q: "What is the maximum guest capacity?",
      a: "The Angle House comfortably hosts 12 to 14 guests across 3 expansive master bedrooms (each with plush double beds, extra mattresses, and attached bathrooms)."
    },
    {
      q: "How far is the villa from Mumbai and Pune?",
      a: "Located in Kurwande / Kamshet, Lonavala, the villa is an easy 2-hour drive from Mumbai and 1.5 hours from Pune via the scenic Mumbai-Pune Expressway."
    }
  ];

  const whatsappUrl =
    "https://wa.me/919619042310?text=" +
    encodeURIComponent(
      "Hi Stay Willas! I would like to check availability and book The Angle House in Lonavala."
    );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1E261E] selection:bg-[#2A3F30] selection:text-[#F5F0E8] font-sans antialiased">
      {/* SVG Clip Path Definition for the sculpted organic wavy hero mask */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="hero-organic-wave" clipPathUnits="objectBoundingBox">
            <path
              d="
                M 0.04 0.22
                C 0.04 0.08, 0.16 0.02, 0.28 0.04
                C 0.38 0.06, 0.44 0.16, 0.50 0.16
                C 0.56 0.16, 0.62 0.06, 0.72 0.04
                C 0.84 0.02, 0.96 0.08, 0.96 0.22
                C 0.96 0.34, 0.91 0.44, 0.93 0.52
                C 0.95 0.60, 0.98 0.68, 0.96 0.80
                C 0.94 0.92, 0.86 0.97, 0.74 0.96
                C 0.64 0.95, 0.58 0.90, 0.50 0.91
                C 0.42 0.91, 0.36 0.96, 0.26 0.96
                C 0.14 0.96, 0.04 0.91, 0.04 0.80
                C 0.04 0.68, 0.08 0.60, 0.07 0.52
                C 0.06 0.44, 0.04 0.34, 0.04 0.22
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* Site-wide Navbar with Stay Willas Logo & Full Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 md:px-10 pt-20 sm:pt-22 lg:pt-24 pb-12 sm:pb-16 lg:pb-24 space-y-12 sm:space-y-16 lg:space-y-24">
        
        {/* ─────────────────────────────────────────────────────────── */}
        {/* 1. EDITORIAL HERO SECTION (COMPACT & FULLY VISIBLE)         */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="hero" className="relative flex flex-col items-center text-center pt-0">
          
          {/* Vertical Editorial Text Flanking the Hero on Left & Right */}
          <div className="hidden lg:flex absolute -left-2 xl:left-1 top-1/2 -translate-y-1/2 flex-col items-center gap-3 select-none pointer-events-none z-20 opacity-60">
            <span className="w-px h-14 bg-[#1B3564]/30" />
            <span 
              className="font-serif text-[11px] font-bold uppercase tracking-[0.38em] text-[#1B3564]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              THE ANGLE HOUSE
            </span>
            <span className="w-px h-14 bg-[#1B3564]/30" />
          </div>

          <div className="hidden lg:flex absolute -right-2 xl:right-1 top-1/2 -translate-y-1/2 flex-col items-center gap-3 select-none pointer-events-none z-20 opacity-60">
            <span className="w-px h-14 bg-[#1B3564]/30" />
            <span 
              className="font-serif text-[11px] font-bold uppercase tracking-[0.38em] text-[#1B3564]"
              style={{ writingMode: "vertical-rl" }}
            >
              THE ANGLE HOUSE
            </span>
            <span className="w-px h-14 bg-[#1B3564]/30" />
          </div>

          {/* Eyebrow kicker */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#556353] font-semibold mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
            THE ANGLE HOUSE • KURWANDE, LONAVALA
            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
          </div>

          {/* Grand High-Contrast Serif Title (Strictly 2 Lines) */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[0.98] tracking-[-0.03em] text-[#1B3564] max-w-5xl mx-auto uppercase mb-4 sm:mb-6">
            <span className="block">ARCHITECTURAL LUXURY</span>
            <span className="block mt-0.5 sm:mt-1 text-[#1B3564]">IN LONAVALA</span>
          </h1>

          {/* Organic Sculpted Hero Image with Centered Floating Pill */}
          <div className="relative w-full max-w-4xl lg:max-w-5xl mx-auto">
            {/* Floating Forest Green Pill Button (Centered right in the top wave valley) */}
            <div className="absolute left-1/2 -top-4 sm:-top-5 -translate-x-1/2 z-20">
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="group inline-flex items-center gap-2 bg-[#2B3F2E] hover:bg-[#1F2F22] text-[#F5F0E8] px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Request Brochure</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Sculpted Organic Wavy Mask Frame - Optimized Aspect Ratio so whole image is visible above fold */}
            <div className="relative w-full h-[320px] xs:h-[360px] sm:h-[420px] md:h-[460px] lg:h-[490px] transition-transform duration-700">
              {/* Outer decorative shadow shape */}
              <div
                className="absolute inset-0 bg-[#2A3E2D]/10 blur-xl scale-95 -z-10 rounded-full"
                aria-hidden="true"
              />

              {/* Clipped Image Container */}
              <div
                className="w-full h-full overflow-hidden shadow-2xl relative cursor-pointer group"
                style={{ clipPath: "url(#hero-organic-wave)" }}
                onClick={() => setSelectedPhotoIndex(0)}
              >
                <Image
                  src="/images/angle-house-hero-clean.webp"
                  alt="The Angle House Lonavala - Striking Angular Facade with Private Pool"
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                {/* Bottom floating hint badge */}
                <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to expand full size photograph</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Specs Ribbon neatly below the photo */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-[#3E4D3C] font-semibold max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-[#EAE4D9]/90 px-3.5 py-1.5 rounded-full border border-[#DDD5C7]">
              <Bed className="w-4 h-4 text-[#DAA520]" /> 3 Master Suites
            </span>
            <span className="inline-flex items-center gap-2 bg-[#EAE4D9]/90 px-3.5 py-1.5 rounded-full border border-[#DDD5C7]">
              <Waves className="w-4 h-4 text-[#1B3564]" /> Waterfall Cascade Pool
            </span>
            <span className="inline-flex items-center gap-2 bg-[#EAE4D9]/90 px-3.5 py-1.5 rounded-full border border-[#DDD5C7]">
              <Sparkles className="w-4 h-4 text-[#DAA520]" /> In-Room Jacuzzi
            </span>
            <span className="inline-flex items-center gap-2 bg-[#EAE4D9]/90 px-3.5 py-1.5 rounded-full border border-[#DDD5C7]">
              <Users className="w-4 h-4 text-[#1B3564]" /> Up to 14 Guests
            </span>
            <span className="inline-flex items-center gap-2 bg-[#EAE4D9]/90 px-3.5 py-1.5 rounded-full border border-[#DDD5C7]">
              <Trees className="w-4 h-4 text-emerald-700" /> 100% Pet Friendly
            </span>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 3. THE STORY / ARCHITECTURAL NARRATIVE SECTION              */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="story" className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Narrative Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#556353] font-semibold">
                <span className="w-2 h-0.5 bg-[#DAA520]" />
                The Story &amp; Concept
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1B3564] tracking-tight leading-[1.05]">
                Where Dramatic Geometry Meets Forest Serenity.
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#3A4537] leading-relaxed">
                <p>
                  Imagine waking up to the gentle breeze of the hills, surrounded by sleek glass walls and towering trees. Welcome to <strong>The Angle House</strong>, an avant-garde designer villa where dramatic monolithic architecture meets peaceful forest serenity. Characterized by its striking triangular glass-facade silhouette, this estate is a genuinely unique retreat standing out across Lonavala’s picturesque landscape.
                </p>
                <p>
                  Step outside onto the sun-drenched stone deck, and you will find your own private swimming pool, complete with a soothing natural waterfall rock feature, outdoor lounge chairs, and cozy corners to unwind. It is the dream setting for family reunions, milestone birthdays, or quiet weekend escapes with people who matter most.
                </p>
                <p>
                  Inside, the slow luxury continues. The villa features three spacious, beautifully appointed bedrooms that comfortably host up to 14 guests. The master suite features an exclusive in-room jacuzzi bath, providing the ultimate sanctuary to rejuvenate while gazing at the green canopies outside.
                </p>
              </div>

              {/* Editorial Quote Callout Box */}
              <div className="bg-[#EAE4D9] border-l-4 border-[#DAA520] p-5 sm:p-6 rounded-r-2xl">
                <p className="font-serif italic text-lg sm:text-xl text-[#1B3564] leading-relaxed">
                  &ldquo;A luminous glass jewel box sculpted into Kurwande’s hills, welcoming the monsoon mist and Sahyadri clouds right into your living hall.&rdquo;
                </p>
                <span className="block text-xs uppercase tracking-wider text-[#697867] font-semibold mt-2">
                  Stay Willas Signature Portfolio • Lonavala
                </span>
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#EAE4D9]/90 border border-[#DDD5C7] p-3.5 rounded-2xl text-center">
                  <span className="block text-xl font-serif font-bold text-[#1B3564]">3 Suites</span>
                  <span className="text-xs sm:text-[13px] text-[#4D5A4C] uppercase font-semibold">Master Bedrooms</span>
                </div>
                <div className="bg-[#EAE4D9]/90 border border-[#DDD5C7] p-3.5 rounded-2xl text-center">
                  <span className="block text-xl font-serif font-bold text-[#1B3564]">Waterfall</span>
                  <span className="text-xs sm:text-[13px] text-[#4D5A4C] uppercase font-semibold">Private Pool</span>
                </div>
                <div className="bg-[#EAE4D9]/90 border border-[#DDD5C7] p-3.5 rounded-2xl text-center">
                  <span className="block text-xl font-serif font-bold text-[#1B3564]">Jacuzzi</span>
                  <span className="text-xs sm:text-[13px] text-[#4D5A4C] uppercase font-semibold">In Master Suite</span>
                </div>
                <div className="bg-[#EAE4D9]/90 border border-[#DDD5C7] p-3.5 rounded-2xl text-center">
                  <span className="block text-xl font-serif font-bold text-[#1B3564]">100%</span>
                  <span className="text-xs sm:text-[13px] text-[#4D5A4C] uppercase font-semibold">Pet Friendly</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Photo Collage (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div
                onClick={() => setSelectedPhotoIndex(1)}
                className="relative aspect-[4/3] rounded-[28px] overflow-hidden border border-[#DDD5C7] shadow-lg cursor-pointer group"
              >
                <Image
                  src="/assets/villas/the-angle-house/gallery-11.webp"
                  alt="The Angle House Swimming Pool with Waterfall"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider bg-[#DAA520] text-[#1B3564] px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Waterfall Pool
                  </span>
                  <h4 className="text-base font-semibold">Cascading Water Feature &amp; Sunken Deck</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedPhotoIndex(2)}
                  className="relative aspect-square rounded-[22px] overflow-hidden border border-[#DDD5C7] shadow cursor-pointer group"
                >
                  <Image
                    src="/assets/villas/the-angle-house/gallery-15.webp"
                    alt="Master Suite In-Room Jacuzzi"
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs text-white font-semibold">
                    Master Jacuzzi
                  </span>
                </div>

                <div
                  onClick={() => setSelectedPhotoIndex(3)}
                  className="relative aspect-square rounded-[22px] overflow-hidden border border-[#DDD5C7] shadow cursor-pointer group"
                >
                  <Image
                    src="/assets/villas/the-angle-house/gallery-16.webp"
                    alt="Double-height Glass Living Lounge"
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs text-white font-semibold">
                    Glass Pavilion
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 4. THE 8-CARD CHECKERBOARD MOSAIC GRID ("OUR SPACES")        */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="spaces" className="pt-8 sm:pt-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#556353] font-semibold block mb-2">
                Curated Spaces
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1B3564] tracking-tight">
                Our Properties
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:max-w-md">
              <p className="text-sm sm:text-base text-[#465343] leading-relaxed">
                A geometric sanctuary perched amidst the misty hills of Kurwande, blending panoramic glass facades, private cascade pools, and tranquil outdoor decks.
              </p>
              <div className="self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setIsBrochureOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#E7E0D3] hover:bg-[#DBD3C4] text-[#1B3564] text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  <span>Explore</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 8-Card Checkerboard Mosaic Grid (4 cols x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* ROW 1 - CARD 1: Metric Card (Estate Capacity) */}
            <div className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm hover:shadow transition-all group">
              <div>
                <span className="font-serif italic text-base sm:text-lg text-[#3E4D3C] block mb-2">
                  Estate Capacity
                </span>
                <p className="text-sm sm:text-[15px] text-[#42503F] leading-relaxed">
                  Three expansive master suites meticulously crafted for family reunions and celebration getaways.
                </p>
              </div>
              <div className="pt-6">
                <div className="font-serif text-4xl sm:text-5xl text-[#1B3564] font-medium tracking-tight">
                  14 Guests
                </div>
                <div className="text-xs sm:text-[13px] uppercase tracking-wider text-[#5B6A59] font-semibold mt-1">
                  Maximum Capacity • 3 Suites
                </div>
              </div>
            </div>

            {/* ROW 1 - CARD 2: Photo Card (Waterfall Swimming Pool) */}
            <div
              onClick={() => setSelectedPhotoIndex(1)}
              className="group relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-auto min-h-[260px] sm:min-h-[290px] cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-11.webp"
                alt="Private Cascade Swimming Pool at The Angle House"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-1">
                  Private Pool
                </span>
                <h4 className="text-base sm:text-lg font-semibold tracking-tight">Cascade Pool &amp; Sunken Deck</h4>
              </div>
            </div>

            {/* ROW 1 - CARD 3: Metric Card (Architectural Spec) */}
            <div className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm hover:shadow transition-all group">
              <div>
                <span className="font-serif italic text-base sm:text-lg text-[#3E4D3C] block mb-2">
                  Architecture &amp; Light
                </span>
                <p className="text-sm sm:text-[15px] text-[#42503F] leading-relaxed">
                  Distinct angular glass pavilion framing the undulating Western Ghats with dramatic natural sunlight.
                </p>
              </div>
              <div className="pt-6">
                <div className="font-serif text-4xl sm:text-5xl text-[#1B3564] font-medium tracking-tight">
                  100% Glass
                </div>
                <div className="text-xs sm:text-[13px] uppercase tracking-wider text-[#5B6A59] font-semibold mt-1">
                  Panoramic Hillside Views
                </div>
              </div>
            </div>

            {/* ROW 1 - CARD 4: Photo Card (Master Suite & Jacuzzi) */}
            <div
              onClick={() => setSelectedPhotoIndex(2)}
              className="group relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-auto min-h-[260px] sm:min-h-[290px] cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-15.webp"
                alt="Master Bedroom Suite with Jacuzzi at The Angle House"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-1">
                  Master Bedroom
                </span>
                <h4 className="text-base sm:text-lg font-semibold tracking-tight">In-Room Jacuzzi Suite</h4>
              </div>
            </div>

            {/* ROW 2 - CARD 5: Photo Card (Panoramic Living Pavilion) */}
            <div
              onClick={() => setSelectedPhotoIndex(3)}
              className="group relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-auto min-h-[260px] sm:min-h-[290px] cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-16.webp"
                alt="Double-height Living Pavilion with Floor-to-Ceiling Windows"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-1">
                  Living Pavilion
                </span>
                <h4 className="text-base sm:text-lg font-semibold tracking-tight">Triangular High Ceilings</h4>
              </div>
            </div>

            {/* ROW 2 - CARD 6: Metric Card (Absolute Seclusion) */}
            <div className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm hover:shadow transition-all group">
              <div>
                <span className="font-serif italic text-base sm:text-lg text-[#3E4D3C] block mb-2">
                  Privacy &amp; Sanctuary
                </span>
                <p className="text-sm sm:text-[15px] text-[#42503F] leading-relaxed">
                  Standalone private estate with lush enclosed lawns, zero shared spaces, and full pet-friendly freedom.
                </p>
              </div>
              <div className="pt-6">
                <div className="font-serif text-4xl sm:text-5xl text-[#1B3564] font-medium tracking-tight">
                  100% Private
                </div>
                <div className="text-xs sm:text-[13px] uppercase tracking-wider text-[#5B6A59] font-semibold mt-1">
                  Gated Seclusion • Kurwande
                </div>
              </div>
            </div>

            {/* ROW 2 - CARD 7: Photo Card (Golden Hour Exterior) */}
            <div
              onClick={() => setSelectedPhotoIndex(4)}
              className="group relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-auto min-h-[260px] sm:min-h-[290px] cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-14.webp"
                alt="Golden Hour and Evening Glow at The Angle House"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-1">
                  Night Ambiance
                </span>
                <h4 className="text-base sm:text-lg font-semibold tracking-tight">Golden Hour Warm Illumination</h4>
              </div>
            </div>

            {/* ROW 2 - CARD 8: Metric Card (Guest Rating) */}
            <div className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] shadow-sm hover:shadow transition-all group">
              <div>
                <span className="font-serif italic text-base sm:text-lg text-[#3E4D3C] block mb-2">
                  Guest Satisfaction
                </span>
                <p className="text-sm sm:text-[15px] text-[#42503F] leading-relaxed">
                  Celebrated as one of the most photographed and recommended designer villas in Lonavala.
                </p>
              </div>
              <div className="pt-6">
                <div className="font-serif text-4xl sm:text-5xl text-[#1B3564] font-medium tracking-tight flex items-center gap-2">
                  <span>4.9</span>
                  <Star className="w-7 h-7 fill-[#DAA520] text-[#DAA520] inline" />
                </div>
                <div className="text-xs sm:text-[13px] uppercase tracking-wider text-[#5B6A59] font-semibold mt-1">
                  50+ Verified 5-Star Reviews
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 5. COMPLETE AMENITIES SECTION (ALL FROM VILLA PAGE)         */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="amenities" className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 text-left">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#556353] font-semibold block mb-2">
                Estate Privileges
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1B3564] tracking-tight">
                All Amenities &amp; Inclusions
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Amenities" },
                { id: "wellness", label: "Pool & Jacuzzi" },
                { id: "living", label: "Suites & Comfort" },
                { id: "dining", label: "Chef & Meals" },
                { id: "outdoor", label: "Outdoors & Pets" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAmenityTab(tab.id as any)}
                  className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all cursor-pointer ${
                    activeAmenityTab === tab.id
                      ? "bg-[#1B3564] text-white shadow-sm"
                      : "bg-[#EAE4D9] text-[#4A5747] hover:bg-[#DDD5C7]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Amenities with Refined Editorial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAmenities.map((amenity, idx) => {
              const IconComp = amenity.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[24px] p-5 sm:p-6 flex items-start gap-4 hover:bg-white/80 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/10 text-[#1B3564] group-hover:bg-[#DAA520] group-hover:text-[#1B3564] transition-colors flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl text-[#1B3564] font-semibold mb-1">
                      {amenity.name}
                    </h4>
                    <p className="text-sm sm:text-[15px] text-[#42503F] leading-relaxed">
                      {amenity.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 6. BESPOKE DINING & PRIVATE CHEF SECTION                   */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="dining" className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="bg-[#EAE4D9] border border-[#DDD5C7] rounded-[32px] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B3564]/10 text-xs uppercase tracking-widest text-[#1B3564] font-bold">
                  <ChefHat className="w-4 h-4 text-[#DAA520]" />
                  Private Culinary Services
                </div>

                <h3 className="font-serif text-3xl sm:text-5xl text-[#1B3564] tracking-tight leading-[1.08]">
                  Dedicated Personal Chef &amp; Tailored Jain Menus.
                </h3>

                <p className="text-sm sm:text-base text-[#3E4A3B] leading-relaxed">
                  Food is at the heart of an extraordinary holiday. At The Angle House, our on-site culinary team led by <strong>Chef Kailash</strong> crafts fresh, hot home-style meals customized to your family’s palate.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#DAA520] text-[#1B3564] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#1B3564]">Strictly Separate Jain &amp; Vegetarian Setup</h5>
                      <p className="text-sm sm:text-[15px] text-[#465444] mt-0.5 leading-relaxed">Zero cross-contamination with dedicated cookware, vessels, and cooking stations.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#DAA520] text-[#1B3564] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#1B3564]">Live Evening BBQ by the Pool</h5>
                      <p className="text-sm sm:text-[15px] text-[#465444] mt-0.5 leading-relaxed">Paneer tikka, grilled corn, marinated chicken skewers, and seasonal veggies.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#DAA520] text-[#1B3564] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#1B3564]">Farm-Fresh Local Produce</h5>
                      <p className="text-sm sm:text-[15px] text-[#465444] mt-0.5 leading-relaxed">Sourced fresh daily from local farmers in the surrounding Kamshet valley.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsMenuOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#122444] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full transition-all shadow-sm"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-[#DAA520]" />
                    <span>View Sample Dining Menu</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#1B3564] border border-[#DDD5C7] text-xs sm:text-sm font-semibold px-5 py-3.5 rounded-full transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Request Custom Food Package</span>
                  </a>
                </div>
              </div>

              {/* Right Visual Image (5 Cols) */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-[28px] overflow-hidden shadow-lg border border-[#DDD5C7]">
                <Image
                  src="/assets/villas/the-angle-house/gallery-10.webp"
                  alt="Dining and Cuisine Setup at The Angle House"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#DAA520] block mb-1">
                    Home-Style Multi-Cuisine
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold">Indoor Dining Hall &amp; Outdoor Deck Seating</h4>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 7. VERIFIED GUEST REVIEWS SECTION                           */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section id="reviews" className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 text-left">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#556353] font-semibold block mb-2">
                Guest Voices
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1B3564] tracking-tight">
                Verified Stays &amp; Experiences
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#DAA520]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm sm:text-base font-bold text-[#1B3564]">4.9 / 5.0 Rating</span>
              <span className="text-xs sm:text-sm text-[#5B6A59]">(50+ Verified Reviews)</span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between hover:bg-white/80 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#DAA520]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs sm:text-[13px] uppercase tracking-wider text-[#5B6A59] font-semibold">
                      {rev.date}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#2E3A2B] leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="border-t border-[#DDD5C7] pt-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-serif text-base sm:text-lg text-[#1B3564] font-bold">{rev.name}</h5>
                    <span className="text-xs sm:text-sm text-[#5B6A59]">{rev.tag}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs uppercase font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                    <Check className="w-3.5 h-3.5" /> Verified Guest
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 8. HOUSE RULES & FREQUENTLY ASKED QUESTIONS                 */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: House Rules (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#556353] font-semibold block mb-2">
                  Good to Know
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-[#1B3564]">
                  Estate Guidelines
                </h3>
              </div>

              <div className="space-y-3">
                {houseRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-[#EAE4D9]/80 border border-[#DDD5C7] p-4 sm:p-4.5 rounded-2xl flex items-start gap-3"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#DAA520] mt-1.5 shrink-0" />
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#1B3564]">{rule.title}</h5>
                      <p className="text-sm text-[#465444] mt-0.5 leading-relaxed">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#EBE5DA] text-sm sm:text-[15px] text-[#3D4C3C] flex items-center gap-3.5 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-[#1B3564] shrink-0" />
                <span>Our resident caretaker is on-site 24/7 to assist with luggage, cleaning, and local recommendations.</span>
              </div>
            </div>

            {/* Right: FAQs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#556353] font-semibold block mb-2">
                  Frequently Asked Questions
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl text-[#1B3564]">
                  Everything You Need to Know
                </h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-[#EAE4D9]/80 border border-[#DDD5C7] p-5 sm:p-6 rounded-[22px] space-y-2 hover:bg-white/80 transition-all"
                  >
                    <h5 className="font-serif text-base sm:text-lg text-[#1B3564] font-bold flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#DAA520] shrink-0 mt-1" />
                      <span>{faq.q}</span>
                    </h5>
                    <p className="text-sm sm:text-base text-[#3E4C3C] leading-relaxed pl-6 sm:pl-7">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 9. BOTTOM SPLIT: LOCATION & "RESERVE TODAY" CARD            */}
        {/* ─────────────────────────────────────────────────────────── */}
        <section className="pt-8 sm:pt-12 border-t border-[#DDD5C7]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            
            {/* LEFT COLUMN: LOCATION */}
            <div id="location" className="flex flex-col text-left">
              <h3 className="font-serif text-3xl sm:text-5xl text-[#1B3564] tracking-tight mb-6">
                Locations
              </h3>

              <div className="flex-1 bg-[#EAE4D9]/80 border border-[#DDD5C7] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                {/* Stylized Map View Frame with Real Coordinates */}
                <div className="relative w-full h-64 sm:h-72 rounded-[22px] overflow-hidden border border-[#D5CCC0] mb-6 bg-[#E3DCD0]">
                  <iframe
                    title="The Angle House Kurwande Lonavala Exact Location Map"
                    src="https://maps.google.com/maps?q=18.7687773,73.5685498&hl=en&z=16&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "contrast(96%) brightness(98%)" }}
                    allowFullScreen={false}
                    loading="lazy"
                    className="w-full h-full"
                  />
                  {/* Floating Map Pin Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-semibold text-[#1B3564]">
                    <MapPin className="w-3.5 h-3.5 text-[#DAA520]" />
                    <span>Kurwande, Lonavala</span>
                  </div>
                </div>

                {/* Location Details & Drive Times */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D8CFC2] pb-3">
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl text-[#1B3564]">Kurwande / Kamshet, Lonavala</h4>
                      <p className="text-sm text-[#4E5D4B] mt-0.5">Scenic hill retreat tucked near INS Shivaji &amp; Tiger Point</p>
                    </div>
                    <a
                      href="https://www.google.com/maps/place/StayWillas+The+Angle+House+%7C+With+Jacuzzi+%7C+Lonavala/@18.7687773,73.5659749,17z/data=!3m1!4b1!4m9!3m8!1s0x3bc2ad6536845e45:0x4a41e2fba2fc985c!5m2!4m1!1i2!8m2!3d18.7687773!4d73.5685498!16s%2Fg%2F11zb_x4877"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B3564] hover:text-[#DAA520] transition-colors"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="bg-[#DFD8CC] p-3 rounded-2xl">
                      <span className="block text-xs uppercase tracking-wider text-[#5C6D5B] font-semibold">Tiger Point</span>
                      <span className="text-sm sm:text-base font-bold text-[#1B3564]">10 Mins</span>
                    </div>
                    <div className="bg-[#DFD8CC] p-3 rounded-2xl">
                      <span className="block text-xs uppercase tracking-wider text-[#5C6D5B] font-semibold">Bhushi Dam</span>
                      <span className="text-sm sm:text-base font-bold text-[#1B3564]">12 Mins</span>
                    </div>
                    <div className="bg-[#DFD8CC] p-3 rounded-2xl">
                      <span className="block text-xs uppercase tracking-wider text-[#5C6D5B] font-semibold">Mumbai</span>
                      <span className="text-sm sm:text-base font-bold text-[#1B3564]">2.0 Hours</span>
                    </div>
                    <div className="bg-[#DFD8CC] p-3 rounded-2xl">
                      <span className="block text-xs uppercase tracking-wider text-[#5C6D5B] font-semibold">Pune</span>
                      <span className="text-sm sm:text-base font-bold text-[#1B3564]">1.5 Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TESTIMONIALS / "INVEST TODAY" STYLE CARD */}
            <div id="reserve" className="flex flex-col text-left">
              <h3 className="font-serif text-3xl sm:text-5xl text-[#1B3564] tracking-tight mb-6">
                Reserve Your Stay
              </h3>

              {/* Deep Forest Green Luxury Editorial Card */}
              <div className="flex-1 bg-[#243526] text-[#F5F0E8] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
                {/* Subtle organic watermark / emblem */}
                <div
                  className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Header & Badge */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[11px] uppercase tracking-widest text-[#D3E2D2] font-medium mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-[#DAA520]" />
                    Stay Willas Signature Estate
                  </div>

                  {/* Huge Editorial Headline (Ref: INVEST TODAY with Leaf) */}
                  <div className="mb-6">
                    <h4 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[0.92] text-[#F5F0E8] uppercase">
                      Reserve <br />
                      <span className="flex items-center gap-2">
                        <span>T</span>
                        <span className="inline-block relative">
                          {/* Leaf silhouette embedded inside O */}
                          <span>O</span>
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-2.5 h-5 bg-[#7CA877] rounded-full transform rotate-45 opacity-80" />
                          </span>
                        </span>
                        <span>DAY</span>
                      </span>
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-[#D4E2D3] leading-relaxed max-w-md">
                    Experience private estate living with direct rates, on-call personal chef, secluded cascade pool, and prompt WhatsApp concierge.
                  </p>
                </div>

                {/* Price, Highlights & Direct Action */}
                <div className="relative z-10 pt-8 border-t border-white/15 space-y-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#A5B7A4] block font-semibold">
                        Direct Villa Tariff
                      </span>
                      <div className="font-serif text-3xl sm:text-4xl text-white font-medium">
                        ₹13,000{" "}
                        <span className="text-xs sm:text-sm font-sans font-normal text-[#B2C5B1]">
                          / night (Weekdays)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase tracking-wider text-[#A5B7A4] block font-semibold">
                        Weekend Rate
                      </span>
                      <div className="font-serif text-2xl sm:text-3xl text-[#E8EFE7]">
                        ₹20,000{" "}
                        <span className="text-xs sm:text-sm font-sans font-normal text-[#B2C5B1]">
                          / night
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#F5F0E8] hover:bg-white text-[#1B3564] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow hover:shadow-md transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setIsBrochureOpen(true)}
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[#F5F0E8] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all active:scale-95"
                    >
                      <span>Check Dates &amp; Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center gap-4 text-xs sm:text-[13px] text-[#CAD8CA] font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#86BA82]" /> 0% Platform Fees
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#86BA82]" /> Verified Caretaker
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#86BA82]" /> 100% Gated Estate
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 10. FOOTER BAR                                              */}
        {/* ─────────────────────────────────────────────────────────── */}
        <footer className="pt-8 sm:pt-12 border-t border-[#DDD5C7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#637261]">
          <p>© {new Date().getFullYear()} Stay Willas. The Angle House Private Estate, Lonavala.</p>
          <div className="flex items-center gap-6">
            <Link href="/villas" className="hover:text-[#1B3564] transition-colors">
              Explore All Villas
            </Link>
            <Link href="/" className="hover:text-[#1B3564] transition-colors">
              Home
            </Link>
            <a
              href="tel:+919619042310"
              className="hover:text-[#1B3564] transition-colors flex items-center gap-1 font-bold text-[#1B3564]"
            >
              <Phone className="w-3 h-3 text-[#DAA520]" />
              <span>+91 96190 42310</span>
            </a>
          </div>
        </footer>

      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* LIGHTBOX MODAL (FOR PHOTO CLICKS)                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) =>
                prev !== null ? (prev === 0 ? galleryPhotos.length - 1 : prev - 1) : null
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex((prev) =>
                prev !== null ? (prev === galleryPhotos.length - 1 ? 0 : prev + 1) : null
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={galleryPhotos[selectedPhotoIndex].src}
                alt={galleryPhotos[selectedPhotoIndex].alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h4 className="font-serif text-lg tracking-wide">
                {galleryPhotos[selectedPhotoIndex].title}
              </h4>
              <p className="text-xs text-white/60 mt-1">
                Photo {selectedPhotoIndex + 1} of {galleryPhotos.length} • The Angle House
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SAMPLE DINING MENU MODAL                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-[#F5F0E8] text-[#1E261E] rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#DDD5C7] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5 text-[#556353] hover:text-[#1E261E] p-2 rounded-full hover:bg-[#E5DDD0] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 text-left">
              <span className="text-[11px] uppercase tracking-widest text-[#1B3564] font-bold block mb-1">
                Chef Kailash&apos;s Kitchen
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1B3564]">
                Sample Daily Meal Spread
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5E4C] mt-1">
                All spreads are customized. Available in Pure Veg, Jain, and Non-Veg variants.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#334232] text-left">
              <div className="bg-[#EAE4D9] p-4 sm:p-4.5 rounded-2xl">
                <h5 className="font-serif text-sm sm:text-base font-bold text-[#1B3564] mb-1">Breakfast</h5>
                <p className="leading-relaxed">Poha / Misal Pav / Aloo Parathas with curd, Masala Omelettes, fresh fruits, toast, butter, and piping hot Masala Chai / Filter Coffee.</p>
              </div>

              <div className="bg-[#EAE4D9] p-4 sm:p-4.5 rounded-2xl">
                <h5 className="font-serif text-sm sm:text-base font-bold text-[#1B3564] mb-1">Lunch</h5>
                <p className="leading-relaxed">Paneer Butter Masala or Malvani Chicken Curry, Dal Tadka, Jeera Rice, hot Phulkas, fresh Kachumber salad, and Gulab Jamun.</p>
              </div>

              <div className="bg-[#EAE4D9] p-4 sm:p-4.5 rounded-2xl">
                <h5 className="font-serif text-sm sm:text-base font-bold text-[#1B3564] mb-1">Evening High Tea &amp; BBQ</h5>
                <p className="leading-relaxed">Hot Kanda Bhajji (Pakoras), live grilled Paneer &amp; Chicken skewers by the pool deck, cookies, and ginger tea.</p>
              </div>

              <div className="bg-[#EAE4D9] p-4 sm:p-4.5 rounded-2xl">
                <h5 className="font-serif text-sm sm:text-base font-bold text-[#1B3564] mb-1">Dinner</h5>
                <p className="leading-relaxed">Slow-cooked Veg / Chicken Biryani with spicy salan, Raita, Dal Makhani, Tawa Roti, and warm Moong Dal Halwa.</p>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B3564] hover:bg-[#122444] text-white font-bold text-xs sm:text-sm py-3.5 rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Book Meals on WhatsApp with Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* BROCHURE & RESERVATION INQUIRY MODAL                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {isBrochureOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsBrochureOpen(false)}
        >
          <div
            className="bg-[#F5F0E8] text-[#1E261E] rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#DDD5C7] relative overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBrochureOpen(false)}
              className="absolute top-5 right-5 text-[#556353] hover:text-[#1E261E] p-2 rounded-full hover:bg-[#E5DDD0] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-widest text-[#1B3564] font-bold block mb-1">
                Stay Willas Concierge
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1B3564]">
                The Angle House
              </h3>
              <p className="text-xs sm:text-sm text-[#4E5E4C] mt-1">
                Kurwande, Lonavala • 3 BHK Luxury Glasshouse Estate
              </p>
            </div>

            <div className="space-y-4 mb-6 text-xs sm:text-sm text-[#3E4B3D]">
              <div className="p-4 rounded-2xl bg-[#EBE5DA] space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Weekday Tariff:</span>
                  <span className="font-bold text-[#1B3564]">₹13,000 / night</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Weekend Tariff:</span>
                  <span className="font-bold text-[#1B3564]">₹20,000 / night</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Capacity:</span>
                  <span className="font-bold text-[#1B3564]">Up to 14 Guests</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Amenities:</span>
                  <span className="font-bold text-[#1B3564]">Waterfall Pool, Jacuzzi, Chef</span>
                </div>
              </div>

              <p className="leading-relaxed text-xs sm:text-sm text-[#435242]">
                Receive the complete high-resolution property brochure, customized dietary menus, and check real-time availability with our concierge team.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B3564] hover:bg-[#122444] text-white font-bold text-xs sm:text-sm py-3.5 rounded-full shadow hover:shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Inquire on WhatsApp Now</span>
              </a>

              <a
                href="tel:+919619042310"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E7E0D3] hover:bg-[#DBD3C4] text-[#1B3564] font-bold text-xs sm:text-sm py-3 rounded-full transition-all"
              >
                <Phone className="w-4 h-4 text-[#DAA520]" />
                <span>Call Concierge: +91 96190 42310</span>
              </a>

              <Link
                href="/villa/the-angle-house"
                className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-[#4E5D4C] hover:text-[#1B3564] py-2 transition-colors font-semibold"
              >
                <span>View Full Property Calendar &amp; Live Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
