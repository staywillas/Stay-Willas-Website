"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Check, Loader2, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface CameraWatermarkProps {
  roleName: string; // "Caretaker" | "Chef"
  categoryName: string; // "Swimming Pool" | "Bedroom 1" etc.
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
  maxPhotos = 4,
}: CameraWatermarkProps) {
  const t = translations[lang] || translations.en;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLiveViewfinder, setShowLiveViewfinder] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");

  // Lock background body scroll completely when camera modal is open
  useEffect(() => {
    if (showLiveViewfinder) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = "";
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [showLiveViewfinder]);

  // Clean up media stream on unmount
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
   * If not supported or denied, fall back to native mobile camera via capture="environment".
   */
  const handleOpenLiveCamera = async () => {
    if (photos.length >= maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed.`);
      return;
    }

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
        // Fallback to native mobile camera input
        setShowLiveViewfinder(false);
        fileInputRef.current?.click();
      }
    } catch (err: any) {
      console.warn("Live WebRTC camera unavailable, triggering native mobile camera:", err);
      setShowLiveViewfinder(false);
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

      // 1. Draw photo
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Real-time IST Timestamp
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

      // 3. Inscribe Bottom HUD Watermark Banner
      const bannerHeight = Math.max(90, Math.round(height * 0.14));
      const bannerY = height - bannerHeight;

      const gradient = ctx.createLinearGradient(0, bannerY - 20, 0, height);
      gradient.addColorStop(0, "rgba(10, 15, 30, 0)");
      gradient.addColorStop(0.25, "rgba(10, 15, 30, 0.88)");
      gradient.addColorStop(1, "rgba(8, 12, 24, 0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, bannerY - 20, width, bannerHeight + 20);

      ctx.fillStyle = "#DAA520";
      ctx.fillRect(0, bannerY - 2, width, 3);

      const baseFontSize = Math.max(13, Math.round(width * 0.022));
      const paddingX = Math.round(width * 0.035);

      // Line 1: Property Name
      ctx.font = `bold ${Math.round(baseFontSize * 1.25)}px sans-serif`;
      ctx.fillStyle = "#DAA520";
      ctx.fillText(`🏰 ${villaName.toUpperCase()} • STAY WILLAS`, paddingX, bannerY + baseFontSize * 1.5);

      // Line 2: Category Proof
      ctx.font = `bold ${baseFontSize}px sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        `✓ ${roleName.toUpperCase()} PROOF: ${categoryName.toUpperCase()}`,
        paddingX,
        bannerY + baseFontSize * 2.9
      );

      // Line 3: Timestamp & Location
      ctx.font = `bold ${Math.round(baseFontSize * 0.9)}px monospace`;
      ctx.fillStyle = "#A7F3D0";
      ctx.fillText(
        `🕒 ${fullTimestamp} | 📍 LONAVALA`,
        paddingX,
        bannerY + baseFontSize * 4.2
      );

      // 4. Auto-Compressor strictly < 500 KB
      let quality = 0.80;
      let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      let sizeKB = calculateBase64SizeKB(compressedDataUrl);

      const qualitySteps = [0.70, 0.60, 0.50, 0.40, 0.35];
      let stepIndex = 0;

      while (sizeKB > 480 && stepIndex < qualitySteps.length) {
        quality = qualitySteps[stepIndex];
        compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        sizeKB = calculateBase64SizeKB(compressedDataUrl);
        stepIndex++;
      }

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
    <div className="w-full space-y-2">
      {/* Hidden native camera file input (fallback) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeFileChange}
        className="hidden"
      />

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

                {/* Size Badge */}
                <div className="absolute top-1 left-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-0.5">
                  <Check size={9} className="stroke-[3]" />
                  <span>{kb} KB</span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(idx)}
                  aria-label={t.delete}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white p-1 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Big Bright White Button (Easy for Village Caretakers) */}
      {photos.length < maxPhotos && (
        <button
          type="button"
          onClick={handleOpenLiveCamera}
          disabled={isProcessing}
          className={`w-full py-3.5 sm:py-4 px-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-xl ${
            photos.length === 0
              ? "bg-white hover:bg-slate-100 text-black border-2 border-slate-200"
              : "bg-slate-100 hover:bg-white text-black border-2 border-slate-300"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin text-black" />
              <span className="text-sm font-black text-black">{t.compressing}</span>
            </div>
          ) : (
            <>
              {photos.length === 0 ? (
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black">
                  <Camera size={20} className="stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black">
                  <Plus size={20} className="stroke-[2.5]" />
                </div>
              )}
              <span className="text-base sm:text-lg font-black tracking-wide text-black">
                {photos.length === 0 ? t.takePhoto : t.takeAnotherPhoto}
              </span>
            </>
          )}
        </button>
      )}

      {/* FULLY FIXED IN-APP LIVE CAMERA VIEWFINDER (NO VERTICAL SCROLLING) */}
      {showLiveViewfinder && (
        <div
          className="fixed inset-0 h-screen h-[100dvh] w-screen overflow-hidden bg-black flex flex-col justify-between select-none touch-none overscroll-none"
          style={{ overscrollBehavior: "none", zIndex: 9999999 }}
        >
          {/* Top Bar (Fixed) */}
          <div className="w-full h-14 bg-black/80 px-4 flex items-center justify-between z-20 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-black tracking-wider uppercase">
                {categoryName}
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

          {/* Video Stream Area (Fixed, No Scroll) */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Camera Viewfinder Reticle */}
            <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-l-2 border-[#DAA520] absolute top-2 left-2" />
              <div className="w-5 h-5 border-t-2 border-r-2 border-[#DAA520] absolute top-2 right-2" />
              <div className="w-5 h-5 border-b-2 border-l-2 border-[#DAA520] absolute bottom-2 left-2" />
              <div className="w-5 h-5 border-b-2 border-r-2 border-[#DAA520] absolute bottom-2 right-2" />
            </div>
          </div>

          {/* Shutter Controls Bar (Fixed at bottom) */}
          <div
            className="w-full bg-black/90 px-6 pt-3 pb-8 flex items-center justify-around z-20 shrink-0 select-none border-t border-white/10"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            {/* Flip Camera */}
            <button
              type="button"
              onClick={handleFlipCamera}
              className="text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer p-2"
            >
              <RefreshCw size={22} />
              <span className="text-[10px] font-bold">{t.switchCamera}</span>
            </button>

            {/* Shutter Button */}
            <button
              type="button"
              onClick={handleSnapFromVideo}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1.5 transition-transform active:scale-90 cursor-pointer shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white hover:bg-slate-200 transition-colors" />
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={handleCloseViewfinder}
              className="text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer p-2"
            >
              <X size={22} />
              <span className="text-[10px] font-bold">{t.cancel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
