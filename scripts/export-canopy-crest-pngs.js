const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseOutDir = path.join(__dirname, '..', 'Canopy_Crest_PNG_Images');
const dirs = {
  original: path.join(baseOutDir, '01_Original_HighRes_PNG'),
  landscape: path.join(baseOutDir, '02_Google_Ads_Landscape_1200x628'),
  square: path.join(baseOutDir, '03_Google_Ads_Square_1200x1200'),
  portrait: path.join(baseOutDir, '04_Social_Portrait_1080x1350')
};

Object.values(dirs).forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const items = [
  {
    name: '01_Canopy_Crest_Exterior_Estate',
    src: 'StayWillas_Unsplash_HQ_Images/Canopy_Crest/01_Canopy_Crest_Exterior_Estate_Elevation.jpg'
  },
  {
    name: '02_Canopy_Crest_22ft_Private_Pool',
    src: 'StayWillas_Unsplash_HQ_Images/Canopy_Crest/02_Canopy_Crest_22ft_Private_Swimming_Pool.jpg'
  },
  {
    name: '03_Canopy_Crest_Expansive_Green_Lawn',
    src: 'StayWillas_Unsplash_HQ_Images/Canopy_Crest/03_Canopy_Crest_Expansive_Green_Lawn.jpg'
  },
  {
    name: '04_Canopy_Crest_Spacious_Living_Hall',
    src: 'StayWillas_Unsplash_HQ_Images/Canopy_Crest/04_Canopy_Crest_Spacious_Living_Hall.jpg'
  },
  {
    name: '05_Canopy_Crest_Master_Bedroom_Suite',
    src: 'StayWillas_Unsplash_HQ_Images/Canopy_Crest/05_Canopy_Crest_Master_Bedroom_Suite.jpg'
  },
  {
    name: '06_Canopy_Crest_Pool_Dusk_View',
    src: 'public/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg'
  },
  {
    name: '07_Canopy_Crest_Private_Lawn_Seating',
    src: 'public/assets/villas/canopy-crest/IMG-20260607-WA0015.jpg'
  },
  {
    name: '08_Canopy_Crest_Group_Dining_Table',
    src: 'public/assets/villas/canopy-crest/IMG-20260607-WA0014.jpg'
  },
  {
    name: '09_Canopy_Crest_Living_Room_Lounge',
    src: 'public/assets/villas/canopy-crest/IMG-20260607-WA0013.jpg'
  },
  {
    name: '10_Canopy_Crest_Pool_Facing_Bedroom',
    src: 'public/assets/villas/canopy-crest/IMG-20260607-WA0009.jpg'
  },
  {
    name: '11_Canopy_Crest_Sunset_With_Guests',
    src: 'public/assets/villas/canopy-crest/canopy-crest-sunset-guests.jpg'
  }
];

async function run() {
  console.log('Generating Canopy Crest PNG images in variations...');

  for (const item of items) {
    const srcPath = path.join(__dirname, '..', item.src);
    if (!fs.existsSync(srcPath)) {
      console.log('Skipping missing file:', srcPath);
      continue;
    }

    console.log(`Processing: ${item.name}`);

    // 1. High-Res PNG (original aspect, max crispness)
    await sharp(srcPath)
      .png({ quality: 100, compressionLevel: 8 })
      .toFile(path.join(dirs.original, `${item.name}.png`));

    // 2. Google Ads Landscape (1200x628 - 1.91:1)
    await sharp(srcPath)
      .resize(1200, 628, { fit: 'cover', position: 'center' })
      .png({ quality: 95 })
      .toFile(path.join(dirs.landscape, `${item.name}_1200x628.png`));

    // 3. Google Ads Square (1200x1200 - 1:1)
    await sharp(srcPath)
      .resize(1200, 1200, { fit: 'cover', position: 'center' })
      .png({ quality: 95 })
      .toFile(path.join(dirs.square, `${item.name}_1200x1200.png`));

    // 4. Social Portrait (1080x1350 - 4:5)
    await sharp(srcPath)
      .resize(1080, 1350, { fit: 'cover', position: 'center' })
      .png({ quality: 95 })
      .toFile(path.join(dirs.portrait, `${item.name}_1080x1350.png`));
  }

  console.log('Successfully generated all Canopy Crest PNG variations!');
}

run().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
