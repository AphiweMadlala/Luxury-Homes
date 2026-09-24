// Process curated source media into responsive WebP under public/images and
// write data/media-manifest.json. Rewrites `images` on properties/features with
// processed entries that keep full provenance.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { GALLERY_CAP } from './curation.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const read = f => JSON.parse(readFileSync(ROOT + f));
const write = (f, d) => writeFileSync(ROOT + f, JSON.stringify(d, null, 2) + '\n');
const WIDTHS = [640, 1080, 1600];
const posts = Object.fromEntries(read('data/instagram-posts.json').map(p => [p.shortcode, p]));

const properties = read('data/properties.json');
const features = read('data/features.json');
const plan = read('data/raw/media-plan.json');
for (const r of [...properties, ...features]) r.images = plan[r.slug].images;

rmSync(ROOT + 'public/images', { recursive: true, force: true });

const manifest = [];
const hashes = new Map(); // hash -> first manifest entry
const problems = [];

async function processRecord(rec, collection, cap) {
  const out = [];
  const seenHere = new Set();
  for (const img of rec.images) {
    if (out.length >= cap) break;
    const src = ROOT + img.src;
    if (!existsSync(src)) { problems.push({ type: 'missing', record: rec.slug, src: img.src }); continue; }
    const size = statSync(src).size;
    if (size === 0) { problems.push({ type: 'zero-byte', record: rec.slug, src: img.src }); continue; }
    const buf = readFileSync(src);
    const hash = createHash('sha256').update(buf).digest('hex').slice(0, 16);
    if (seenHere.has(hash)) { problems.push({ type: 'duplicate-within-record', record: rec.slug, src: img.src }); continue; }
    seenHere.add(hash);
    let meta;
    try { meta = await sharp(buf).metadata(); } catch (e) { problems.push({ type: 'corrupt', record: rec.slug, src: img.src, error: e.message }); continue; }
    const prior = hashes.get(hash);
    if (prior && prior.record !== rec.slug) problems.push({ type: 'cross-record-duplicate', record: rec.slug, other: prior.record, src: img.src });
    const n = String(out.length + 1).padStart(2, '0');
    const dir = `public/images/${collection}/${rec.slug}`;
    mkdirSync(ROOT + dir, { recursive: true });
    const widths = WIDTHS.filter(w => w < meta.width).concat(meta.width).filter((w, i, a) => a.indexOf(w) === i && w <= 1600);
    const variants = [];
    for (const w of widths) {
      const file = `${dir}/${n}-${w}.webp`;
      const info = await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(ROOT + file);
      variants.push({ width: info.width, height: info.height, path: file.replace(/^public\//, ''), bytes: info.size });
    }
    const post = posts[img.sourcePost];
    const entry = {
      record: rec.slug, collection, order: out.length + 1, hash,
      role: img.role, width: meta.width, height: meta.height,
      orientation: meta.width > meta.height * 1.05 ? 'landscape' : meta.height > meta.width * 1.05 ? 'portrait' : 'square',
      variants,
      provenance: { sourcePost: img.sourcePost, sourceIndex: img.sourceIndex, still: img.still || null, postUrl: post.url, postDate: post.date,
        author: post.author, credit: null },
      alt: null,
    };
    if (!prior) hashes.set(hash, entry);
    manifest.push(entry);
    out.push(entry);
  }
  if (!out.length) problems.push({ type: 'no-images', record: rec.slug });
  return out;
}

for (const p of properties) {
  const imgs = await processRecord(p, 'properties', GALLERY_CAP[p.status] ?? 8);
  p.images = imgs.map(({ record, collection, ...e }) => e);
}
for (const f of features) {
  const imgs = await processRecord(f, 'features', GALLERY_CAP.feature);
  f.images = imgs.map(({ record, collection, ...e }) => e);
}

write('data/properties.json', properties);
write('data/features.json', features);
write('data/media-manifest.json', { generatedAt: new Date().toISOString(), count: manifest.length, problems, images: manifest });
const bytes = manifest.flatMap(m => m.variants).reduce((a, v) => a + v.bytes, 0);
console.log(`images ${manifest.length}, variants ${(bytes / 1e6).toFixed(1)} MB, problems ${problems.length}`);
const byType = problems.reduce((a, p) => ((a[p.type] = (a[p.type] || 0) + 1), a), {});
console.log(byType);
