"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid, ZoomIn } from "lucide-react";
import { useLenis } from "lenis/react";
import ShareButton from "@/components/villa/share-button";
import SaveButton from "@/components/villa/save-button";

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
  villaId: string;
}

const PropertyGallery = ({ images, propertyName, villaId }: PropertyGalleryProps) => {
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  // Zoom & Pan states for Lightbox
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startTouch = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });

  // Reset zoom whenever activeIdx changes or lightbox closes
  useEffect(() => {
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
  }, [activeIdx, isLightboxOpen]);

  const toggleZoom = (clientX: number, clientY: number, containerRect: DOMRect) => {
    if (zoomScale > 1) {
      setZoomScale(1);
      setPan({ x: 0, y: 0 });
    } else {
      const x = (containerRect.width / 2 - (clientX - containerRect.left)) * 1.5;
      const y = (containerRect.height / 2 - (clientY - containerRect.top)) * 1.5;
      setZoomScale(2.5);
      setPan({ x, y });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale === 1) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      startTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startPan.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomScale === 1) return;
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - startTouch.current.x;
      const dy = e.touches[0].clientY - startTouch.current.y;
      const maxPanX = (zoomScale - 1) * 200;
      const maxPanY = (zoomScale - 1) * 200;
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, startPan.current.x + dx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, startPan.current.y + dy)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale === 1) return;
    setIsDragging(true);
    startTouch.current = { x: e.clientX, y: e.clientY };
    startPan.current = { ...pan };
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale === 1) return;
    const dx = e.clientX - startTouch.current.x;
    const dy = e.clientY - startTouch.current.y;
    const maxPanX = (zoomScale - 1) * 250;
    const maxPanY = (zoomScale - 1) * 250;
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, startPan.current.x + dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, startPan.current.y + dy)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set mounted state to safely run React Portals on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll fully and pause/resume Lenis smooth scrolling
  useEffect(() => {
    if (!mounted) return;
    
    if (isGridOpen || isLightboxOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      if (lenis) {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      if (lenis) {
        lenis.start();
      }
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      if (lenis) {
        lenis.start();
      }
    };
  }, [mounted, isGridOpen, isLightboxOpen, lenis]);

  // Keyboard navigation for the lightbox stage
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Safe fallback images if less than 5 are provided
  const visibleImages = [...images];
  while (visibleImages.length < 5) {
    visibleImages.push(images[0] || "/images/hero-villa.png");
  }

  const openGridOverlay = () => {
    setIsGridOpen(true);
  };

  const closeGridOverlay = () => {
    setIsGridOpen(false);
  };

  const openLightbox = (index: number) => {
    setActiveIdx(index);
    setIsLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Mobile-Only Swipeable Carousel (Hidden on Desktop) */}
      <div className="md:hidden relative w-full mb-8 overflow-hidden rounded-3xl aspect-[4/3] border border-white/10 shadow-2xl">
        <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
          {visibleImages.slice(0, 5).map((img, idx) => (
            <div 
              key={idx}
              onClick={() => openLightbox(idx)}
              className="w-full h-full flex-shrink-0 snap-start snap-always relative cursor-pointer bg-charcoal"
            >
              <Image 
                src={img} 
                alt={`${propertyName} luxury private pool villa photo ${idx + 1}`} 
                fill 
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover" 
              />
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black text-white/80 border border-white/10">
                {idx + 1} / 5
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile signature view badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-[#FFCC00] shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00] animate-pulse"></span>
          Signature View
        </div>

        {/* Floating Share and Save Buttons on Mobile */}
        <div className="absolute top-4 right-4 flex items-center gap-2.5 z-10">
          <ShareButton minimal />
          <SaveButton villaId={villaId} villaName={propertyName} minimal />
        </div>

        {/* Show All Photos floating button on Mobile */}
        <button 
          onClick={openGridOverlay}
          className="absolute bottom-4 left-4 bg-black/80 hover:bg-black/95 text-white backdrop-blur-md border border-white/10 hover:border-gold/30 px-5 py-3 rounded-xl flex items-center gap-2 text-[9px] font-black tracking-[0.15em] uppercase transition-all duration-300 shadow-xl cursor-pointer"
        >
          <Grid size={11} className="text-[#FFCC00]" />
          View all {images.length} photos
        </button>
      </div>

      {/* Cinematic 5-Image Grid (Hidden on Mobile, Visible on Desktop) */}
      <div className="hidden md:block relative w-full mb-16 overflow-hidden rounded-3xl md:aspect-[21/9] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-full w-full">
          {/* Main Hero Shot (Left) */}
          <div 
            onClick={openGridOverlay}
            className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer bg-charcoal"
          >
            <Image 
              src={visibleImages[0]} 
              alt={`${propertyName} private pool villa exterior view`} 
              fill 
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-[#FFCC00] shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00] animate-pulse"></span>
              Signature View
            </div>
            {/* Hover Expand Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <Grid size={20} className="text-[#FFCC00]" />
              </div>
            </div>
          </div>

          {/* Grid Box 2 */}
          <div 
            onClick={openGridOverlay}
            className="relative group overflow-hidden cursor-pointer bg-charcoal"
          >
            <Image 
              src={visibleImages[1]} 
              alt={`${propertyName} pool and garden area`} 
              fill 
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 320px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <Grid size={16} className="text-[#FFCC00]" />
              </div>
            </div>
          </div>

          {/* Grid Box 3 */}
          <div 
            onClick={openGridOverlay}
            className="relative group overflow-hidden cursor-pointer bg-charcoal"
          >
            <Image 
              src={visibleImages[2]} 
              alt={`${propertyName} luxury bedroom interior`} 
              fill 
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 320px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <Grid size={16} className="text-[#FFCC00]" />
              </div>
            </div>
          </div>

          {/* Grid Box 4 */}
          <div 
            onClick={openGridOverlay}
            className="relative group overflow-hidden cursor-pointer bg-charcoal"
          >
            <Image 
              src={visibleImages[3]} 
              alt={`${propertyName} living area and amenities`} 
              fill 
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 320px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <Grid size={16} className="text-[#FFCC00]" />
              </div>
            </div>
          </div>

          {/* Grid Box 5 */}
          <div 
            onClick={openGridOverlay}
            className="relative group overflow-hidden cursor-pointer bg-charcoal"
          >
            <Image 
              src={visibleImages[4]} 
              alt={`${propertyName} outdoor lounge and scenic view`} 
              fill 
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 320px"
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                <Grid size={16} className="text-[#FFCC00]" />
              </div>
            </div>
          </div>
        </div>

        {/* Show All Photos Button (Floating Bottom-Right) */}
        <button 
          onClick={openGridOverlay}
          className="absolute bottom-6 right-6 bg-black/80 hover:bg-black/95 text-white backdrop-blur-md border border-white/10 hover:border-gold/30 hover:scale-105 px-6 py-3 rounded-full flex items-center gap-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl cursor-pointer"
        >
          <Grid size={13} className="text-[#FFCC00]" />
          Show all {images.length} photos
        </button>
      </div>

      {/* Stage 1: Full-Screen Grid Overlay (React Portal) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isGridOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-[9000] bg-charcoal overflow-y-auto flex flex-col justify-start"
              data-lenis-prevent
            >
              {/* Sticky grid header control */}
              <div className="sticky top-0 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 py-5 px-6 md:px-12 flex items-center justify-between z-[9100]">
                <button 
                  onClick={closeGridOverlay}
                  className="flex items-center gap-2 text-white/60 hover:text-[#FFCC00] text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  Back to {propertyName}
                </button>
                
                <div className="text-white font-heading text-lg italic hidden sm:block">
                  All Photos <span className="text-[#FFCC00] not-italic font-bold ml-1">({images.length})</span>
                </div>
                
                <button 
                  onClick={closeGridOverlay}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable multi-column image grid of all 20 images */}
              <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 w-full">
                <div className="text-center mb-12">
                  <span className="text-[#FFCC00] text-[10px] tracking-[0.4em] uppercase font-black mb-2 block">Cinematic Collection</span>
                  <h2 className="text-3xl md:text-5xl font-heading text-white italic">
                    Explore <span className="text-gold not-italic font-bold font-sans">Every Angle</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
                      onClick={() => openLightbox(index)}
                      className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-[#141414] shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
                    >
                      <Image 
                        src={img}
                        alt={`${propertyName} luxury villa gallery image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-105"
                      />
                      {/* Hover expand overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                          <ZoomIn size={20} />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5 text-white/60 text-[9px] font-bold tracking-wider">
                        Photo {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Stage 2: Full-screen image lightbox slideshow (React Portal) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col justify-between overflow-hidden select-none w-screen h-screen"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Header controls (fixed size: h-20) */}
              <div className="w-full h-20 flex items-center justify-between px-6 md:px-12 relative z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
                <div className="text-white/60 text-[10px] font-black tracking-[0.3em] uppercase">
                  {propertyName} <span className="mx-2 text-white/20">•</span> 
                  <span className="text-[#FFCC00]">{activeIdx + 1}</span> of {images.length}
                </div>
                <button 
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Stage Image Viewer (Dynamic size: remaining height calc(100vh - 12rem)) */}
              <div 
                className="w-full h-[calc(100vh-12rem)] flex items-center justify-between px-6 md:px-16 lg:px-24 relative" 
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Arrow Button */}
                <button 
                  onClick={prevImage}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl relative z-50 shrink-0"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Central Focused Image Container */}
                <div className="flex-grow h-full relative mx-4 md:mx-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full h-[90%] relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] border border-white/5 select-none"
                      style={{ cursor: zoomScale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onDoubleClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        toggleZoom(e.clientX, e.clientY, rect);
                      }}
                    >
                      <div
                        className="w-full h-full relative transition-transform duration-200 ease-out"
                        style={{
                          transform: `scale(${zoomScale}) translate(${pan.x / zoomScale}px, ${pan.y / zoomScale}px)`,
                          transformOrigin: "center center",
                        }}
                      >
                        <Image 
                          src={images[activeIdx]} 
                          alt={`${propertyName} high resolution villa photo ${activeIdx + 1}`}
                          fill
                          priority
                          className="object-contain pointer-events-none"
                        />
                      </div>

                      {/* Floating Zoom Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (zoomScale > 1) {
                            setZoomScale(1);
                            setPan({ x: 0, y: 0 });
                          } else {
                            setZoomScale(2.5);
                            setPan({ x: 0, y: 0 });
                          }
                        }}
                        className="absolute bottom-4 right-4 z-[99] bg-black/70 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black text-white/90 hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <ZoomIn size={14} className="text-[#FFCC00]" />
                        {zoomScale > 1 ? "Zoom Out" : "Zoom In"}
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Arrow Button */}
                <button 
                  onClick={nextImage}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl relative z-50 shrink-0"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Bottom thumbnail strip (fixed size: h-28) */}
              <div 
                className="w-full h-28 bg-black/60 border-t border-white/5 py-4 px-12 overflow-x-auto flex gap-3.5 items-center justify-start md:justify-center relative z-50 no-scrollbar scroll-smooth"
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`relative flex-shrink-0 w-16 h-11 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      idx === activeIdx ? "border-[#FFCC00] scale-105 brightness-110" : "border-transparent opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${propertyName} thumbnail preview ${idx + 1}`} 
                      fill 
                      sizes="80px"
                      className="object-cover" 
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default PropertyGallery;
