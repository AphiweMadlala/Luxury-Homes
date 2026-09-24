# Content Classification

Scope: the 200 most recent posts on @luxuryhomes_southafrica (2021-01-15 to 2026-09-15), extracted with Apify on 2026-09-24. Every post was read and classified by hand (see `scripts/curation.mjs`, `POST_CATEGORY`). Machine-readable result: `data/post-classification.json`.

## Totals

| Category | Posts | Site treatment |
|---|---|---|
| architecture | 70 | Houses |
| property-listing | 53 | Residences, Archive (status unconfirmed) unless verified |
| lifestyle | 14 | Excluded |
| property-tour | 12 | Films + residence or house record |
| inspiration | 11 | Excluded |
| interior-design | 9 | Houses (Interiors) |
| development | 7 | Houses (In development) |
| rental | 7 | Excluded |
| commercial-partnership | 6 | Excluded |
| property-sold | 6 | Residences, Sold |
| featured-home | 3 | Not used: no credits, no particulars |
| property-for-sale | 2 | Residences (verified current) |

## By year

| Year | architecture | property-listing | lifestyle | property-tour | inspiration | interior-design | development | rental | commercial-partnership | property-sold | featured-home | property-for-sale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2021 | 56 | 33 | 12 |  | 10 | 5 | 4 | 6 | 2 | 4 | 3 |  |
| 2022 | 12 | 14 | 2 |  | 1 | 4 | 1 | 1 | 1 | 1 |  |  |
| 2023 | 1 | 5 |  | 5 |  |  | 2 |  | 1 |  |  |  |
| 2024 | 1 |  |  | 3 |  |  |  |  | 1 |  |  | 1 |
| 2025 |  | 1 |  | 3 |  |  |  |  |  |  |  |  |
| 2026 |  |  |  | 1 |  |  |  |  | 1 | 1 |  | 1 |

Posting fell from roughly 12 posts a month in 2021 to a handful of long-form tours and premium listings a year from 2023. The recent account is a tour-and-listing channel; the older account is an architecture feed. The site uses both, keeping them in separate models (Residences vs Houses).

## Exclusions

- **commercial-partnership**: Automotive / product promotion — not residential content.
- **lifestyle**: Cars, motivational quotes, travel — not residential content.
- **inspiration**: Uncredited or non-South-African imagery.
- **rental**: Holiday / rental villa promotion (2021). Rental activity not verified as current; outside sales/editorial scope.
- **featured-home** (3 posts): homes shown without architect, agent or particulars; nothing verifiable to present.

## Post-level table

| Date | Post | Type | Category | Record |
|---|---|---|---|---|
| 2026-09-15 | [DdTclIYjHW0](https://www.instagram.com/p/DdTclIYjHW0/) | carousel | property-for-sale | residence: signature-estate-beach-house |
| 2026-04-02 | [DWn91yViPpe](https://www.instagram.com/p/DWn91yViPpe/) | reel | commercial-partnership |  |
| 2026-02-05 | [DUYH9hJDJTV](https://www.instagram.com/p/DUYH9hJDJTV/) | carousel | property-sold | residence: nettleton-road-clifton |
| 2026-01-11 | [DTX-tWwjPKC](https://www.instagram.com/p/DTX-tWwjPKC/) | reel | property-tour | residence: blue-hills-equestrian-residence |
| 2025-12-08 | [DSAC1yDDFcC](https://www.instagram.com/p/DSAC1yDDFcC/) | reel | property-tour | residence: can-balearia |
| 2025-10-10 | [DPoF4EHDFqc](https://www.instagram.com/p/DPoF4EHDFqc/) | reel | property-tour | house: sun-valley-manor |
| 2025-09-23 | [DO8SUrgjCyD](https://www.instagram.com/p/DO8SUrgjCyD/) | carousel | property-listing | residence: pinnacle-point-golf-residence |
| 2025-04-06 | [DIGyQLGN9LV](https://www.instagram.com/p/DIGyQLGN9LV/) | reel | property-tour | residence: boundary-house |
| 2024-07-14 | [C9Z_3eAN5NT](https://www.instagram.com/p/C9Z_3eAN5NT/) | reel | property-tour | house: hallmark-house-penthouse |
| 2024-07-05 | [C9Cn1bUNTlT](https://www.instagram.com/p/C9Cn1bUNTlT/) | reel | commercial-partnership |  |
| 2024-07-03 | [C89ERqztvab](https://www.instagram.com/p/C89ERqztvab/) | carousel | property-for-sale | residence: kloof-road-bantry-bay |
| 2024-06-17 | [C8UhvcGNdBO](https://www.instagram.com/p/C8UhvcGNdBO/) | reel | property-tour | house: sun-valley-manor |
| 2024-05-22 | [C7Qrp0zsAU7](https://www.instagram.com/p/C7Qrp0zsAU7/) | reel | architecture | house: rivers-edge |
| 2024-05-19 | [C7J0rohtIsk](https://www.instagram.com/p/C7J0rohtIsk/) | reel | property-tour | house: rivers-edge |
| 2023-10-21 | [Cyp2jfuNOvC](https://www.instagram.com/p/Cyp2jfuNOvC/) | reel | property-tour | residence: rynfield-residence |
| 2023-10-16 | [Cyd3HjOtBbK](https://www.instagram.com/p/Cyd3HjOtBbK/) | image | property-tour | residence: rynfield-residence |
| 2023-09-25 | [CxnZkAEtUrF](https://www.instagram.com/p/CxnZkAEtUrF/) | reel | commercial-partnership |  |
| 2023-09-19 | [CxXOFuWt2Sm](https://www.instagram.com/p/CxXOFuWt2Sm/) | reel | property-tour | house: helderfontein-bushveld-house |
| 2023-09-03 | [Cwu4-VGtBFN](https://www.instagram.com/p/Cwu4-VGtBFN/) | reel | property-tour | house: helderfontein-bushveld-house |
| 2023-06-19 | [CtqqwIatHKm](https://www.instagram.com/p/CtqqwIatHKm/) | carousel | property-listing | residence: signature-sibaya-2023 |
| 2023-06-04 | [CtEiPVtLRVf](https://www.instagram.com/p/CtEiPVtLRVf/) | reel | property-tour | residence: blair-atholl-golf-residence |
| 2023-06-02 | [Cs_k2WrtMTR](https://www.instagram.com/p/Cs_k2WrtMTR/) | carousel | property-listing | residence: higgovale-cantilever-house |
| 2023-03-22 | [CqFmf00jALA](https://www.instagram.com/p/CqFmf00jALA/) | carousel | development | house: bronkhorstspruit-urbanstone |
| 2023-03-18 | [Cp7ZwDvDpYV](https://www.instagram.com/p/Cp7ZwDvDpYV/) | carousel | property-listing | residence: benmore-gardens-house |
| 2023-03-14 | [CpxM7HwDtQH](https://www.instagram.com/p/CpxM7HwDtQH/) | carousel | development | house: bronkhorstspruit-urbanstone |
| 2023-03-09 | [CpkQj-GDVDK](https://www.instagram.com/p/CpkQj-GDVDK/) | carousel | property-listing | residence: five-elements-house |
| 2023-02-21 | [Co7NYr7NrOH](https://www.instagram.com/p/Co7NYr7NrOH/) | carousel | architecture | house: sandton-stacked-boxes |
| 2023-02-09 | [CocSPNrNAyF](https://www.instagram.com/p/CocSPNrNAyF/) | carousel | property-listing | residence: blair-atholl-golf-residence |
| 2022-11-24 | [ClV4kRDDEGq](https://www.instagram.com/p/ClV4kRDDEGq/) | carousel | property-listing | residence: waterfall-country-estate-2022 |
| 2022-11-18 | [ClGA-BrKGhH](https://www.instagram.com/p/ClGA-BrKGhH/) | reel | lifestyle |  |
| 2022-11-02 | [CkdH3iDjIwI](https://www.instagram.com/p/CkdH3iDjIwI/) | carousel | property-listing | residence: blue-hills-cedia-house |
| 2022-10-10 | [CjiEoyHjLNA](https://www.instagram.com/p/CjiEoyHjLNA/) | carousel | architecture | house: sbe-signature-home |
| 2022-09-17 | [CinH087DZ0B](https://www.instagram.com/p/CinH087DZ0B/) | carousel | property-listing | residence: simola-smart-house |
| 2022-09-03 | [CiDAQIejcU7](https://www.instagram.com/p/CiDAQIejcU7/) | carousel | architecture | house: sanctuary-nahoon |
| 2022-08-29 | [Ch2Z7bJDtHk](https://www.instagram.com/p/Ch2Z7bJDtHk/) | carousel | property-listing | residence: mooikloof-heights-house |
| 2022-08-18 | [ChaDBjGjYMo](https://www.instagram.com/p/ChaDBjGjYMo/) | carousel | property-listing | residence: helderfontein-smart-house |
| 2022-07-08 | [CfwpIryD5ty](https://www.instagram.com/p/CfwpIryD5ty/) | carousel | property-listing | residence: zimbali-driveway-house |
| 2022-06-30 | [CfbxVZqD8Uv](https://www.instagram.com/p/CfbxVZqD8Uv/) | carousel | property-listing | residence: pezula-house-2022 |
| 2022-06-21 | [CfD8GXNDAZG](https://www.instagram.com/p/CfD8GXNDAZG/) | carousel | property-listing | residence: houghton-penthouse |
| 2022-06-14 | [Ceyh90NDgEY](https://www.instagram.com/p/Ceyh90NDgEY/) | carousel | development |  |
| 2022-06-13 | [Cevt3fwj3MF](https://www.instagram.com/p/Cevt3fwj3MF/) | image | architecture | house: kloof-119a |
| 2022-06-07 | [CegtuYhDuY2](https://www.instagram.com/p/CegtuYhDuY2/) | carousel | interior-design | house: pearl-valley-kitchen |
| 2022-05-25 | [Cd-h7I0DJCv](https://www.instagram.com/p/Cd-h7I0DJCv/) | carousel | property-listing | residence: bryanston-ridge-house |
| 2022-05-20 | [CdxxkBfDoaB](https://www.instagram.com/p/CdxxkBfDoaB/) | image | commercial-partnership |  |
| 2022-05-18 | [CdsjZ1fDe7C](https://www.instagram.com/p/CdsjZ1fDe7C/) | carousel | architecture | house: house-vg5 |
| 2022-05-10 | [CdX85MHMou3](https://www.instagram.com/p/CdX85MHMou3/) | carousel | architecture | house: houghton-residence-saota |
| 2022-04-29 | [Cc7Mg5wsvQ7](https://www.instagram.com/p/Cc7Mg5wsvQ7/) | carousel | property-listing | residence: morningside-entertainer-house |
| 2022-04-24 | [CcuXvJHDV5j](https://www.instagram.com/p/CcuXvJHDV5j/) | carousel | property-listing | residence: dainfern-house-2022 |
| 2022-04-12 | [CcQdnsWMWrD](https://www.instagram.com/p/CcQdnsWMWrD/) | carousel | architecture | house: villa-meyersdal |
| 2022-04-11 | [CcNRoLdMrEt](https://www.instagram.com/p/CcNRoLdMrEt/) | carousel | rental |  |
| 2022-04-04 | [Cb7ZfLKsEj9](https://www.instagram.com/p/Cb7ZfLKsEj9/) | carousel | property-listing | residence: oriel-cluster |
| 2022-03-23 | [CbcgYb2sOsq](https://www.instagram.com/p/CbcgYb2sOsq/) | carousel | lifestyle |  |
| 2022-03-18 | [CbQDdCNMxeJ](https://www.instagram.com/p/CbQDdCNMxeJ/) | carousel | property-sold | residence: house-pagasvlei |
| 2022-03-17 | [CbNV7JxM9wS](https://www.instagram.com/p/CbNV7JxM9wS/) | carousel | architecture | house: house-sibaya-toweel |
| 2022-03-16 | [CbLQB4KsDVq](https://www.instagram.com/p/CbLQB4KsDVq/) | carousel | property-listing | residence: simbithi-three-level-house |
| 2022-03-15 | [CbHi0VKOntE](https://www.instagram.com/p/CbHi0VKOntE/) | carousel | interior-design | house: steyn-city-master-suite |
| 2022-03-14 | [CbFxQetsnDp](https://www.instagram.com/p/CbFxQetsnDp/) | image | interior-design | house: yzerfontein-kitchen |
| 2022-03-13 | [CbDH-S3stqr](https://www.instagram.com/p/CbDH-S3stqr/) | carousel | property-listing | residence: waterfall-equestrian-house |
| 2022-03-11 | [Ca9dzptsBYa](https://www.instagram.com/p/Ca9dzptsBYa/) | image | inspiration |  |
| 2022-03-10 | [Ca6kOMCO2ij](https://www.instagram.com/p/Ca6kOMCO2ij/) | carousel | architecture | house: house-113-linksfield |
| 2022-03-09 | [Ca47rY3Mgqg](https://www.instagram.com/p/Ca47rY3Mgqg/) | image | architecture | house: atlantic-seaboard-proposal |
| 2022-03-08 | [Ca2CI30sLtF](https://www.instagram.com/p/Ca2CI30sLtF/) | carousel | architecture | house: house-mcintosh |
| 2022-01-29 | [CZT--YMMLCN](https://www.instagram.com/p/CZT--YMMLCN/) | image | architecture | house: steyn-city-sbe-house |
| 2022-01-17 | [CY0-PGqMp54](https://www.instagram.com/p/CY0-PGqMp54/) | carousel | interior-design | house: house-595-pearl-valley |
| 2022-01-16 | [CYzAty-sOkF](https://www.instagram.com/p/CYzAty-sOkF/) | carousel | architecture | house: clara-anna-fontein-family-house |
| 2021-12-24 | [CX3EmHSsNPm](https://www.instagram.com/p/CX3EmHSsNPm/) | carousel | property-listing | residence: one-beachy-head-drive |
| 2021-12-19 | [CXqs99BMqE3](https://www.instagram.com/p/CXqs99BMqE3/) | carousel | property-listing | residence: horizon-villa-bantry-bay |
| 2021-12-06 | [CXIwQHGsZeL](https://www.instagram.com/p/CXIwQHGsZeL/) | carousel | property-listing | residence: sandton-estate-house-2021 |
| 2021-10-26 | [CVfEvw4s_Vh](https://www.instagram.com/p/CVfEvw4s_Vh/) | carousel | architecture | house: southdowns-pitched-roof-house |
| 2021-10-22 | [CVWWTZ-jhEw](https://www.instagram.com/p/CVWWTZ-jhEw/) | carousel | inspiration |  |
| 2021-10-20 | [CVPu4KlslyI](https://www.instagram.com/p/CVPu4KlslyI/) | carousel | inspiration |  |
| 2021-10-15 | [CVCzm_SDtL5](https://www.instagram.com/p/CVCzm_SDtL5/) | carousel | inspiration |  |
| 2021-10-04 | [CUm_a7TjkMZ](https://www.instagram.com/p/CUm_a7TjkMZ/) | image | lifestyle |  |
| 2021-09-30 | [CUchnJss4Mx](https://www.instagram.com/p/CUchnJss4Mx/) | carousel | property-listing | residence: clara-anna-fontein-house |
| 2021-09-27 | [CUVLtfQs3Uj](https://www.instagram.com/p/CUVLtfQs3Uj/) | carousel | architecture | house: constantia-malan-vorster |
| 2021-09-19 | [CUAc-yCsav9](https://www.instagram.com/p/CUAc-yCsav9/) | carousel | architecture | house: house-els |
| 2021-09-16 | [CT4rvTKsF86](https://www.instagram.com/p/CT4rvTKsF86/) | carousel | architecture | house: fresnaye-lfmira |
| 2021-09-13 | [CTwlfcTsJqM](https://www.instagram.com/p/CTwlfcTsJqM/) | carousel | property-listing | residence: millionaires-bend-vaal |
| 2021-09-11 | [CTrS-Amsq_V](https://www.instagram.com/p/CTrS-Amsq_V/) | carousel | featured-home |  |
| 2021-09-08 | [CTjiY-UDuiM](https://www.instagram.com/p/CTjiY-UDuiM/) | carousel | architecture | house: project-828 |
| 2021-09-05 | [CTc163CjoiL](https://www.instagram.com/p/CTc163CjoiL/) | carousel | property-listing | residence: upper-constantia-house |
| 2021-09-02 | [CTUckz2DH-h](https://www.instagram.com/p/CTUckz2DH-h/) | carousel | interior-design | house: concrete-house |
| 2021-09-01 | [CTRfYsoDW3y](https://www.instagram.com/p/CTRfYsoDW3y/) | carousel | rental |  |
| 2021-08-26 | [CTClLUBDBCj](https://www.instagram.com/p/CTClLUBDBCj/) | carousel | interior-design | house: cotswold-downs-interior |
| 2021-08-25 | [CS_wLhSDXtJ](https://www.instagram.com/p/CS_wLhSDXtJ/) | carousel | architecture | house: city-villa-arrcc |
| 2021-08-24 | [CS9LW_Ij7qM](https://www.instagram.com/p/CS9LW_Ij7qM/) | carousel | commercial-partnership |  |
| 2021-08-23 | [CS650pLDasl](https://www.instagram.com/p/CS650pLDasl/) | carousel | property-listing | residence: glendower-golf-house |
| 2021-08-20 | [CSy39ehDeHJ](https://www.instagram.com/p/CSy39ehDeHJ/) | image | lifestyle |  |
| 2021-08-19 | [CSwJlpyDhRb](https://www.instagram.com/p/CSwJlpyDhRb/) | carousel | architecture | house: house-gouws |
| 2021-08-18 | [CStrFYyDSL7](https://www.instagram.com/p/CStrFYyDSL7/) | carousel | property-listing | residence: pezula-ocean-house |
| 2021-08-16 | [CSoNq-dj5RW](https://www.instagram.com/p/CSoNq-dj5RW/) | carousel | architecture | house: oban-house |
| 2021-08-15 | [CSmULMbDI4q](https://www.instagram.com/p/CSmULMbDI4q/) | carousel | architecture | house: serengeti-classic-elegance |
| 2021-08-09 | [CSXPm5KjWDM](https://www.instagram.com/p/CSXPm5KjWDM/) | carousel | architecture | house: umhlanga-forest-house |
| 2021-08-08 | [CSUCLSvDMEa](https://www.instagram.com/p/CSUCLSvDMEa/) | carousel | property-listing | residence: eco-estate-nvdm-house |
| 2021-08-05 | [CSMJhDEjseA](https://www.instagram.com/p/CSMJhDEjseA/) | carousel | property-listing | residence: bedfordview-truss-house |
| 2021-08-02 | [CSERg1cjVp6](https://www.instagram.com/p/CSERg1cjVp6/) | carousel | property-listing | residence: bedfordview-cluster |
| 2021-08-01 | [CSCpABIDmYH](https://www.instagram.com/p/CSCpABIDmYH/) | carousel | architecture | house: hawaan-forest-house |
| 2021-07-28 | [CR303n1jTWi](https://www.instagram.com/p/CR303n1jTWi/) | carousel | property-listing | residence: hazeldean-house |
| 2021-07-23 | [CRqg4fOjxQI](https://www.instagram.com/p/CRqg4fOjxQI/) | image | lifestyle |  |
| 2021-07-17 | [CRbr7gwDekB](https://www.instagram.com/p/CRbr7gwDekB/) | carousel | property-listing | residence: villa-rosemarimo |
| 2021-07-16 | [CRYtPBAjCux](https://www.instagram.com/p/CRYtPBAjCux/) | carousel | property-listing | residence: constantia-glass-house |
| 2021-07-15 | [CRWSCOpDSm6](https://www.instagram.com/p/CRWSCOpDSm6/) | carousel | architecture | house: house-mosi |
| 2021-07-13 | [CRRwFpNje7N](https://www.instagram.com/p/CRRwFpNje7N/) | carousel | architecture | house: villa-de-la-reserve |
| 2021-07-12 | [CROOyVBDO8e](https://www.instagram.com/p/CROOyVBDO8e/) | carousel | rental |  |
| 2021-07-10 | [CRIle7nos7A](https://www.instagram.com/p/CRIle7nos7A/) | carousel | property-listing | residence: dainfern-kapa-house |
| 2021-07-09 | [CRGQBGMDo-q](https://www.instagram.com/p/CRGQBGMDo-q/) | carousel | property-listing | residence: waterkloof-ridge-house |
| 2021-07-07 | [CRCc1TOIBsV](https://www.instagram.com/p/CRCc1TOIBsV/) | carousel | property-listing | residence: atholl-house |
| 2021-07-06 | [CQ_bsVVo058](https://www.instagram.com/p/CQ_bsVVo058/) | carousel | architecture | house: house-snyman |
| 2021-07-05 | [CQ8yH30IROM](https://www.instagram.com/p/CQ8yH30IROM/) | carousel | property-sold | residence: clifton-ocean-house-2021 |
| 2021-07-05 | [CQ8HXgvjJme](https://www.instagram.com/p/CQ8HXgvjJme/) | image | lifestyle |  |
| 2021-07-04 | [CQ54vVnIKoe](https://www.instagram.com/p/CQ54vVnIKoe/) | image | inspiration |  |
| 2021-07-01 | [CQyDziWjzML](https://www.instagram.com/p/CQyDziWjzML/) | carousel | property-listing | residence: the-azure-camps-bay |
| 2021-06-28 | [CQqJqtOjO1J](https://www.instagram.com/p/CQqJqtOjO1J/) | carousel | rental |  |
| 2021-06-27 | [CQn6PO8jrj9](https://www.instagram.com/p/CQn6PO8jrj9/) | carousel | property-listing | residence: culross-house |
| 2021-06-24 | [CQgXH-YjaxB](https://www.instagram.com/p/CQgXH-YjaxB/) | carousel | architecture | house: house-sm37 |
| 2021-06-23 | [CQdM_PJj9T4](https://www.instagram.com/p/CQdM_PJj9T4/) | carousel | architecture |  |
| 2021-06-22 | [CQauemSjjlV](https://www.instagram.com/p/CQauemSjjlV/) | carousel | property-listing | residence: zimbali-koi-house |
| 2021-06-21 | [CQY1vl-j95V](https://www.instagram.com/p/CQY1vl-j95V/) | carousel | property-listing | residence: copperleaf-house |
| 2021-06-20 | [CQV7j_7DWAc](https://www.instagram.com/p/CQV7j_7DWAc/) | carousel | architecture | house: waterfall-signature-zotos |
| 2021-06-18 | [CQRCp21j5V7](https://www.instagram.com/p/CQRCp21j5V7/) | carousel | property-listing | residence: waterkloof-ridge-house |
| 2021-06-17 | [CQN8wZsl4fw](https://www.instagram.com/p/CQN8wZsl4fw/) | image | lifestyle |  |
| 2021-06-16 | [CQLTWMqjbvl](https://www.instagram.com/p/CQLTWMqjbvl/) | carousel | architecture | house: victoria-residence |
| 2021-06-14 | [CQGLnzGDgoc](https://www.instagram.com/p/CQGLnzGDgoc/) | image | lifestyle |  |
| 2021-06-09 | [CP5QF-_jyWQ](https://www.instagram.com/p/CP5QF-_jyWQ/) | carousel | architecture | house: clifton-hillside-house |
| 2021-06-01 | [CPklXx3jaey](https://www.instagram.com/p/CPklXx3jaey/) | carousel | property-listing | residence: cape-mountain-estate |
| 2021-05-31 | [CPhw7xNDd9_](https://www.instagram.com/p/CPhw7xNDd9_/) | carousel | architecture | house: sbe-limpopo-house |
| 2021-05-30 | [CPfeBtKjYSz](https://www.instagram.com/p/CPfeBtKjYSz/) | carousel | architecture | house: fawcetts-avenue |
| 2021-05-28 | [CPa0ZF_D0e1](https://www.instagram.com/p/CPa0ZF_D0e1/) | carousel | architecture | house: sandton-textured-facade |
| 2021-05-27 | [CPX1bUiDn20](https://www.instagram.com/p/CPX1bUiDn20/) | carousel | property-listing | residence: morningside-pond-house |
| 2021-05-26 | [CPVOt5YD4n3](https://www.instagram.com/p/CPVOt5YD4n3/) | carousel | property-sold | residence: hurlingham-house |
| 2021-05-25 | [CPSgbuJjshh](https://www.instagram.com/p/CPSgbuJjshh/) | carousel | property-listing | residence: eccleston-drive-house |
| 2021-05-24 | [CPQIrKkDwF2](https://www.instagram.com/p/CPQIrKkDwF2/) | carousel | rental | house: sea-lion-bantry-bay |
| 2021-05-22 | [CPKgl50Dvor](https://www.instagram.com/p/CPKgl50Dvor/) | carousel | development | house: aurum-bantry-bay |
| 2021-05-21 | [CPICYgkDhWY](https://www.instagram.com/p/CPICYgkDhWY/) | carousel | interior-design |  |
| 2021-05-19 | [CPDLSKADRHv](https://www.instagram.com/p/CPDLSKADRHv/) | carousel | property-sold | residence: birdhaven-house |
| 2021-05-18 | [CPAil5CDg0Z](https://www.instagram.com/p/CPAil5CDg0Z/) | carousel | architecture | house: house-thibault |
| 2021-05-13 | [CO0WluKjUTw](https://www.instagram.com/p/CO0WluKjUTw/) | carousel | property-listing | residence: hyde-park-enclave-house |
| 2021-05-12 | [COxk0S2jZ28](https://www.instagram.com/p/COxk0S2jZ28/) | carousel | architecture | house: hazelwood-house |
| 2021-05-11 | [COuiC2dDIkR](https://www.instagram.com/p/COuiC2dDIkR/) | carousel | architecture | house: waterfall-farmhouse-gottsmann |
| 2021-05-04 | [COceWVrDvm4](https://www.instagram.com/p/COceWVrDvm4/) | carousel | property-sold | residence: somerset-west-ocean-view-house |
| 2021-05-03 | [COaeBDZjIBe](https://www.instagram.com/p/COaeBDZjIBe/) | carousel | property-listing | residence: linksfield-ridge-house |
| 2021-04-28 | [CONj492jSSB](https://www.instagram.com/p/CONj492jSSB/) | carousel | property-listing |  |
| 2021-04-26 | [COH6O8DDNbA](https://www.instagram.com/p/COH6O8DDNbA/) | image | interior-design | house: house-595-pearl-valley |
| 2021-04-23 | [COAfY-_D1-l](https://www.instagram.com/p/COAfY-_D1-l/) | carousel | architecture | house: villa-victoria-bantry-bay |
| 2021-04-22 | [CN9oTZKjVgL](https://www.instagram.com/p/CN9oTZKjVgL/) | carousel | architecture | house: oban-house |
| 2021-04-17 | [CNw4nVwDQiR](https://www.instagram.com/p/CNw4nVwDQiR/) | carousel | architecture | house: cheviots-road-residence |
| 2021-04-16 | [CNuzQl5jhEN](https://www.instagram.com/p/CNuzQl5jhEN/) | carousel | lifestyle |  |
| 2021-04-16 | [CNtzQMOjCG2](https://www.instagram.com/p/CNtzQMOjCG2/) | carousel | property-listing | residence: westcliff-ridge-house |
| 2021-04-14 | [CNpdhiZDJ4h](https://www.instagram.com/p/CNpdhiZDJ4h/) | carousel | property-listing | residence: simbithi-chandelier-house |
| 2021-04-12 | [CNkhK07DP-3](https://www.instagram.com/p/CNkhK07DP-3/) | image | architecture | house: house-sm48 |
| 2021-04-08 | [CNZpV9Vjk_r](https://www.instagram.com/p/CNZpV9Vjk_r/) | carousel | architecture | house: beachy-head |
| 2021-04-07 | [CNXTgDwjd9X](https://www.instagram.com/p/CNXTgDwjd9X/) | carousel | architecture | house: house-boz |
| 2021-04-07 | [CNWfLpHDctK](https://www.instagram.com/p/CNWfLpHDctK/) | image | interior-design | house: steyn-city-underground-lounge |
| 2021-04-03 | [CNNOoo9DLbs](https://www.instagram.com/p/CNNOoo9DLbs/) | image | development | house: bryanston-johan-marais |
| 2021-03-31 | [CNGQITqDFk0](https://www.instagram.com/p/CNGQITqDFk0/) | carousel | architecture | house: old-cape-home-simola |
| 2021-03-30 | [CNCon3lj88C](https://www.instagram.com/p/CNCon3lj88C/) | carousel | development | house: botanica-at-hohenort |
| 2021-03-29 | [CM_sA53D_ZV](https://www.instagram.com/p/CM_sA53D_ZV/) | carousel | architecture | house: steyn-city-house-b |
| 2021-03-28 | [CM9aL-8jQwv](https://www.instagram.com/p/CM9aL-8jQwv/) | carousel | architecture | house: kenyans-cliff-villa |
| 2021-03-24 | [CMy0izLDwou](https://www.instagram.com/p/CMy0izLDwou/) | carousel | architecture | house: umdloti-beach-house |
| 2021-03-23 | [CMwuBY7DDHB](https://www.instagram.com/p/CMwuBY7DDHB/) | image | inspiration |  |
| 2021-03-22 | [CMulBizD7qJ](https://www.instagram.com/p/CMulBizD7qJ/) | carousel | featured-home |  |
| 2021-03-21 | [CMsCqfCDoxK](https://www.instagram.com/p/CMsCqfCDoxK/) | image | lifestyle |  |
| 2021-03-21 | [CMreF6fjI64](https://www.instagram.com/p/CMreF6fjI64/) | carousel | architecture | house: house-benade |
| 2021-03-19 | [CMl465tjL5Z](https://www.instagram.com/p/CMl465tjL5Z/) | carousel | inspiration |  |
| 2021-03-18 | [CMk0j91DeQv](https://www.instagram.com/p/CMk0j91DeQv/) | carousel | property-listing | residence: baronetcy-estate-house |
| 2021-03-18 | [CMj5iigjy1p](https://www.instagram.com/p/CMj5iigjy1p/) | image | lifestyle |  |
| 2021-03-17 | [CMgyKP8DDX9](https://www.instagram.com/p/CMgyKP8DDX9/) | image | architecture | house: steyn-city-axo |
| 2021-03-15 | [CMcNC-rD629](https://www.instagram.com/p/CMcNC-rD629/) | carousel | architecture | house: signature-sibaya-residence |
| 2021-03-15 | [CMbzFV3DvxO](https://www.instagram.com/p/CMbzFV3DvxO/) | carousel | architecture | house: lkg-residence |
| 2021-03-13 | [CMXsePXjM3t](https://www.instagram.com/p/CMXsePXjM3t/) | carousel | property-listing | residence: senderwood-house |
| 2021-03-11 | [CMSl0LADDic](https://www.instagram.com/p/CMSl0LADDic/) | image | architecture | house: victoria-residence |
| 2021-03-09 | [CMNAPPujkjy](https://www.instagram.com/p/CMNAPPujkjy/) | carousel | architecture | house: house-03-hyde-park |
| 2021-03-08 | [CMJUCgHj3lH](https://www.instagram.com/p/CMJUCgHj3lH/) | carousel | architecture | house: corkwood-drive-zimbali |
| 2021-03-05 | [CMCWZYPj5qc](https://www.instagram.com/p/CMCWZYPj5qc/) | carousel | rental |  |
| 2021-03-04 | [CL_R1ckDHB6](https://www.instagram.com/p/CL_R1ckDHB6/) | carousel | property-listing | residence: foreshore-penthouse |
| 2021-03-01 | [CL4I2_tj8e1](https://www.instagram.com/p/CL4I2_tj8e1/) | image | inspiration |  |
| 2021-03-01 | [CL4HibcDhBA](https://www.instagram.com/p/CL4HibcDhBA/) | carousel | development | house: clifton-off-plan-saota |
| 2021-02-28 | [CL1QhMKjtDn](https://www.instagram.com/p/CL1QhMKjtDn/) | carousel | architecture | house: house-280-pearl-valley |
| 2021-02-27 | [CLy4NjJjXgq](https://www.instagram.com/p/CLy4NjJjXgq/) | carousel | lifestyle |  |
| 2021-02-26 | [CLxXG4WDsb4](https://www.instagram.com/p/CLxXG4WDsb4/) | carousel | architecture | house: yne-house |
| 2021-02-25 | [CLuE9ZNDKU3](https://www.instagram.com/p/CLuE9ZNDKU3/) | carousel | architecture | house: sandown-family-house |
| 2021-02-24 | [CLrc73ED3f1](https://www.instagram.com/p/CLrc73ED3f1/) | video | architecture | house: clifton-villa-arrcc |
| 2021-02-23 | [CLoJqqeD7H1](https://www.instagram.com/p/CLoJqqeD7H1/) | image | architecture | house: hartbeespoort-msa |
| 2021-02-21 | [CLi_GwYjrwo](https://www.instagram.com/p/CLi_GwYjrwo/) | carousel | architecture | house: bryanston-svelte |
| 2021-02-18 | [CLcuQ0DDQzd](https://www.instagram.com/p/CLcuQ0DDQzd/) | carousel | architecture | house: la-lucia-seaside-house |
| 2021-02-17 | [CLZMVB-jA6_](https://www.instagram.com/p/CLZMVB-jA6_/) | carousel | architecture | house: house-w-urbis |
| 2021-02-14 | [CLQ8_EmjmyH](https://www.instagram.com/p/CLQ8_EmjmyH/) | carousel | architecture | house: waterberg-retreat |
| 2021-02-12 | [CLLw9TWj44G](https://www.instagram.com/p/CLLw9TWj44G/) | image | lifestyle |  |
| 2021-02-11 | [CLJZcVXDMj-](https://www.instagram.com/p/CLJZcVXDMj-/) | carousel | architecture | house: umhlanga-concept-01 |
| 2021-02-09 | [CLElDXdj02E](https://www.instagram.com/p/CLElDXdj02E/) | image | commercial-partnership |  |
| 2021-02-09 | [CLEIp07jrxH](https://www.instagram.com/p/CLEIp07jrxH/) | carousel | rental |  |
| 2021-02-07 | [CK_NLX9jPgI](https://www.instagram.com/p/CK_NLX9jPgI/) | image | architecture | house: house-t-steyn-city |
| 2021-02-02 | [CKyYDaIDqXw](https://www.instagram.com/p/CKyYDaIDqXw/) | image | architecture | house: morningside-modern-mansion |
| 2021-01-31 | [CKtqjDJDhir](https://www.instagram.com/p/CKtqjDJDhir/) | carousel | inspiration |  |
| 2021-01-31 | [CKtBGK1jP7d](https://www.instagram.com/p/CKtBGK1jP7d/) | image | inspiration |  |
| 2021-01-23 | [CKYaM-Mjdoa](https://www.instagram.com/p/CKYaM-Mjdoa/) | carousel | architecture | house: fresnaye-cantilever-house |
| 2021-01-17 | [CKJD1FcDN_I](https://www.instagram.com/p/CKJD1FcDN_I/) | image | inspiration |  |
| 2021-01-16 | [CKHW3T1j84I](https://www.instagram.com/p/CKHW3T1j84I/) | carousel | architecture | house: kloof-road-house-bedfordview |
| 2021-01-16 | [CKGa7E-DJHG](https://www.instagram.com/p/CKGa7E-DJHG/) | carousel | lifestyle |  |
| 2021-01-15 | [CKEyytSj3wt](https://www.instagram.com/p/CKEyytSj3wt/) | carousel | featured-home |  |
