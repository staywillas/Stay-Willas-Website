const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIco(pngBuffer) {
  const sizes = [16, 32, 48];
  const images = [];
  for (const s of sizes) {
    const buf = await sharp(pngBuffer).resize(s, s).png().toBuffer();
    images.push({ size: s, buffer: buf });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.buffer)]);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const sourceLogo = path.join(rootDir, 'logo transparent.png');
  const fullLogoSource = path.join(rootDir, 'public', 'images', 'STAY WILLAS logo transparent.png');

  console.log('Processing circular emblem from:', sourceLogo);
  const rawBuf = fs.readFileSync(sourceLogo);

  // 1. Trim transparency strictly to outer circle boundary
  const trimmed = await sharp(rawBuf).trim().toBuffer();

  // 2. Resize to 1030x1030 with slight bleed, then extract exactly 1024x1024
  // so the circular outer rim reaches 100% edge-to-edge with ZERO background margin
  const squareMaster = await sharp(trimmed)
    .resize(1032, 1032, { fit: 'fill' })
    .extract({ left: 4, top: 4, width: 1024, height: 1024 })
    .png()
    .toBuffer();

  // 3. Write public/images/logo.png & logo.webp (1024x1024)
  const logo1024Png = await sharp(squareMaster).png({ compressionLevel: 9 }).toBuffer();
  const logo1024Webp = await sharp(squareMaster).webp({ quality: 98, lossless: false }).toBuffer();

  fs.writeFileSync(path.join(rootDir, 'public', 'images', 'logo.png'), logo1024Png);
  fs.writeFileSync(path.join(rootDir, 'public', 'images', 'logo.webp'), logo1024Webp);
  console.log('Saved edge-to-edge public/images/logo.png and logo.webp (1024x1024)');

  // 4. Write icons (512x512)
  const icon512Png = await sharp(squareMaster).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'icon.png'), icon512Png);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'icon.png'), icon512Png);
  console.log('Saved public/icon.png and src/app/icon.png (512x512)');

  // 5. Write apple-icons (180x180)
  const appleIcon180Png = await sharp(squareMaster).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'apple-icon.png'), appleIcon180Png);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'apple-icon.png'), appleIcon180Png);
  console.log('Saved public/apple-icon.png and src/app/apple-icon.png (180x180)');

  // 6. Write favicon.ico
  const icoBuffer = await createIco(squareMaster);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), icoBuffer);
  console.log('Saved public/favicon.ico and src/app/favicon.ico');

  // 7. Full horizontal logo
  if (fs.existsSync(fullLogoSource)) {
    console.log('Optimizing full horizontal logo...');
    const fullRaw = fs.readFileSync(fullLogoSource);
    const fullTrimmed = await sharp(fullRaw).trim().toBuffer({ resolveWithObject: true });
    const padW = Math.round(fullTrimmed.info.width * 0.01);
    const padH = Math.round(fullTrimmed.info.height * 0.02);

    const fullFinal = await sharp(fullTrimmed.data)
      .extend({
        top: padH,
        bottom: padH,
        left: padW,
        right: padW,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const fullWebp = await sharp(fullFinal).webp({ quality: 98 }).toBuffer();

    fs.writeFileSync(path.join(rootDir, 'public', 'images', 'STAY WILLAS logo transparent.png'), fullFinal);
    fs.writeFileSync(path.join(rootDir, 'public', 'images', 'STAY WILLAS logo transparent.webp'), fullWebp);
    console.log(`Saved trimmed STAY WILLAS logo transparent (PNG & WebP)`);
  }

  // Clean scratch files
  ['scratch_fill.png', 'scratch_cover.png', 'scratch_exact.png'].forEach((f) => {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('All logo assets updated to edge-to-edge circle!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
