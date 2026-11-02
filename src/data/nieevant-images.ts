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
  bedroomOne: {
    src: `${base}nieevant-bedroom-one.webp`,
    alt: "A bedroom at Nieevant with a double bed beside a large hillside window",
    caption: "A comfortable bedroom with hillside views",
  },
  bedroomTwo: {
    src: `${base}nieevant-bedroom-two.webp`,
    alt: "A bedroom at Nieevant with a double bed, window and seating",
    caption: "A quiet room for restful nights",
  },
  bedroomThree: {
    src: `${base}nieevant-bedroom-three.webp`,
    alt: "A bedroom at Nieevant with a double bed and wardrobe",
    caption: "Thoughtful spaces to settle in",
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
} satisfies Record<string, NieevantPhoto>;

export const nieevantGallery: NieevantPhoto[] = Object.values(nieevantPhotos);
