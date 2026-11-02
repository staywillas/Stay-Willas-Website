export type NieevantPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const base = "/assets/villas/nieevant-by-stay-willas/";

export const nieevantPhotos = {
  hero: {
    src: `${base}nieevant-hero.webp`,
    alt: "Drone view of Nieevant by Stay Willas on its Khopoli hillside",
    caption: "A hilltop home above the valley",
  },
  hillside: {
    src: `${base}nieevant-hillside.webp`,
    alt: "Nieevant and its open grounds framed by the surrounding hills",
    caption: "Open views across the hills",
  },
  grounds: {
    src: `${base}nieevant-grounds.webp`,
    alt: "Elevated view of the Nieevant villa and its outdoor grounds",
    caption: "The villa and its grounds",
  },
  sunset: {
    src: `${base}nieevant-sunset.webp`,
    alt: "Nieevant by Stay Willas and the hillside at sunset",
    caption: "Evening light over the villa",
  },
  villaView: {
    src: `${base}nieevant-villa-view.webp`,
    alt: "A wider drone view of Nieevant surrounded by wooded hills",
    caption: "A home among the hills",
  },
  valley: {
    src: `${base}nieevant-valley.webp`,
    alt: "The Khopoli valley and open landscape around Nieevant",
    caption: "The valley around Nieevant",
  },
  estate: {
    src: `${base}nieevant-estate.webp`,
    alt: "Aerial view of Nieevant and the surrounding estate",
    caption: "A little room to breathe",
  },
  close: {
    src: `${base}nieevant-close.webp`,
    alt: "Closer aerial view of the Nieevant villa and its upper level",
    caption: "A closer look at the villa",
  },
} satisfies Record<string, NieevantPhoto>;

export const nieevantGallery: NieevantPhoto[] = Object.values(nieevantPhotos);
