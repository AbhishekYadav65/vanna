# Vannam

Handmade quilted pouches from Coimbatore. React + Vite + TypeScript, no backend.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
```

## How the design is wired

- **Colour clash**: `src/data/visuals.ts` gives every pouch a ground colour that contrasts with it, plus the size of its cut-out image. Cards, the 3D curve, the hero, the press-preview and the bag all read from it.
- **Cut-outs**: `public/cutouts/*.webp` are the studio photos with the white background removed and a sticker outline added. `scripts/make_cutouts.py` regenerates them.
- **Navigation**: `components/BloomNav.tsx`. A single bloom button; tap it and the petals fan out as the menu. There is no navbar.
- **3D curve**: `components/ArcCarousel.tsx`. Drag, swipe, sideways scroll, arrow keys or buttons.
- **Search**: `lib/search.ts` ranks by name, tags, category, fabric and description, with synonyms and typo tolerance. Enter in the search overlay opens `/search?q=…`.
- **Press and hold** a product (phone, or hold the mouse for about half a second): `lib/usePressPreview.ts` + `components/PressPreview.tsx`.
- **Petals on add to bag**: `lib/petals.ts`.

## Adding a product

1. Add it to `public/products.json` and `src/data/products.ts` (studio photo first in `images`).
2. Run `python scripts/make_cutouts.py`.
3. Add its ground colour and cut-out ratio to `src/data/visuals.ts`.
