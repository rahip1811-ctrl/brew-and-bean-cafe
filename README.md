# Brew and Bean Cafe

Marketing site for a specialty coffee house on Sindhu Bhavan Road, Ahmedabad.
Built to live in an Instagram bio and a Google Business listing — so it is
mobile-first, fast, and structured for local search.

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind v4 (CSS-first tokens in `src/app/globals.css`) |
| Animation | `motion` (Framer Motion) + Lenis for desktop smooth scroll |
| Type | Fraunces (display) + Inter (body), via `next/font` |

Two routes, both statically prerendered: `/` and `/menu`.

## Where things live

```
src/
  lib/
    site.ts          Every real-world fact: address, hours, phone, socials.
                     Also generates the schema.org opening hours.
    menu.ts          The full menu + the three signature items.
    submissions.ts   The seam between the forms and a future backend.
  components/        One file per section, plus the shared chrome.
  app/
    layout.tsx       Fonts, metadata, JSON-LD, navbar/footer/action bar.
    page.tsx         The landing page — sections in order.
    menu/page.tsx    The full menu.
public/
  brand/logo.png     The wordmark. Inverted with CSS for dark surfaces.
  images/            All photography. See PHOTOS.md.
```

### Design tokens

The palette is derived from the café's own photographs — bone-white plaster,
travertine, cane, terracotta — not from a generic "coffee brown" scheme. Cream
dominates, brown is text and dark sections, and terracotta is the accent used
sparingly. All tokens are defined once in `globals.css` under `@theme`.

| Token | Hex | Role |
|---|---|---|
| `plaster` | `#f7f2e9` | Page background |
| `limewash` | `#efe6d8` | Alternating sections |
| `travertine` | `#e7dcca` | Cards, the newsletter band |
| `bean` | `#402316` | Headings, dark sections — taken from the logo |
| `ink` | `#2b211a` | Body text |
| `clay` | `#8a7360` | Secondary text |
| `terracotta` | `#c2643e` | Accent, hover states |
| `brass` | `#b08d57` | Hairlines and small-caps labels only |
| `palm` | `#5f6f52` | The vegetarian mark, the "open now" dot |

## Things worth knowing before you change something

**Editing café details.** Address, phone, hours and social handles all come
from `src/lib/site.ts`. Changing an opening hour there updates the page copy,
the live open/closed badge, and the structured data Google reads — they cannot
drift apart.

**The phone number is a placeholder.** `+91 98795 40118` is fictional, and every
Indian mobile range is live. Replace it in `site.ts` before publishing.

**The open/closed badge is client-side on purpose.** It depends on the current
time in `Asia/Kolkata`, so rendering it on the server would cause a hydration
mismatch. The server emits a neutral placeholder of the same size and the real
state is filled in after mount, then refreshed every minute.

**The hero curtain is CSS, not Motion.** Everything else animates with Motion,
but the hero opens with an opaque curtain over the photograph. If that one
animation were JavaScript-driven and got throttled or failed, a visitor
arriving from Instagram would see a black screen. A CSS animation with
`forwards` always completes. See `.hero-curtain` in `globals.css`.

**Lenis is desktop-only.** On a touch device it replaces the OS's own momentum
scrolling with a worse JavaScript approximation and costs frame budget. It is
also disabled entirely under `prefers-reduced-motion`.

**The forms don't submit anywhere yet.** `src/lib/submissions.ts` validates
input, pauses so the pending state is visible, and resolves. To wire it to
Supabase (or Resend, or a sheet), replace the bodies of `submitReservation` and
`subscribe`. No component needs to change.

**The map needs no API key.** It is a plain Google Maps `output=embed` iframe —
free, with no billing account attached.

## Deploying

Push to a Git remote and import into Vercel; no environment variables are
needed as it stands. Before going live:

1. Replace the placeholder phone number in `src/lib/site.ts`.
2. Point `site.url` at the real domain (metadata and JSON-LD both use it).
3. Deal with the two photo issues described in `public/images/PHOTOS.md`.
4. Wire the two forms to a real destination.
