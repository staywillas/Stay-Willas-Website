export type NieevantPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const base = "/assets/villas/nieevant-by-stay-willas/";

export const nieevantPhotos = {
  hero: {
    src: `${base}nieevant-1.webp`,
    alt: "Aerial view of Nieevant by Stay Willas, its pool and the Khopoli hills",
    caption: "Nieevant and the surrounding hills",
  },
  hillside: {
    src: `${base}nieevant-2.webp`,
    alt: "Nieevant by Stay Willas on its green hilltop in Khopoli",
    caption: "The villa from the hillside",
  },
  grounds: {
    src: `${base}nieevant-3.webp`,
    alt: "Overhead view of Nieevant by Stay Willas and the surrounding grounds",
    caption: "Aerial view of the grounds",
  },
} satisfies Record<string, NieevantPhoto>;

export const nieevantGallery: NieevantPhoto[] = Object.values(nieevantPhotos);
