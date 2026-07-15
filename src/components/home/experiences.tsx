"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronRight, RotateCcw, Sparkles } from "lucide-react";

const categories = [
  {
    title: "Heated Infinity Pools",
    tag: "SIGNATURE WATERFALLS",
    description: "Submerge into absolute tranquility. Our luxury villas offer private, temperature-controlled infinity pools with panoramic views of misty ghats and surrounding valleys.",
    image: "/images/exp-pool.png",
    link: "/villas?category=Infinity+Pools",
  },
  {
    title: "Bespoke Private Chefs",
    tag: "GASTRONOMIC BLISS",
    description: "Savor a customized farm-to-table menu designed just for you. From traditional local delicacies to multi-course continental banquets, prepared on-site by our verified private chefs.",
    image: "/images/exp-chef.png",
    link: "/villas",
  },
  {
    title: "Misty Mountain Ghats",
    tag: "ELEVATED RETREATS",
    description: "Unwind above the clouds. Enjoy stunning balcony sunsets, scenic valley hikes, and cool refreshing breezes in Lonavala and Igatpuri.",
    image: "/images/exp-mountain.png",
    link: "/villas?category=Mountain+View",
  },
  {
    title: "Intimate Bonfire Pits",
    tag: "COZY STARLIGHT LOUNGES",
    description: "Gather under the stars. Warm up around cozy, hand-laid bonfire pits and outdoor stone fireplaces with your favorite music, vintage wines, and close companions.",
    image: "/images/villa-alibaug.png",
    link: "/villas?category=Couple+Retreats",
  },
  {
    title: "Pet Play Sanctuaries",
    tag: "FURRY FRIENDS WELCOME",
    description: "Vacation is better together. Our premium pet-friendly villas feature sprawling lawns, secure play zones, and specialized services so your pets can run free and enjoy a true holiday.",
    image: "/images/villa-mahabaleshwar.png",
    link: "/villas",
  },
];

// Staggered variants for premium text reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
} as const;

const Experiences = () => {
  const [deck, setDeck] = useState([0, 1, 2, 3, 4]);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor tracking (buttery organic feel)
  const springConfig = { stiffness: 120, damping: 22, mass: 0.7 };
  const rotateX = useSpring(mouseY, springConfig);
  const rotateY = useSpring(mouseX, springConfig);

  const cardRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const activeIndex = deck[0];
  const activeExperience = categories[activeIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || swiping || isDraggingRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor displacement from center of card
    const currentMouseX = e.clientX - rect.left - width / 2;
    const currentMouseY = e.clientY - rect.top - height / 2;
    
    const rX = -(currentMouseY / height) * 15; // Max 15 deg tilt vertically
    const rY = (currentMouseX / width) * 15;  // Max 15 deg tilt horizontally
    
    mouseX.set(rY);
    mouseY.set(rX);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSwipeOut = (direction: "left" | "right") => {
    if (swiping) return;
    setSwiping(true);
    setSwipeDirection(direction);
    setIsHovered(false);
    
    // Reset motion values smoothly
    mouseX.set(0);
    mouseY.set(0);
    
    // Reset swiping after card slides out
    setTimeout(() => {
      setDeck((prevDeck) => {
        const updated = [...prevDeck];
        const top = updated.shift()!;
        updated.push(top);
        return updated;
      });
      setSwiping(false);
      setSwipeDirection(null);
    }, 400);
  };

  const handleNextCard = () => {
    handleSwipeOut("right");
  };

  const handleResetDeck = () => {
    if (swiping) return;
    setDeck([0, 1, 2, 3, 4]);
  };

  return (
    <section className="py-8 md:py-32 px-4 md:px-12 lg:px-24 bg-[#FAF7F0] relative overflow-hidden select-none">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#DAA520]/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1B3564]/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-6 md:mb-24 text-center">
          <span className="inline-flex items-center gap-1.5 text-[#DAA520] font-black tracking-[0.3em] uppercase text-[9px] md:text-xs mb-1 md:mb-4 bg-[#DAA520]/15 px-4 py-2 rounded-full border border-[#DAA520]/20">
            <Sparkles size={10} className="text-[#DAA520] animate-pulse" /> Curated Experiences
          </span>
          <h2 className="text-2xl sm:text-6xl md:text-7xl font-heading text-[#1B3564] mt-1 md:mt-4 leading-tight font-normal">
            Elevate Your <span className="italic text-[#DAA520]">Every Mood</span>
          </h2>
          <p className="text-[11px] md:text-base text-slate-500 mt-2 md:mt-6 max-w-xl mx-auto leading-relaxed font-light">
            From temperature-controlled pool submersions to bespoke star-lit fires, discover the slow luxury staycation crafted specifically for you.
          </p>
        </div>

        {/* Dual Layout: Interactive 3D Stack Panel & Card Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[400px] lg:min-h-[500px]">
          
          {/* Left Column: Synchronized Details Info Card */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3 sm:space-y-6"
              >
                {/* Active Tag */}
                <motion.div variants={itemVariants}>
                  <span className="inline-block text-[#DAA520] font-extrabold tracking-[0.25em] text-[9px] sm:text-[10px] uppercase bg-[#DAA520]/10 border border-[#DAA520]/20 px-3 py-1 rounded-md">
                    {activeExperience.tag}
                  </span>
                </motion.div>
                
                {/* Active Title */}
                <motion.h3 
                  variants={itemVariants}
                  className="text-2xl sm:text-5xl font-heading text-[#1B3564] leading-tight font-normal"
                >
                  {activeExperience.title}
                </motion.h3>
                
                {/* Active Description */}
                <motion.p 
                  variants={itemVariants}
                  className="text-[#1B3564]/70 text-xs sm:text-base leading-relaxed font-light max-w-xl"
                >
                  {activeExperience.description}
                </motion.p>

                {/* Interactive Action Row */}
                <motion.div variants={itemVariants} className="pt-2 sm:pt-6 flex flex-row items-center gap-2 sm:gap-4">
                  <Link
                    href={activeExperience.link}
                    className="group bg-[#1B3564] hover:bg-[#152A50] text-white font-extrabold px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-[#1B3564]/15 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
                  >
                    Explore villas
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1.5" />
                  </Link>

                  <button
                    onClick={handleNextCard}
                    disabled={swiping}
                    className="group flex items-center gap-1.5 px-3.5 py-2.5 sm:px-6 sm:py-4 rounded-full border border-[#1B3564]/15 hover:border-[#1B3564]/40 text-[#1B3564] text-[9px] sm:text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer hover:bg-[#1B3564]/5 disabled:opacity-50 whitespace-nowrap"
                  >
                    Next Experience
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive 3D Stack Polaroid Card Deck */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px] md:min-h-[500px]">
            {/* Control Reset floating button */}
            <div className="absolute top-[-24px] right-[10%] z-20">
              <button
                onClick={handleResetDeck}
                className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-[#DAA520] transition-colors cursor-pointer"
                title="Reset Deck"
              >
                <RotateCcw size={9} /> Reset Deck
              </button>
            </div>

            {/* Stacked Cards Area */}
            <div className="relative w-[230px] h-[300px] sm:w-[280px] sm:h-[360px] md:w-[320px] md:h-[410px]">
              {deck.map((catIdx, position) => {
                const isTop = position === 0;
                const cat = categories[catIdx];
                
                // Show up to 3 cards in the visible visual stack
                if (position > 2) return null;

                return (
                  <motion.div
                    key={catIdx}
                    ref={isTop ? cardRef : null}
                    onMouseMove={isTop ? handleMouseMove : undefined}
                    onMouseEnter={isTop ? () => setIsHovered(true) : undefined}
                    onMouseLeave={isTop ? () => {
                      setIsHovered(false);
                      handleMouseLeave();
                    } : undefined}
                    onClick={isTop && !isDraggingRef.current ? handleNextCard : undefined}
                    drag={isTop && !swiping ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                    }}
                    onDragEnd={(event, info) => {
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 50); // small delay to prevent click event triggering right after drag release
                      
                      if (!isTop || swiping) return;
                      const swipeThreshold = 80;
                      if (info.offset.x > swipeThreshold) {
                        handleSwipeOut("right");
                      } else if (info.offset.x < -swipeThreshold) {
                        handleSwipeOut("left");
                      } else {
                        mouseX.set(0);
                        mouseY.set(0);
                      }
                    }}
                    whileTap={isTop && !swiping ? { scale: 0.97 } : undefined}
                    style={{
                      rotateX: isTop ? rotateX : 0,
                      rotateY: isTop ? rotateY : 0,
                      transformPerspective: 1200,
                      zIndex: 10 - position,
                    }}
                    animate={{
                      scale: isTop 
                        ? (swiping 
                          ? 0.92 
                          : (isHovered ? 1.03 : 1)) 
                        : 1 - position * 0.05,
                      y: isTop 
                        ? (swiping 
                          ? -60 
                          : (isHovered ? -8 : 0)) 
                        : position * 18 + (isHovered ? position * 8 : 0),
                      x: isTop 
                        ? (swiping 
                          ? (swipeDirection === "left" ? -450 : 450) 
                          : 0) 
                        : 0,
                      rotate: isTop 
                        ? (swiping 
                          ? (swipeDirection === "left" ? -35 : 35) 
                          : 0) 
                        : (position === 1 
                          ? (isHovered ? -4 : -3) 
                          : position === 2 
                            ? (isHovered ? 4 : 3) 
                            : 0),
                      opacity: isTop ? (swiping ? 0 : 1) : 1 - position * 0.25,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: isTop && swiping ? 220 : 350,
                      damping: isTop && swiping ? 26 : 28,
                      mass: 0.8,
                    }}
                    className={`
                      absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-[#1B3564]/10 shadow-[0_15px_35px_rgba(27,53,100,0.12)] p-3 pb-8 sm:p-4 sm:pb-12 flex flex-col justify-between cursor-pointer transition-shadow duration-300 origin-bottom select-none
                      ${isTop ? 'hover:shadow-[0_25px_50px_rgba(27,53,100,0.22)] active:scale-[0.98]' : 'pointer-events-none'}
                    `}
                  >
                    {/* Inner Image Container */}
                    <div className="relative w-full h-[78%] sm:h-[82%] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-slate-100">
                      <Image
                        src={cat.image}
                        alt={`${cat.title} at luxury private pool villas near Mumbai`}
                        fill
                        sizes="320px"
                        priority={isTop}
                        quality={85}
                        className="object-cover transition-transform duration-500 ease-out"
                        style={{
                          transform: isTop && isHovered ? "scale(1.06)" : "scale(1)"
                        }}
                      />
                      {/* Ambient shadow gradient bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Lower Polaroid label */}
                    <div className="pt-2 px-1.5 sm:pt-4 sm:px-2 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[6.5px] sm:text-[7.5px] font-black tracking-[0.25em] text-[#DAA520] uppercase">
                          {cat.tag}
                        </span>
                        <span className="text-xs sm:text-base font-heading text-[#1B3564] mt-0.5 font-bold italic">
                          {cat.title}
                        </span>
                      </div>
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1B3564]/5 flex items-center justify-center text-[#1B3564] text-[10px] sm:text-xs font-black">
                        →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experiences;
