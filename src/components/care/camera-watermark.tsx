"use client";

import React, { useRef, useState } from "react";
import { Camera, Check, RotateCcw, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";

interface CameraWatermarkProps {
  roleName: string; // "Caretaker" | "Chef"
  categoryName: string; // "Swimming Pool" | "Lunch Spread" etc.
  villaName?: string;
  onPhotoCaptured: (watermarkedBase64: string) => void;
  buttonLabel?: string;
  existingPhoto?: string | null;
}

export default function CameraWatermark({
  roleName,
  categoryName,
  villaName = "The Angle House, Lonavala",
  onPhotoCaptured,
  buttonLabel = "Take Live Photo",
  existingPhoto = null,
}: CameraWatermarkProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(existingPhoto);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const rawBase64 = reader.result as string;
        applyWatermark(rawBase64);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Camera capture failed:", err);
      setIsProcessing(false);
    }
  };

  const applyWatermark = (dataUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate responsive canvas dimensions (max width 1600px)
      const maxDim = 1600;
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
        setPreviewImage(dataUrl);
        onPhotoCaptured(dataUrl);
        setIsProcessing(false);
        return;
      }

      // 1. Draw original photo
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Generate Real-time IST Timestamp
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

      // 3. Draw Watermark Banner at the bottom
      const bannerHeight = Math.max(120, Math.round(height * 0.14));
      const bannerY = height - bannerHeight;

      // Dark gradient overlay
      const gradient = ctx.createLinearGradient(0, bannerY - 30, 0, height);
      gradient.addColorStop(0, "rgba(10, 15, 30, 0)");
      gradient.addColorStop(0.25, "rgba(10, 15, 30, 0.85)");
      gradient.addColorStop(1, "rgba(10, 15, 30, 0.96)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, bannerY - 30, width, bannerHeight + 30);

      // Golden accent line
      ctx.fillStyle = "#DAA520";
      ctx.fillRect(0, bannerY - 2, width, 4);

      // Base scale based on width
      const baseFontSize = Math.max(14, Math.round(width * 0.022));
      const paddingX = Math.round(width * 0.035);

      // Line 1: Property Name & Brand Badge
      ctx.font = `bold ${Math.round(baseFontSize * 1.2)}px sans-serif`;
      ctx.fillStyle = "#DAA520";
      ctx.fillText(`🏰 ${villaName.toUpperCase()} • STAY WILLAS`, paddingX, bannerY + baseFontSize * 1.5);

      // Line 2: Category & Role Proof
      ctx.font = `bold ${baseFontSize}px sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        `✓ ${roleName.toUpperCase()} PROOF: ${categoryName.toUpperCase()} READINESS`,
        paddingX,
        bannerY + baseFontSize * 3
      );

      // Line 3: Timestamp & Location Stamp
      ctx.font = `bold ${Math.round(baseFontSize * 0.9)}px monospace`;
      ctx.fillStyle = "#A7F3D0"; // Emerald/mint for verified timestamp
      ctx.fillText(
        `🕒 TIMESTAMP: ${fullTimestamp} | 📍 KAMSHET, LONAVALA`,
        paddingX,
        bannerY + baseFontSize * 4.3
      );

      // Convert to compressed high-quality JPEG
      const watermarkedBase64 = canvas.toDataURL("image/jpeg", 0.85);
      setPreviewImage(watermarkedBase64);
      onPhotoCaptured(watermarkedBase64);
      setIsProcessing(false);
    };

    img.onerror = () => {
      setIsProcessing(false);
      alert("Failed to load image for watermarking. Please try again.");
    };

    img.src = dataUrl;
  };

  const handleRetake = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Hidden native camera file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Forces rear camera on mobile devices
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewImage ? (
        <button
          type="button"
          onClick={handleCaptureClick}
          disabled={isProcessing}
          className="w-full bg-[#1B3564] hover:bg-[#152A50] border-2 border-dashed border-[#DAA520]/50 hover:border-[#DAA520] text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 size={24} className="animate-spin text-[#DAA520]" />
              <span className="text-xs font-bold text-[#DAA520]">Burning live timestamp...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#DAA520]/20 flex items-center justify-center text-[#DAA520]">
                <Camera size={22} className="stroke-[2.5]" />
              </div>
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  {buttonLabel}
                </span>
                <span className="text-[10px] text-slate-300 font-medium block mt-0.5">
                  Opens camera • Burns live date & time
                </span>
              </div>
            </>
          )}
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Timestamped Proof"
            className="w-full h-48 sm:h-56 object-cover"
          />

          {/* Verification Badge */}
          <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Check size={12} className="stroke-[3]" />
            <span>Timestamp Burned</span>
          </div>

          {/* Retake Button */}
          <button
            type="button"
            onClick={handleRetake}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md transition-all cursor-pointer shadow-md"
          >
            <RotateCcw size={11} />
            <span>Retake</span>
          </button>
        </div>
      )}
    </div>
  );
}
