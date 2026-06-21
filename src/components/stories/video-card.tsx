"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface VideoCardProps {
  src: string;
  title: string;
  guestName: string;
  villaName: string;
  location: string;
}

export default function VideoCard({ src, title, guestName, villaName, location }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause all other videos on the page
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((v) => {
        if (v !== videoRef.current) {
          v.pause();
        }
      });
      // Play this one
      videoRef.current.play().catch(err => console.log("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger play/pause
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    // Listen for pause events from outside (like other videos playing)
    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(27,53,100,0.08)] bg-white border border-slate-100/80 cursor-pointer w-full aspect-[9/16] max-w-[260px] sm:max-w-[280px] mx-auto"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
      />

      {/* Top Overlay Badge */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 bg-[#0E1B35]/80 backdrop-blur-md text-[#E2A63B] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
        <MapPin size={9} />
        <span>{location}</span>
      </div>

      {/* Center Big Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 transition-opacity duration-300">
        {!isPlaying && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-md shadow-xl flex items-center justify-center text-[#1B3564] group-hover:scale-110 transition-all duration-300 border border-slate-100"
          >
            <Play size={24} className="ml-1 fill-[#1B3564]" />
          </motion.div>
        )}
      </div>

      {/* Bottom Text and Player Controls HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0E1B35]/95 via-[#0E1B35]/70 to-transparent z-20 flex flex-col justify-end text-white">
        
        {/* Caption */}
        <div className="flex flex-col mb-3 pointer-events-none">
          <span className="text-[#DAA520] text-[10px] font-black tracking-widest uppercase mb-1">{villaName}</span>
          <h4 className="text-sm font-bold leading-snug line-clamp-2">{title}</h4>
          <span className="text-[11px] text-slate-300 mt-1 font-medium">— {guestName}</span>
        </div>

        {/* HUD controls visible on hover or if playing */}
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${showControls || isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
          {/* Play/Pause Button */}
          <button 
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15"
          >
            {isPlaying ? <Pause size={12} className="fill-white" /> : <Play size={12} className="ml-0.5 fill-white" />}
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-[#DAA520]" style={{ width: `${progress}%` }} />
          </div>

          {/* Mute Button */}
          <button 
            type="button"
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15"
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>
      </div>
      
      {/* Absolute Bottom Thin Progress Line when HUD is hidden */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30 transition-opacity duration-300 ${showControls || isPlaying ? "opacity-0" : "opacity-100"}`}>
        <div className="h-full bg-[#DAA520]/80" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
