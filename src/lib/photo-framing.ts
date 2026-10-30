import { resolvePropertyImage } from "./property-images";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";

// Crop positions were reviewed against the villa, pool, room or people in each photo.
const positions: Record<string, string> = {
  "/images/angle-house-hero-clean.webp": "50% 54%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg": "50% 65%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0008.jpg": "52% 58%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0009.jpg": "60% 60%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0010.jpg": "50% 64%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0012.jpg": "55% 65%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0013.jpg": "50% 63%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0014.jpg": "50% 62%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0015.jpg": "58% 60%",
  "/assets/villas/canopy-crest/IMG-20260607-WA0018.jpg": "62% 64%",
  "/assets/villas/canopy-crest/canopy-crest-sunset-guests.jpg": "62% 54%",
  [canopyCrestPhotos.hero.src]: "50% 54%",
  [canopyCrestPhotos.valley.src]: "50% 58%",
  [canopyCrestPhotos.poolAerial.src]: "50% 55%",
  [canopyCrestPhotos.overhead.src]: "50% 54%",
  [canopyCrestPhotos.exterior.src]: "50% 55%",
  [canopyCrestPhotos.poolDay.src]: "50% 58%",
  [canopyCrestPhotos.lawnEvening.src]: "50% 55%",
  [canopyCrestPhotos.livingDining.src]: "50% 56%",
  [canopyCrestPhotos.bedroom.src]: "50% 52%",
  [canopyCrestPhotos.bathroom.src]: "50% 55%",
  [canopyCrestPhotos.kitchen.src]: "50% 54%",
  [canopyCrestPhotos.gazebo.src]: "50% 54%",
  "/assets/villas/the-angle-house/angle-house-pool-balcony-guests.jpg": "55% 52%",
  "/assets/villas/the-angle-house/gallery-1.webp": "55% 57%",
  "/assets/villas/the-angle-house/gallery-3.webp": "50% 57%",
  "/assets/villas/the-angle-house/gallery-4.webp": "50% 54%",
  "/assets/villas/the-angle-house/gallery-5.webp": "62% 58%",
  "/assets/villas/the-angle-house/gallery-8.webp": "58% 62%",
  "/assets/villas/the-angle-house/gallery-10.webp": "55% 55%",
  "/assets/villas/the-angle-house/gallery-11.webp": "50% 54%",
  "/assets/villas/the-angle-house/gallery-12.webp": "50% 58%",
  "/assets/villas/the-angle-house/gallery-16.webp": "50% 58%",
  "/assets/villas/the-angle-house/gallery-18.webp": "55% 54%",
  "/assets/villas/willow-peak/graded-v1/wp-01.webp": "62% 55%",
  "/assets/villas/willow-peak/graded-v1/wp-02.webp": "50% 43%",
  "/assets/villas/willow-peak/graded-v1/wp-05.webp": "58% 65%",
  "/assets/villas/willow-peak/graded-v1/wp-06.webp": "50% 75%",
  "/assets/villas/willow-peak/graded-v1/wp-08.webp": "50% 65%",
  "/assets/villas/willow-peak/graded-v1/wp-09.webp": "50% 61%",
  "/assets/villas/willow-peak/graded-v1/wp-10.webp": "60% 72%",
  "/assets/villas/willow-peak/graded-v1/wp-03.webp": "64% 66%",
  "/assets/villas/willow-peak/graded-v1/wp-04.webp": "40% 62%",
  "/assets/villas/willow-peak/graded-v1/wp-07.webp": "65% 45%",
  "/assets/villas/willow-peak/graded-v1/chalets-night.webp": "50% 56%",
  "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg": "60% 56%",
  "/assets/villas/terra-cotta-villa/IMG-20260901-WA0031.jpg": "50% 61%",
  "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg": "50% 55%",
};

function photoPath(source: string): string {
  let path = resolvePropertyImage(source);
  if (/^https?:/.test(path)) {
    try { path = new URL(path).pathname; } catch { return path; }
  }
  return decodeURIComponent(path.split(/[?#]/)[0]).replace("/Canopy crest photos/", "/canopy-crest/");
}

export function getPhotoFocus(source: string): string {
  return positions[photoPath(source)] || "50% 50%";
}

// Taller article covers keep a portrait room's main feature in view.
export function getArticlePhotoRatio(source: string): string {
  const path = photoPath(source);
  if (/willow-peak\/graded-v1\/wp-/.test(path) || /the-angle-house\/gallery-(1|3|5|8)\.webp$/.test(path)) return "1 / 1";
  if (path.includes("/canopy-crest/IMG-")) return "4 / 3";
  return "3 / 2";
}
