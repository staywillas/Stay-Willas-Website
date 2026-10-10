"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useLenis } from "lenis/react";

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
  initialView: "grid" | "lightbox";
  initialIndex: number;
  onClose: () => void;
}

const PropertyGalleryViewer = ({ images, propertyName, initialView, initialIndex, onClose }: PropertyGalleryProps) => {
  const [isGridOpen, setIsGridOpen] = useState(initialView === "grid");
  const [isLightboxOpen, setIsLightboxOpen] = useState(initialView === "lightbox");
  const [activeIdx, setActiveIdx] = useState(initialIndex);
  const lenis = useLenis();

  // Zoom & Pan states for Lightbox
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startTouch = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });

  const resetZoom = () => { setZoomScale(1); setPan({ x: 0, y: 0 }); };
  const selectImage = (index: number) => { setActiveIdx(index); resetZoom(); };
  useEffect(() => {
    if (isGridOpen || isLightboxOpen) return;
    // Allow the closing animation to finish before releasing the viewer bundle.
    const timer = window.setTimeout(onClose, 400);
    return () => window.clearTimeout(timer);
  }, [isGridOpen, isLightboxOpen, onClose]);

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

  useEffect(() => {
    if (!isGridOpen && !isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousHeight = document.body.style.height;
    const wasStopped = lenis?.isStopped;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.height = previousHeight;
      if (!wasStopped) lenis?.start();
    };
  }, [lenis, isGridOpen, isLightboxOpen]);

  // Keyboard navigation for the lightbox stage
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomScale(1); setPan({ x: 0, y: 0 });
        setActiveIdx(prev => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setZoomScale(1); setPan({ x: 0, y: 0 });
        setActiveIdx(prev => (prev - 1 + images.length) % images.length);
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  const closeGridOverlay = () => {
    setIsGridOpen(false);
  };

  const openLightbox = (index: number) => {
    selectImage(index);
    setIsLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetZoom();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetZoom();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Stage 1: Full-Screen Grid Overlay (React Portal) */}
      {createPortal(
        <AnimatePresence>
          {isGridOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-[200000] bg-charcoal overflow-y-auto flex flex-col justify-start"
              data-lenis-prevent
            >
              {/* Sticky grid header control */}
              <div className="sticky top-0 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 py-5 px-6 md:px-12 flex items-center justify-between z-[200100]">
                <button 
                  aria-label="Close photo grid"
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
      {createPortal(
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[210000] bg-black/98 backdrop-blur-3xl flex flex-col justify-between overflow-hidden select-none w-full h-full"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Header controls (fixed size: h-20) */}
              <div className="w-full h-20 flex items-center justify-between px-6 md:px-12 relative z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
                <div className="text-white/60 text-[10px] font-black tracking-[0.3em] uppercase">
                  {propertyName} <span className="mx-2 text-white/20">•</span> 
                  <span className="text-[#FFCC00]">{activeIdx + 1}</span> of {images.length}
                </div>
                <button 
                  aria-label="Close photo viewer" onClick={() => setIsLightboxOpen(false)}
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
                  aria-label="Previous photo" onClick={prevImage}
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
                  aria-label="Next photo" onClick={nextImage}
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
                    onClick={() => selectImage(idx)}
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

export default PropertyGalleryViewer;
