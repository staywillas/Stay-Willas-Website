import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.resolve(root,process.argv[2] || 'scratch/willow-ai-references.json'),'utf8'));
const destination = path.join(root,'public/assets/villas/willow-peak/graded-v1');
fs.mkdirSync(destination,{recursive:true});
const quantiles=[0,0.02,0.1,0.25,0.5,0.75,0.9,0.98,1];
async function histogram(file) {
 const {data,info}=await sharp(file).resize({width:384}).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
 const channels=[[],[],[]];
 // The existing brand mark occupies the upper portion of the portrait photos.
 const start=info.height>info.width ? Math.round(info.height*0.18)*info.width*3 : 0;
 for(let i=start;i<data.length;i+=3) for(let c=0;c<3;c++) channels[c].push(data[i+c]);
 return channels.map(values=>{ values.sort((a,b)=>a-b); return quantiles.map(q=>values[Math.min(values.length-1,Math.floor(q*(values.length-1)))]); });
}
function lut(source,target) {
 const points=[{x:0,y:0}];
 for(let i=1;i<source.length-1;i++) {
  const x=source[i];
  if(x<=points.at(-1).x || x>=255) continue;
  // A restrained transfer avoids altered material colours and clipped details.
  const delta=Math.max(-32,Math.min(32,target[i]-x))*0.75;
  points.push({x,y:Math.max(points.at(-1).y+0.5,Math.min(254,x+delta))});
 }
 points.push({x:255,y:255});
 const table=[];
 for(let value=0;value<256;value++) {
  const i=points.findIndex(p=>p.x>=value);
  const a=points[Math.max(0,i-1)], b=points[i];
  table.push(Math.round(a.y+(b.y-a.y)*(value-a.x)/(b.x-a.x||1)));
 }
 return table;
}
(async()=>{
 const records=[];
 for(const ref of manifest.references) {
  const name=ref.id===11?'chalets-night':`wp-${String(ref.id).padStart(2,'0')}`;
  const source=path.join(root,ref.id===11?'public/images/sitelinks/willow-peak-chalets.webp':`public/assets/villas/willow-peak/${name}.webp`);
  const [before,after]=await Promise.all([histogram(source),histogram(ref.path)]);
  const tables=before.map((channel,i)=>lut(channel,after[i]));
  const {data,info}=await sharp(source).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
  const output=Buffer.allocUnsafe(data.length);
  for(let i=0;i<data.length;i++) output[i]=tables[i%3][data[i]];
  const final=path.join(destination,`${name}.webp`);
  await sharp(output,{raw:{width:info.width,height:info.height,channels:3}}).webp({quality:94,effort:6}).toFile(final);
  records.push({id:ref.id,source:path.relative(root,source).replaceAll('\\','/'),final:path.relative(root,final).replaceAll('\\','/'),width:info.width,height:info.height,tables});
  console.log(`${name}: ${info.width} x ${info.height}, colour-only export`);
 }
 fs.writeFileSync(path.join(destination,'grade-manifest.json'),JSON.stringify({method:'AI-reference per-channel monotonic colour transfer. Original pixel positions preserved; no crop, resizing, synthesis, sharpening, or object retouching.',prompt:manifest.prompt,records},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
