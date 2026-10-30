export type CanopyCrestPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const base = "/assets/villas/canopy-crest/refresh/";

export const canopyCrestPhotos = {
  hero: {
    src: `${base}drone-villa-pool.webp`,
    alt: "Aerial view of Canopy Crest villa, private pool and surrounding hills",
    caption: "Canopy Crest from above",
  },
  poolAerial: {
    src: `${base}drone-pool-side.webp`,
    alt: "Canopy Crest private pool beside the villa, seen from above",
    caption: "Private pool and villa",
  },
  overhead: {
    src: `${base}drone-overhead-estate.webp`,
    alt: "Overhead view of Canopy Crest villa, lawn and swimming pool",
    caption: "The villa and its grounds",
  },
  exterior: {
    src: `${base}villa-front.webp`,
    alt: "Front of Canopy Crest villa with its garden and private pool in Khopoli",
    caption: "Villa frontage",
  },
  poolDay: {
    src: `${base}pool-and-lawn-day.webp`,
    alt: "Canopy Crest swimming pool with garden seating and lawn",
    caption: "Pool and lawn",
  },
  lawnEvening: {
    src: `${base}lawn-seating-evening.webp`,
    alt: "Outdoor seating on the Canopy Crest lawn in the evening",
    caption: "Evening on the lawn",
  },
  livingDining: {
    src: `${base}living-dining-room.webp`,
    alt: "Canopy Crest living and dining area with seating for a group",
    caption: "Living and dining",
  },
  bedroom: {
    src: `${base}bedroom.webp`,
    alt: "Canopy Crest bedroom with large windows looking onto the garden",
    caption: "A bright bedroom",
  },
  bathroom: {
    src: `${base}bathroom.webp`,
    alt: "Canopy Crest bathroom with a glass shower and bathtub",
    caption: "Bathroom",
  },
  kitchen: {
    src: `${base}kitchen.webp`,
    alt: "Canopy Crest kitchen with counter space and built-in cabinets",
    caption: "Kitchen",
  },
  gazebo: {
    src: `${base}gazebo-games.webp`,
    alt: "Open-sided Canopy Crest gazebo with outdoor seating and games",
    caption: "Gazebo and games",
  },
  valley: {
    src: `${base}drone-valley-villa.webp`,
    alt: "Canopy Crest villa in a green valley surrounded by the Sahyadri hills",
    caption: "A green valley setting",
  },
} satisfies Record<string, CanopyCrestPhoto>;

export const canopyCrestGallery: CanopyCrestPhoto[] = Object.values(canopyCrestPhotos);
