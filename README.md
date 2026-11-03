# Sachika Spices storefront (Phase 1 prototype)

Frontend-only prototype of the Sachika Spices online store — a premium Odia spice maker (turmeric, chilli, coriander, cumin, maize and millet). No backend: bag, wishlist and checkout run in the browser for client review.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages prerender statically)
```

## Where things live

| What | Where |
| --- | --- |
| Catalogue, categories, festivals, contact details | `src/lib/products.ts` |
| Product photos (from the client's product renders) | `public/products/<product>/1.webp…` |
| Logos (full logo, cream version for dark backgrounds, emblem) | `public/brand/` |
| Bag / wishlist / UI state | `src/lib/store.ts` (Zustand, persisted to localStorage) |
| Design tokens (palette, fonts) | `src/app/globals.css` |
| Preloader, header, menu, bag drawer, search, footer | `src/components/layout/` |
| Declarative scroll animations (`data-split`, `data-reveal`, `data-speed`, `data-pop`) | `src/components/layout/PageShell.tsx` |

## Link previews (Open Graph)

- Site-wide image: the Sachika logo above the five pouches on cream, `src/app/opengraph-image.png` (static, 1200×630).
- One card per product: `src/app/shop/[slug]/opengraph-image.tsx`, rendered with `next/og` and re-encoded to JPEG (~100 KB) so WhatsApp shows them.
- Fonts and images for the cards live in `assets/` (Satori needs TTF + PNG/JPEG).
- Per-page titles/descriptions go through `pageMeta()` in `src/lib/seo.ts`.
- Set `NEXT_PUBLIC_SITE_URL=https://sachikaspices.com` in production. Without it, Vercel deployment URLs (or localhost) are used.
- Favicon and app icons: `src/app/favicon.ico`, `icon.png`, `apple-icon.png`, `public/icon-*.png`, `src/app/manifest.ts`.

## Skeleton loading (boneyard-js)

Skeletons are captured from the real UI, so they match the layout exactly:

- `product-card`: while a product photo downloads
- `cart-page`, `wishlist-grid`, `checkout`: while the saved bag loads from the browser
- `page-hero`, `shop-grid`, `product-page`: route `loading.tsx` screens

After changing any of those layouts, start the dev server and re-capture:

```bash
npm run dev
npm run bones -- http://localhost:3000 --force
```

This writes `src/bones/*.bones.json` + `registry.ts` (commit them). Colours live in `boneyard.config.json`. The CLI needs a Chromium: `npx playwright install chromium`, or pass `--cdp <port>` to reuse a running Chrome.

## Placeholder data

Every price, rating, review, testimonial and stat is a placeholder (only the 100 g pack size is printed on the pouches). The three gift boxes are proposed bundles. **Contact details are placeholders** — phone, WhatsApp, email, address and social links in `CONTACT` (`src/lib/products.ts`) must be replaced before launch.

## Stack

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, Flip), Lenis, Zustand.
