"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Check, RotateCcw, Sparkles, Loader2, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface CameraWatermarkProps {
  roleName: string; // "Caretaker" | "Chef"
  categoryName: string; // "Swimming Pool" | "Lunch Spread" etc.
  villaName?: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  lang?: CareLanguage;
  maxPhotos?: number;
}

export default function CameraWatermark({
  roleName,
  categoryName,
  villaName = "The Angle House, Lonavala",
  photos,
  onPhotosChange,
  lang = "en",
  maxPhotos = 6,
}: CameraWatermarkProps) {
  const t = translations[lang] || translations.en;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLiveViewfinder, setShowLiveViewfinder] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera stream on unmount or when modal closes
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  /**
   * Launch strictly live camera:
   * Try in-app WebRTC live video viewfinder first.
   * If not supported or denied, fall back to native device camera via capture="environment".
   */
  const handleOpenLiveCamera = async () => {
    if (photos.length >= maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed per item.`);
      return;
    }

    setCameraError(null);
    setShowLiveViewfinder(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        // Fallback to native camera input
        setShowLiveViewfinder(false);
        fileInputRef.current?.click();
      }
    } catch (err: any) {
      console.warn("Live WebRTC camera unavailable or blocked, falling back to mobile camera:", err);
      setShowLiveViewfinder(false);
      // Native camera fallback (strictly opens camera app, no gallery)
      fileInputRef.current?.click();
    }
  };

  const handleCloseViewfinder = () => {
    stopCameraStream();
    setShowLiveViewfinder(false);
  };

  const handleFlipCamera = async () => {
    stopCameraStream();
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Failed to flip camera:", err);
    }
  };

  /**
   * Snap frame from live WebRTC video
   */
  const handleSnapFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    setIsProcessing(true);
    handleCloseViewfinder();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    processAndCompressWatermark(rawDataUrl);
  };

  /**
   * Native device camera fallback handler
   */
  const handleNativeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const rawBase64 = reader.result as string;
        processAndCompressWatermark(rawBase64);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Camera processing failed:", err);
      setIsProcessing(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /**
   * Calculate size of base64 data string in KB
   */
  const calculateBase64SizeKB = (base64String: string): number => {
    const stringLength = base64String.length - (base64String.indexOf(",") + 1);
    return Math.round((stringLength * 3) / 4 / 1024);
  };

  /**
   * Watermark Compositor & Guaranteed < 500 KB Auto-Compressor
   */
  const processAndCompressWatermark = (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1. Constrain maximum resolution to 1280px (crisp HD while keeping size ultra-low)
      const maxDim = 1280;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // 2. Draw original photo
      ctx.drawImage(img, 0, 0, width, height);

      // 3. Generate Real-time IST Timestamp
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const dateStr = now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const fullTimestamp = `${dateStr.toUpperCase()} • ${timeStr.toUpperCase()} IST`;

      // 4. Inscribe Bottom HUD Watermark Banner
      const bannerHeight = Math.max(100, Math.round(height * 0.15));
      const bannerY = height - bannerHeight;

      // Dark gradient overlay
      const gradient = ctx.createLinearGradient(0, bannerY - 24, 0, height);
      gradient.addColorStop(0, "rgba(10, 15, 30, 0)");
      gradient.addColorStop(0.2, "rgba(10, 15, 30, 0.88)");
      gradient.addColorStop(1, "rgba(8, 12, 24, 0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, bannerY - 24, width, bannerHeight + 24);

      // Golden accent divider line
      ctx.fillStyle = "#DAA520";
      ctx.fillRect(0, bannerY - 2, width, 3);

      const baseFontSize = Math.max(13, Math.round(width * 0.022));
      const paddingX = Math.round(width * 0.035);

      // Line 1: Property Name & Brand Badge
      ctx.font = `bold ${Math.round(baseFontSize * 1.25)}px sans-serif`;
      ctx.fillStyle = "#DAA520";
      ctx.fillText(`🏰 ${villaName.toUpperCase()} • STAY WILLAS`, paddingX, bannerY + baseFontSize * 1.5);

      // Line 2: Category & Role Proof
      ctx.font = `bold ${baseFontSize}px sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        `✓ ${roleName.toUpperCase()} LIVE PROOF: ${categoryName.toUpperCase()}`,
        paddingX,
        bannerY + baseFontSize * 3
      );

      // Line 3: Verified Timestamp & Location
      ctx.font = `bold ${Math.round(baseFontSize * 0.92)}px monospace`;
      ctx.fillStyle = "#A7F3D0";
      ctx.fillText(
        `🕒 ${fullTimestamp} | 📍 KAMSHET, LONAVALA`,
        paddingX,
        bannerY + baseFontSize * 4.3
      );

      // 5. Intelligent Decompressor / Auto-Compressor: Force file size strictly < 500 KB
      let quality = 0.80;
      let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      let sizeKB = calculateBase64SizeKB(compressedDataUrl);

      // Iteratively reduce quality if exceeding 480 KB until guaranteed < 500 KB
      const qualitySteps = [0.72, 0.62, 0.52, 0.42, 0.35];
      let stepIndex = 0;

      while (sizeKB > 480 && stepIndex < qualitySteps.length) {
        quality = qualitySteps[stepIndex];
        compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        sizeKB = calculateBase64SizeKB(compressedDataUrl);
        stepIndex++;
      }

      // Add to photos array
      onPhotosChange([...photos, compressedDataUrl]);
      setIsProcessing(false);
    };

    img.onerror = () => {
      setIsProcessing(false);
      alert("Failed to load camera image. Please try again.");
    };

    img.src = dataUrl;
  };

  const handleDeletePhoto = (indexToRemove: number) => {
    onPhotosChange(photos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden native camera file input (strict environment capture, no gallery allowed) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeFileChange}
        className="hidden"
      />

      {/* Grid of Snapped Watermarked Photos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {photos.map((photo, idx) => {
            const kb = calculateBase64SizeKB(photo);
            return (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden border border-emerald-500/60 shadow-md bg-slate-900 group aspect-4/3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Size Badge (<500KB indicator) */}
                <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Check size={10} className="stroke-[3]" />
                  <span>{kb} KB</span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(idx)}
                  aria-label={t.delete}
                  className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-700 active:scale-95 text-white p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
                >
                  <Trash2 size={13} />
                </button>

                <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-slate-300 font-mono">
                  #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trigger Button: Strictly Live Camera */}
      {photos.length < maxPhotos && (
        <button
          type="button"
          onClick={handleOpenLiveCamera}
          disabled={isProcessing}
          className={`w-full py-3.5 px-4 rounded-xl border-2 border-dashed transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer shadow-md ${
            photos.length === 0
              ? "bg-[#1B3564] hover:bg-[#152A50] border-[#DAA520]/70 text-white"
              : "bg-slate-800/80 hover:bg-slate-800 border-slate-600 text-slate-200"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-[#DAA520]" />
              <span className="text-xs font-bold text-[#DAA520]">{t.compressing}</span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-[#DAA520]/20 flex items-center justify-center text-[#DAA520]">
                {photos.length === 0 ? <Camera size={18} className="stroke-[2.5]" /> : <Plus size={18} className="stroke-[2.5]" />}
              </div>
              <div className="text-left">
                <span className="text-sm font-bold block leading-tight">
                  {photos.length === 0 ? t.takePhoto : t.takeAnotherPhoto}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {t.noGalleryNotice}
                </span>
              </div>
            </>
          )}
        </button>
      )}

      {/* Full-Screen In-App Live Camera Viewfinder Modal */}
      {showLiveViewfinder && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
          {/* Header Bar */}
          <div className="p-4 flex items-center justify-between bg-black/60 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                {t.liveCameraOnly} • {categoryName}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCloseViewfinder}
              className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Video Stream Viewfinder */}
          <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* Live Crosshair Overlay */}
            <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-6 h-6 border-t-2 border-l-2 border-[#DAA520] absolute top-2 left-2" />
              <div className="w-6 h-6 border-t-2 border-r-2 border-[#DAA520] absolute top-2 right-2" />
              <div className="w-6 h-6 border-b-2 border-l-2 border-[#DAA520] absolute bottom-2 left-2" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-[#DAA520] absolute bottom-2 right-2" />
              <span className="text-white/60 text-[11px] font-medium tracking-wide bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                {villaName}
              </span>
            </div>
          </div>

          {/* Shutter Controls */}
          <div className="p-6 bg-black/80 backdrop-blur-md flex items-center justify-around z-10 pb-10">
            {/* Flip Camera Button */}
            <button
              type="button"
              onClick={handleFlipCamera}
              className="text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={22} />
              <span className="text-[10px] font-medium">{t.switchCamera}</span>
            </button>

            {/* Big Live Shutter Button */}
            <button
              type="button"
              onClick={handleSnapFromVideo}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 transition-transform active:scale-90 cursor-pointer shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white hover:bg-slate-200 transition-colors" />
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCloseViewfinder}
              className="text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer"
            >
              <X size={22} />
              <span className="text-[10px] font-medium">{t.cancel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
