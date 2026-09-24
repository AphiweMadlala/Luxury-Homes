// Check every internal link, image and anchor in dist/. Lists external links for review.
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = (process.env.BASE || '/').replace(/\/?$/, '/');
const files = [];
const walk = d => readdirSync(d).forEach(f => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk(DIST);

const ids = new Map();
const pageFor = url => {
  let p = url.split('#')[0].split('?')[0];
  if (!p.startsWith(BASE)) return null;
  p = DIST + p.slice(BASE.length);
  if (p.endsWith('/')) p += 'index.html';
  return p;
};
const idsOf = f => { if (!ids.has(f)) ids.set(f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))); return ids.get(f); };

const broken = [], external = new Map();
let checked = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+/)[0])),
  ];
  for (const r of refs) {
    const ref = r.replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:)/.test(ref)) continue;
    if (/^https?:/.test(ref)) { if (!external.has(ref)) external.set(ref, f.replace(DIST, '/')); continue; }
    if (ref.startsWith('#')) { if (ref.length > 1 && !idsOf(f).has(ref.slice(1))) broken.push([f.replace(DIST, '/'), ref]); continue; }
    checked++;
    const target = pageFor(ref);
    if (!target || !existsSync(target)) { broken.push([f.replace(DIST, '/'), ref]); continue; }
    const hash = ref.split('#')[1];
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) broken.push([f.replace(DIST, '/'), ref]);
  }
}
writeFileSync(new URL('../reports/external-links.json', import.meta.url), JSON.stringify([...external.keys()].sort(), null, 2));
console.log(`pages ${files.length}, internal refs ${checked}, broken ${broken.length}, external ${external.size}`);
broken.slice(0, 40).forEach(b => console.log('BROKEN', b.join(' -> ')));
if (broken.length) process.exit(1);
