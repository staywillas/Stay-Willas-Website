"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Images } from "lucide-react";
import Image from "@/components/ui/site-image";
import styles from "./property-editorial.module.css";
import type { PropertyPhoto } from "@/data/property-editorial";

const GalleryViewer = dynamic(() => import("./property-gallery-viewer"), {
  ssr: false,
  loading: () => (
    <p role="status" className={styles.galleryLoading}>
      Opening the photo gallery…
    </p>
  ),
});

export default function PropertyEditorialGallery({
  images,
  featured,
  propertyName,
}: {
  images: string[];
  featured: PropertyPhoto[];
  propertyName: string;
}) {
  const [viewer, setViewer] = useState<{
    view: "grid" | "lightbox";
    index: number;
  } | null>(null);
  const galleryImages = Array.from(
    new Set([...images, ...featured.map((photo) => photo.src)]),
  );

  return (
    <div className={styles.gallery} id="photos">
      <div className={styles.galleryGrid}>
        {featured.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            className={index === 0 ? styles.galleryMain : styles.gallerySide}
            aria-label={`Open photo: ${photo.alt}`}
            onClick={() =>
              setViewer({
                view: "lightbox",
                index: galleryImages.indexOf(photo.src),
              })
            }
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              quality={80}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes={
                index === 0
                  ? "(max-width: 700px) 92vw, (max-width: 1400px) 58vw, 780px"
                  : "(max-width: 700px) 46vw, (max-width: 1400px) 29vw, 390px"
              }
              className={styles.cover}
            />
            <span className={styles.photoAction} aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.allPhotos}
        onClick={() => setViewer({ view: "grid", index: 0 })}
      >
        <Images size={16} /> All {galleryImages.length} photos
      </button>
      {viewer && (
        <GalleryViewer
          images={galleryImages}
          propertyName={propertyName}
          initialView={viewer.view}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
