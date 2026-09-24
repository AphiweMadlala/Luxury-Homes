// Shared rendering helpers.
import { readFileSync } from 'node:fs';

export const BASE = (process.env.BASE || '/').replace(/\/?$/, '/');
export const PROPOSAL_MODE = process.env.PROPOSAL_MODE !== 'false';
export const SITE_URL = process.env.SITE_URL || 'https://aphiwemadlala.github.io/Luxury-Homes/';

export const u = path => BASE + String(path).replace(/^\//, '');

export const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Visible-text hygiene: no em/en dashes, no emoji, tidy whitespace.
export const tidy = s => String(s ?? '')
  .replace(/\p{Extended_Pictographic}|️|[\u{1F1E6}-\u{1F1FF}]/gu, '')
  .replace(/\s+[—–]\s+/g, ', ')
  .replace(/(\w)[—–](\w)/g, '$1-$2')
  .replace(/[—–]/g, '-')
  .replace(/\s+([,.;:])/g, '$1')
  .replace(/,\s*,/g, ',')
  .replace(/\s{2,}/g, ' ')
  .trim();

export const t = s => esc(tidy(s));

const NNBSP = '\u2009'; // thin space; build-site wraps it in a spaced span inside text
export const group = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
export const rand = n => (n == null ? null : `R${NNBSP}${group(n)}`);
export const area = n => (n == null ? null : `${group(n)}${NNBSP}m²`);
export const num = n => (n == null ? null : String(n).replace('.5', '½'));

export const monthYear = iso => new Date(iso).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric', timeZone: 'Africa/Johannesburg' });
export const fullDate = iso => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Johannesburg' });

export const slugify = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

// Phosphor light icons, inlined (library SVGs, not hand-drawn).
const iconCache = {};
export const icon = (name, label) => {
  iconCache[name] ??= readFileSync(new URL(`../node_modules/@phosphor-icons/core/assets/light/${name}-light.svg`, import.meta.url), 'utf8')
    .replace('<svg ', '<svg class="icon" focusable="false" ');
  return label
    ? iconCache[name].replace('<svg ', `<svg role="img" aria-label="${esc(label)}" `)
    : iconCache[name].replace('<svg ', '<svg aria-hidden="true" ');
};

// Responsive image. `img` is a processed manifest entry.
export function picture(img, { sizes = '100vw', alt = '', eager = false, cls = '', ratio } = {}) {
  if (!img) return '';
  const v = img.variants;
  const largest = v[v.length - 1];
  const fallback = v.find(x => x.width >= 1080) || largest;
  const srcset = v.map(x => `${u(x.path)} ${x.width}w`).join(', ');
  const style = ratio ? ` style="aspect-ratio:${ratio}"` : '';
  return `<img class="${cls}" src="${u(fallback.path)}" srcset="${srcset}" sizes="${sizes}" width="${largest.width}" height="${largest.height}" alt="${esc(tidy(alt))}"${eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'}${style}>`;
}

export const mailto = (to, subject, body = '') =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
export const tel = p => `tel:${p.replace(/[^+\d]/g, '')}`;
export const wa = (p, text) => `https://wa.me/${p.replace(/[^\d]/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
