"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface VideoCardProps {
  src: string;
  poster?: string;
  title?: string;
  guestName?: string;
  villaName?: string;
  location?: string;
}

export default function VideoCard({ src, poster, title, guestName }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
        });
      } else if ((video as any).webkitEnterFullscreen) {
        // iOS Safari fullscreen
        (video as any).webkitEnterFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
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
    // Listen for pause/play events
    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative flex flex-col group rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(27,53,100,0.08)] bg-slate-900 border border-[#DAA520]/20 cursor-pointer ${
        isFullscreen 
          ? "w-full h-full max-w-none rounded-none aspect-auto flex items-center justify-center" 
          : "w-full aspect-[9/16] max-w-[260px] sm:max-w-[280px] mx-auto"
      }`}
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
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className={`w-full h-full transition-transform duration-1000 ${isFullscreen ? "object-contain max-h-screen" : "object-cover group-hover:scale-[1.02]"}`}
      />

      {/* Top Right Fullscreen Button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        className="absolute top-3.5 right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>

      {/* Center Big Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 transition-opacity duration-300 pointer-events-none">
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

      {/* Bottom Player Controls HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20 flex flex-col justify-end text-white">
        {/* HUD controls visible on hover or if playing */}
        <div className={`flex items-center justify-between gap-2.5 transition-all duration-300 ${showControls || isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
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

          {/* Fullscreen HUD Button */}
          <button 
            type="button"
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
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
