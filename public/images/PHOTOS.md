# Photography

All photos are in place and wired to the layout by filename. Replacing any of
them means dropping a new file over the old one — no code changes.

| File | Used for |
|---|---|
| `../brand/logo.png` | Navbar and footer wordmark |
| `exterior-storefront.png` | **Hero**, gallery, Open Graph card, JSON-LD |
| `cappuccino-latte-art.jpg` | Signature #1, featured Coffee card, gallery, Instagram grid |
| `honey-cinnamon-latte.jpg` | Featured Coffee card — Honey Cinnamon Latte ⚠️ low-res |
| `filter-kaapi.jpg` | Featured Coffee card — Filter Kaapi ⚠️ low-res |
| `signature-cream-croissant.jpg` | Signature #2, featured Pastries card, Instagram grid |
| `table-spread-cheesecake.jpg` | Signature #3, featured Tea card, Instagram grid |
| `bar-counter-grinders.jpg` | Café Experience — Coffee, `/menu` header |
| `pourover-v60.jpg` | Café Experience — Fresh |
| `terrace-rattan-pots.jpg` | Café Experience — Space, gallery, Instagram grid |
| `barista-at-work.jpg` | Our Story (main portrait), gallery |
| `roastery-beans.jpg` | Our Story (inset frame) |
| `interior-banquette.jpg` | Reservation section, gallery |
| `niche-wall-wide.jpg` | Gallery |
| `plaster-niche-stairs.jpg` | Gallery, Instagram grid |
| `niche-wall-cane-chairs.jpg` | Gallery |
| `interior-plants-mirror.jpg` | Gallery |
| `window-arch-interior.jpg` | Gallery |
| `bar-shelf-cups.jpg` | Gallery, Instagram grid |
| `pastries-danish-spread.jpg` | Featured Desserts card, gallery |
| `croissants-coffee.jpg` | Featured Breakfast card |

## Two things to fix before this goes public

### 1. Watermarked stock previews

Four files are unlicensed iStock comps and will render with the watermark
visible:

- `croissants-coffee.jpg` (iStock 1001971972)
- `roastery-beans.jpg` (iStock 2243130936)
- `pourover-v60.jpg` (iStock 2218046452)
- `latte-art-pour.jpg` (iStock 2204615614) — currently unused

They need licensed copies, or replacements. Two of them sit in prominent
places: `pourover-v60.jpg` is one of the three Café Experience cards, and
`roastery-beans.jpg` is the inset frame in Our Story.

### 2. Other cafés' branding is visible

- `table-spread-cheesecake.jpg` — "PACUA COFFEE & BAKERY" printed across the
  napkins. This one is a **signature card**, shown large.
- `pastries-danish-spread.jpg` — "Wright's" on both cup sleeves.
- `bar-shelf-cups.jpg` — "BORDERLINE" coffee bags along the top shelf.

A competitor's name on your own café's website is worth avoiding. Either crop
it out or swap these three for shots without third-party branding.

### 3. Two menu photos are too small

The menu cards render at roughly 400px wide, which needs an ~800px source to
stay sharp on a phone or a retina screen. These two are well under that:

- `honey-cinnamon-latte.jpg` — **388 × 515**. Worst affected: it is portrait,
  so cropping to the card's 4:3 frame throws away most of the height and leaves
  roughly 388 × 291 to stretch across an 800px slot. Expect visible softness.
- `filter-kaapi.jpg` — **678 × 452**. Close enough to pass at 1x, slightly soft
  on a retina display.

Both work and look correct in the layout; they are just not crisp. Higher-
resolution versions dropped over the same filenames need no code change. A
landscape or square crop of the latte would help as much as more pixels.

## Source sizes

The originals are large (3000–6720px, up to 3.2 MB). That's fine — `next/image`
generates resized AVIF/WebP variants on demand and never serves the original.
Don't pre-shrink them; the large source is what makes the retina crops sharp.
