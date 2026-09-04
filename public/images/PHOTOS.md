# Photography

All twenty photos are in place and wired to the layout by filename. Replacing
any of them means dropping a new file over the old one — no code changes.

| File | Used for |
|---|---|
| `../brand/logo.png` | Navbar and footer wordmark |
| `exterior-storefront.png` | **Hero**, gallery, Open Graph card, JSON-LD |
| `cappuccino-latte-art.jpg` | Signature #1, featured Coffee card, gallery, Instagram grid |
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

## Source sizes

The originals are large (3000–6720px, up to 3.2 MB). That's fine — `next/image`
generates resized AVIF/WebP variants on demand and never serves the original.
Don't pre-shrink them; the large source is what makes the retina crops sharp.
