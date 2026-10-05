import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const SOURCE_DIR = path.join(process.cwd(), 'public', 'assets', 'villas', 'WILLOW PEAK IMAGES');
const TARGET_DIR = path.join(process.cwd(), 'public', 'assets', 'villas', 'willow-peak');

const imageList = [
  { src: 'Untitled design - 1.png', id: 'wp-01.webp', title: 'Cottage Front & Private Sit-out' },
  { src: 'Untitled design - 2.png', id: 'wp-02.webp', title: 'Estate Panoramic View of 3 Chalets' },
  { src: 'Untitled design - 4.png', id: 'wp-03.webp', title: 'Private In-Room Jacuzzi' },
  { src: 'Untitled design - 11.png', id: 'wp-04.webp', title: 'Master Bedroom Suite Wide Angle' },
  { src: 'Untitled design - 13.png', id: 'wp-05.webp', title: 'A-Frame Ambient Bedroom' },
  { src: 'Untitled design - 3.png', id: 'wp-06.webp', title: 'King Bed with Timber Ceiling' },
  { src: 'Untitled design - 7.png', id: 'wp-07.webp', title: 'Architectural Chalet Perspective' },
  { src: 'Untitled design - 22.png', id: 'wp-08.webp', title: 'Gazebo & Carrom Games Deck' },
  { src: 'Untitled design - 5.png', id: 'wp-09.webp', title: 'Covered Outdoor Dining Pavillion' },
  { src: 'Untitled design - 17.png', id: 'wp-10.webp', title: 'Modern Attached Bathroom' },
];

async function run() {
  console.log('--- 1. PROCESSING WEBP IMAGES WITH CACHE-BUSTING NAMES ---');
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  for (let i = 0; i < imageList.length; i++) {
    const item = imageList[i];
    const srcPath = path.join(SOURCE_DIR, item.src);
    const destPath = path.join(TARGET_DIR, item.id);
    const legacyPath = path.join(TARGET_DIR, `gallery-${i + 1}.webp`);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing source file: ${srcPath}`);
    }

    const webpBuffer = await sharp(srcPath)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();

    fs.writeFileSync(destPath, webpBuffer);
    fs.writeFileSync(legacyPath, webpBuffer);
    console.log(`Generated: ${item.id} & gallery-${i + 1}.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
  }

  // Also main.webp
  fs.copyFileSync(path.join(TARGET_DIR, 'wp-01.webp'), path.join(TARGET_DIR, 'main.webp'));
  console.log('Generated: main.webp');

  console.log('\n--- 2. UPDATING DATABASE WITH CLEAN FRESH IMAGE LISTS ---');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Exactly the same 10 clean photos for ALL 4 Willow Peak properties
  const allWillowImages = imageList.map(item => `/assets/villas/willow-peak/${item.id}`);

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    allWillowImages, 'willow-peak', 'lonavala-willow-peak'
  ]);
  console.log('Updated DB: Willow Peak (Entire Estate) -> 10 clean images');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    allWillowImages, 'willow-peak-cottage-a', 'lonavala-willow-peak-cottage-a'
  ]);
  console.log('Updated DB: Breeze (Cottage A) -> 10 clean images');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    allWillowImages, 'willow-peak-cottage-b', 'lonavala-willow-peak-cottage-b'
  ]);
  console.log('Updated DB: Crest (Cottage B) -> 10 clean images');

  await pool.query('UPDATE "Villa" SET images = $1 WHERE slug = $2 OR id = $3', [
    allWillowImages, 'willow-peak-cottage-c', 'lonavala-willow-peak-cottage-c'
  ]);
  console.log('Updated DB: Heaven (Cottage C) -> 10 clean images');

  const check = await pool.query('SELECT slug, name, array_length(images, 1) as count, images FROM "Villa" WHERE slug LIKE \'%willow%\' ORDER BY slug');
  console.log('\nVerified database records:');
  for (const r of check.rows) {
    console.log(`${r.slug} (${r.name}): ${r.count} images -> first: ${r.images[0]}`);
  }

  await pool.end();
  console.log('\nDone successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
