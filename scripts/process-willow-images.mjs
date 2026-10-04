import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const SOURCE_DIR = path.join(process.cwd(), 'public', 'assets', 'villas', 'WILLOW PEAK IMAGES');
const TARGET_DIR = path.join(process.cwd(), 'public', 'assets', 'villas', 'willow-peak');
const OLD_SPACE_DIR = path.join(process.cwd(), 'public', 'assets', 'villas', 'willow peak');

const imageMapping = [
  { src: 'Untitled design - 1.png', dest: 'gallery-1.webp', title: 'Cottage Front & Private Sit-out' },
  { src: 'Untitled design - 2.png', dest: 'gallery-2.webp', title: 'Estate Panoramic View of 3 Chalets' },
  { src: 'Untitled design - 4.png', dest: 'gallery-3.webp', title: 'Private In-Room Jacuzzi' },
  { src: 'Untitled design - 11.png', dest: 'gallery-4.webp', title: 'Master Bedroom Suite Wide Angle' },
  { src: 'Untitled design - 13.png', dest: 'gallery-5.webp', title: 'A-Frame Ambient Bedroom' },
  { src: 'Untitled design - 3.png', dest: 'gallery-6.webp', title: 'King Bed with Timber Ceiling' },
  { src: 'Untitled design - 7.png', dest: 'gallery-7.webp', title: 'Architectural Chalet Perspective' },
  { src: 'Untitled design - 22.png', dest: 'gallery-8.webp', title: 'Gazebo & Carrom Games Deck' },
  { src: 'Untitled design - 5.png', dest: 'gallery-9.webp', title: 'Covered Outdoor Dining Pavillion' },
  { src: 'Untitled design - 17.png', dest: 'gallery-10.webp', title: 'Modern Attached Bathroom' },
];

async function main() {
  console.log('--- 1. DELETING OLD IMAGES IN TARGET DIR ---');
  if (fs.existsSync(TARGET_DIR)) {
    const existing = fs.readdirSync(TARGET_DIR);
    for (const file of existing) {
      fs.unlinkSync(path.join(TARGET_DIR, file));
      console.log(`Deleted old: ${file}`);
    }
  } else {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('\n--- 2. DELETING OLD "willow peak" DIRECTORY (WITH SPACE) ---');
  if (fs.existsSync(OLD_SPACE_DIR)) {
    fs.rmSync(OLD_SPACE_DIR, { recursive: true, force: true });
    console.log(`Deleted folder: ${OLD_SPACE_DIR}`);
  }

  console.log('\n--- 3. DELETING OLD ARCHIVE FOLDERS ---');
  const hqDirs = [
    path.join(process.cwd(), 'StayWillas_Luxury_Villas_HQ_Images', 'Willow_Peak'),
    path.join(process.cwd(), 'StayWillas_Luxury_Villas_HQ_JPEG_Images', 'Willow_Peak'),
    path.join(process.cwd(), 'StayWillas_Unsplash_HQ_Images', 'Willow_Peak'),
  ];
  for (const dir of hqDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`Deleted archive folder: ${dir}`);
    }
  }

  console.log('\n--- 4. COMPRESSING NEW IMAGES TO WEBP ---');
  for (const item of imageMapping) {
    const srcPath = path.join(SOURCE_DIR, item.src);
    const destPath = path.join(TARGET_DIR, item.dest);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source file missing: ${srcPath}`);
    }

    const srcStat = fs.statSync(srcPath);
    await sharp(srcPath)
      .webp({ quality: 82, effort: 6 })
      .toFile(destPath);

    const destStat = fs.statSync(destPath);
    const savings = ((1 - destStat.size / srcStat.size) * 100).toFixed(1);
    console.log(`Compressed: ${item.src} -> ${item.dest} (${(destStat.size / 1024).toFixed(1)} KB, saved ${savings}%)`);
  }

  // Also create main.webp as copy of gallery-1.webp
  fs.copyFileSync(path.join(TARGET_DIR, 'gallery-1.webp'), path.join(TARGET_DIR, 'main.webp'));
  console.log('Created main.webp from gallery-1.webp');

  console.log('\n--- 5. UPDATING DATABASE WITH NEW IMAGES ---');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const estateImages = [
    '/assets/villas/willow-peak/gallery-1.webp',
    '/assets/villas/willow-peak/gallery-2.webp',
    '/assets/villas/willow-peak/gallery-3.webp',
    '/assets/villas/willow-peak/gallery-4.webp',
    '/assets/villas/willow-peak/gallery-5.webp',
    '/assets/villas/willow-peak/gallery-6.webp',
    '/assets/villas/willow-peak/gallery-7.webp',
    '/assets/villas/willow-peak/gallery-8.webp',
    '/assets/villas/willow-peak/gallery-9.webp',
    '/assets/villas/willow-peak/gallery-10.webp',
    '/assets/villas/willow-peak/main.webp'
  ];

  const cottageAImages = [
    '/assets/villas/willow-peak/gallery-1.webp',
    '/assets/villas/willow-peak/gallery-3.webp',
    '/assets/villas/willow-peak/gallery-4.webp',
    '/assets/villas/willow-peak/gallery-6.webp',
    '/assets/villas/willow-peak/gallery-8.webp',
    '/assets/villas/willow-peak/gallery-10.webp',
    '/assets/villas/willow-peak/main.webp'
  ];

  const cottageBImages = [
    '/assets/villas/willow-peak/gallery-2.webp',
    '/assets/villas/willow-peak/gallery-3.webp',
    '/assets/villas/willow-peak/gallery-5.webp',
    '/assets/villas/willow-peak/gallery-7.webp',
    '/assets/villas/willow-peak/gallery-9.webp',
    '/assets/villas/willow-peak/gallery-10.webp',
    '/assets/villas/willow-peak/main.webp'
  ];

  const cottageCImages = [
    '/assets/villas/willow-peak/gallery-7.webp',
    '/assets/villas/willow-peak/gallery-3.webp',
    '/assets/villas/willow-peak/gallery-4.webp',
    '/assets/villas/willow-peak/gallery-5.webp',
    '/assets/villas/willow-peak/gallery-8.webp',
    '/assets/villas/willow-peak/gallery-10.webp',
    '/assets/villas/willow-peak/main.webp'
  ];

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    estateImages, 'willow-peak', 'lonavala-willow-peak'
  ]);
  console.log('Updated Willow Peak (Entire Estate) images in DB');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    cottageAImages, 'willow-peak-cottage-a', 'lonavala-willow-peak-cottage-a'
  ]);
  console.log('Updated Breeze (Cottage A) images in DB');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    cottageBImages, 'willow-peak-cottage-b', 'lonavala-willow-peak-cottage-b'
  ]);
  console.log('Updated Crest (Cottage B) images in DB');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    cottageCImages, 'willow-peak-cottage-c', 'lonavala-willow-peak-cottage-c'
  ]);
  console.log('Updated Heaven (Cottage C) images in DB');

  const check = await pool.query('SELECT slug, name, images FROM "Villa" WHERE slug LIKE \'%willow%\'');
  console.log('\nVerified DB records:');
  for (const row of check.rows) {
    console.log(`${row.slug} (${row.name}): ${row.images.length} images`);
  }

  await pool.end();
  console.log('\nAll done successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
