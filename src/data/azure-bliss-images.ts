
export type AzureBlissPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const base = "/assets/villas/azure-bliss/";

export const azureBlissPhotos = {
  hero: {
    src: `${base}IMG_8887.webp`,
    alt: "Azure Bliss private villa in Igatpuri",
    caption: "A private retreat in the mountains",
  },
  photoOne: {
    src: `${base}IMG_8880.webp`,
    alt: "Azure Bliss villa and property",
    caption: "Discover Azure Bliss",
  },
  photoTwo: {
    src: `${base}IMG_8881.webp`,
    alt: "A view of Azure Bliss",
    caption: "A peaceful mountain getaway",
  },
  photoThree: {
    src: `${base}IMG_8886.webp`,
    alt: "Azure Bliss property surroundings",
    caption: "Space to unwind",
  },
  photoFour: {
    src: `${base}IMG_8888.webp`,
    alt: "Azure Bliss villa",
    caption: "Comfort in a private setting",
  },
  photoFive: {
    src: `${base}IMG_8902.webp`,
    alt: "Azure Bliss swimming pool",
    caption: "Enjoy your private swimming pool",
  },
  photoSix: {
    src: `${base}IMG_8910.webp`,
    alt: "Azure Bliss outdoor space",
    caption: "Room to relax outdoors",
  },
  photoSeven: {
    src: `${base}IMG_8912.webp`,
    alt: "Azure Bliss gazebo",
    caption: "Relax in the gazebo",
  },
  photoEight: {
    src: `${base}IMG_8913.webp`,
    alt: "Mountain views at Azure Bliss",
    caption: "Mountain views all around",
  },
  photoNine: {
    src: `${base}IMG_8918.webp`,
    alt: "Azure Bliss outdoor relaxation area",
    caption: "Make the most of your getaway",
  },
} satisfies Record<string, AzureBlissPhoto>;

export const azureBlissGallery: AzureBlissPhoto[] =
  Object.values(azureBlissPhotos);
