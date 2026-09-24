// Normalize raw Apify instagram-scraper output into data/instagram-posts.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const rawDir = new URL('../data/raw/', import.meta.url);
const files = readdirSync(rawDir).filter(f => /^posts.*\.json$/.test(f));
const seen = new Map();
for (const f of files) {
  for (const p of JSON.parse(readFileSync(new URL(f, rawDir)))) {
    if (!p.shortCode || p.error) continue;
    seen.set(p.shortCode, p);
  }
}

const media = p => {
  if (p.type === 'Sidecar' && Array.isArray(p.childPosts) && p.childPosts.length) {
    return p.childPosts.map((c, i) => ({
      index: i,
      type: c.type === 'Video' ? 'video' : 'image',
      url: c.displayUrl,
      videoUrl: c.videoUrl || null,
      width: c.dimensionsWidth || null,
      height: c.dimensionsHeight || null,
      alt: c.alt || null,
    }));
  }
  if (Array.isArray(p.images) && p.images.length > 1) {
    return p.images.map((u, i) => ({ index: i, type: 'image', url: u, videoUrl: null, width: null, height: null, alt: null }));
  }
  return [{
    index: 0,
    type: p.type === 'Video' ? 'video' : 'image',
    url: p.displayUrl,
    videoUrl: p.videoUrl || null,
    width: p.dimensionsWidth || null,
    height: p.dimensionsHeight || null,
    alt: p.alt || null,
  }];
};

const posts = [...seen.values()]
  .map(p => ({
    id: p.id,
    shortcode: p.shortCode,
    url: p.url || `https://www.instagram.com/p/${p.shortCode}/`,
    date: p.timestamp,
    author: p.ownerUsername,
    collaborators: (p.coauthorProducers || []).map(c => c.username).filter(Boolean),
    caption: p.caption || '',
    mediaType: p.productType === 'clips' ? 'reel' : p.type === 'Sidecar' ? 'carousel' : p.type === 'Video' ? 'video' : 'image',
    coverImage: p.displayUrl,
    media: media(p),
    video: p.videoUrl ? { url: p.videoUrl, durationSec: p.videoDuration || null, views: p.videoViewCount || p.videoPlayCount || null } : null,
    location: p.locationName ? { name: p.locationName, id: p.locationId || null } : null,
    mentions: p.mentions || [],
    taggedUsers: (p.taggedUsers || []).map(u => u.username),
    hashtags: p.hashtags || [],
    likes: p.likesCount ?? null,
    comments: p.commentsCount ?? null,
    isPinned: !!p.isPinned,
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

writeFileSync(new URL('../data/instagram-posts.json', import.meta.url), JSON.stringify(posts, null, 2));
console.log(`normalized ${posts.length} posts`);
