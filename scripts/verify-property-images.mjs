import fs from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import ts from 'typescript';

function exportsOf(file) {
  const result = {};
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('exports', compiled)(result);
  return result;
}
const { resolvePropertyImage } = exportsOf('src/lib/property-images.ts');
const { blogsData } = exportsOf('src/data/blogs.ts');
for (const post of blogsData) {
  assert(fs.existsSync(`public${post.image}`), `Missing blog photo: ${post.slug}`);
}
for (let index = 1; index <= 10; index++) {
  for (const alias of [`wp-${String(index).padStart(2, '0')}`, `gallery-${index}`]) {
    const resolved = resolvePropertyImage(`/assets/villas/willow-peak/${alias}.webp`);
    assert(resolved.includes('/graded-v1/'));
    assert(fs.existsSync(`public${resolved}`), `Missing legacy replacement: ${alias}`);
  }
}
assert(fs.existsSync(`public${resolvePropertyImage('/assets/villas/willow-peak/main.webp')}`));
assert(fs.existsSync(`public${resolvePropertyImage('/images/sitelinks/willow-peak-chalets.webp')}`));
const external = 'https://example.com/assets/villas/willow-peak/wp-01.webp';
assert.equal(resolvePropertyImage(external), external);
assert.equal(resolvePropertyImage('/images/hero-villa.webp'), '/images/hero-villa.webp');

const manifest = JSON.parse(fs.readFileSync('public/assets/villas/willow-peak/graded-v1/grade-manifest.json', 'utf8'));
const results = [];
for (const record of manifest.records) {
  const before = await sharp(record.source).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
  const after = await sharp(record.final).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
  assert.equal(before.info.width, after.info.width);
  assert.equal(before.info.height, after.info.height);
  assert.equal(before.data.length, after.data.length);
  // Compare every output channel at the same pixel position with the exported
  // colour curve. Only WebP encoding error is permitted, never new geometry.
  let squaredError = 0;
  for (let i = 0; i < before.data.length; i++) {
    const difference = record.tables[i % 3][before.data[i]] - after.data[i];
    squaredError += difference * difference;
  }
  const error = Math.sqrt(squaredError / before.data.length);
  assert(error < 6, `Unexpected spatial change: ${record.final} (RMSE ${error})`);
  results.push({file:record.final,width:after.info.width,height:after.info.height,encodingRMSE:Number(error.toFixed(3))});
}
console.log(JSON.stringify({blogAssets:blogsData.length,aliasReplacements:22,gradedPhotos:results.length,results}, null, 2));
