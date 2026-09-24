# Research Audit

Date: 2026-09-24. Everything the site states is traceable to a source below.

## Tools and access

| Tool | Status | Used for |
|---|---|---|
| Apify (API with `APIFY_TOKEN`) | Working. The Apify CLI is installed (1.10.0) but not logged in, so the REST API was called directly with the token in a header (never printed). | Instagram profile (`apify/instagram-profile-scraper`), 200 posts (`apify/instagram-scraper`), YouTube channel (`streamers/youtube-scraper`). Total spend under US$1. |
| Firecrawl CLI 1.24.4 | **Unavailable**: `FIRECRAWL_API_KEY` not set, CLI not authenticated. | Not used. Replaced by WebFetch/WebSearch for agency and press pages. |
| Agent Reach | Skill present, CLI not installed. | Not used; WebSearch covered people/company lookups. |
| WebSearch / WebFetch | Working. | Agency listings, portals, press, company pages. |
| Playwright CLI 0.1.21 | Working after installing Chromium headless shell. | All visual and interaction QA. |
| yt-dlp | Blocked (YouTube "confirm you're not a bot"). Not retried. | Intended for landscape film frames. |
| ffmpeg (bundled via imageio-ffmpeg) | Working. | Scene-change stills from Instagram reels. |
| sharp 0.34 | Working. | WebP derivatives. |

## Raw data (data/raw/)

| File | Content |
|---|---|
| `profile.json` | Profile metadata: 67,333 followers, 445 posts, verified, bio, YouTube link. |
| `posts-latest-200.json` | 200 most recent posts, 15 Jan 2021 to 15 Sep 2026. |
| `youtube-videos.json` | 9 long-form tours with descriptions, credits and contacts; channel description. |
| `media/` (git-ignored) | 1,267 downloaded media files + extracted reel stills. |
| `media-plan.json` | Raw image plan per record, input to the media pipeline. |

Older posts (245, pre-2021) were not scraped. The 200 most recent posts cover every listing that could plausibly still be live, every film, and the full architecture-feature era, so selective older retrieval was not needed.

## Sources consulted

### Brand identity
- Instagram profile (Apify).
- YouTube channel About and 9 video descriptions (Apify).
- https://linktr.ee/Mbuyelo : "Subscribe to my YouTube" → bit.ly/ToursInSA → this channel (redirect verified with curl).
- https://www.thobela-cars.co.za/about-thobela-cars : Mbuyelo Rathidili, Manager & Sales; prior work at Hamilton's Property Portfolio.
- Hamilton's agent page and news article: HTTP 404 (current relationship unverifiable).
- Facebook "Luxury Homes South Africa | Randburg": no connection found; treated as unrelated.
- Web search for "Cacoon Group": a Facebook page exists; no website or company registration details found.

### Listing verification
| Home | Source | Result |
|---|---|---|
| Signature Estate, Umhlanga | thestorey.co.za, RL722 | Live, R31,000,000 |
| Blue Hills Equestrian Estate | chaseveritt.co.za, CVWF-1441 | Live, R39,990,000 |
| Kloof Road, Bantry Bay | greeff.co.za, RL21514 | Live, R138,000,000 (published 24 Jul 2025) |
| Kloof Road, Bantry Bay | remax.co.za listing 4260629 | Redirects to area results (removed) |
| Nettleton Road, Clifton | iol.co.za (18 May 2026), billionaires.africa, 2oceansvibe | Reported sold, R220m |
| Pinnacle Point R36m | pamgolding.co.za area search + 1MB1551529 | No match (1MB1551529 is a different, sold house) |
| Can Balearia | web search | No live listing found |
| The Boundary House | web search, luxuryportfolio.com | No confident match |
| Higgovale R42m | web search | No live listing found |

### Credits
Architect, designer, developer, builder and photographer credits come only from captions and YouTube descriptions. Websites for credited practices were added only where the caption or film description gave them, or where the domain was checked live (saota.com, arrcc.com: HTTP 200).

## What was not verified

- Current status of 54 archive listings (2021–2025).
- Whether the platform is paid for features, and on what terms.
- The legal entity behind Cacoon Group.
- Image rights for photography from agencies and photographers reposted in the feed.
- The identity of the 2026 presenter (@bopape); not used on the site.
