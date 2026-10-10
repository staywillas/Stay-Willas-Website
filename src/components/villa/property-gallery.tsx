"use client";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Grid } from "lucide-react";
import ShareButton from "@/components/villa/share-button";
import SaveButton from "@/components/villa/save-button";
const GalleryViewer = dynamic(() => import("./property-gallery-viewer"), {
  ssr: false,
  loading: () => <p role="status" className="fixed bottom-24 inset-x-4 z-[210000] rounded-xl bg-black/90 p-4 text-center text-white">Loading photos…</p>,
});
interface PropertyGalleryProps { images: string[]; propertyName: string; villaId: string; }
export default function PropertyGallery({ images, propertyName, villaId }: PropertyGalleryProps) {
  const [viewer, setViewer] = useState<{ view: "grid" | "lightbox"; index: number } | null>(null);
  const visibleImages = [...images];
  while (visibleImages.length < 5) visibleImages.push(images[0] || "/images/hero-villa.webp");
  const openLightbox = (index: number) => setViewer({ view: "lightbox", index });
  const openGridOverlay = () => setViewer({ view: "grid", index: 0 });
  return (<>
      {/* One responsive gallery avoids fetching separate mobile and desktop heroes. */}
      <div className="relative w-full mb-4 md:mb-16 overflow-hidden rounded-2xl md:rounded-3xl aspect-[16/11] md:aspect-[21/9] border border-white/10 shadow-xl">
        <div className="flex md:grid md:grid-cols-4 md:grid-rows-2 md:gap-3 h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {visibleImages.slice(0, 5).map((img, idx) => (
            <button key={idx} type="button" aria-label={`Open photo ${idx + 1} of ${propertyName}`}
              onClick={() => openLightbox(Math.min(idx, Math.max(images.length - 1, 0)))}
              className={`relative h-full w-full md:w-auto flex-shrink-0 snap-start overflow-hidden bg-charcoal group ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
              <Image src={img} alt={`${propertyName} photo ${idx + 1}`} fill
                loading={idx === 0 ? "eager" : "lazy"} fetchPriority={idx === 0 ? "high" : "auto"} quality={75}
                sizes={idx === 0 ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px" : "(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 320px"}
                className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="md:hidden absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-full text-xs text-white">{idx + 1} / 5</span>
            </button>
          ))}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <ShareButton minimal /><SaveButton villaId={villaId} villaName={propertyName} minimal />
        </div>
        <button type="button" onClick={openGridOverlay} className="absolute bottom-3 left-3 md:left-auto md:right-6 md:bottom-6 min-h-11 bg-black/80 hover:bg-black/95 text-white border border-white/15 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-md">
          <Grid size={15} className="text-[#FFCC00]" /> View all {images.length} photos
        </button>
      </div>


    {viewer && <GalleryViewer images={images.length ? images : visibleImages} propertyName={propertyName}
      initialView={viewer.view} initialIndex={viewer.index} onClose={() => setViewer(null)} />}
  </>);
}
