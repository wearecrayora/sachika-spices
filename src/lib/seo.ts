import type { Metadata } from "next";

export const SITE = {
  name: "Sachika Spices",
  tagline: "Pure spices, finely ground",
  description:
    "Premium Indian spices from Sachika Spices — turmeric, chilli, coriander and cumin powders, maize and millet flours. Cleaned, slow-ground and sealed fresh, delivered across India.",
  url: siteUrl(),
  locale: "en_IN",
};

/*
  Absolute base for og:url, canonical links and share-image URLs.
  Set NEXT_PUBLIC_SITE_URL once the domain is live; until then Vercel's own
  URLs are used, so preview links still unfurl with working images.
*/
function siteUrl() {
  const env = process.env;
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL;
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return `http://localhost:${env.PORT ?? 3000}`;
}

// The site-wide share image: the Sachika logo and pouch range on cream (app/opengraph-image.png).
// Pages that set their own openGraph object lose the inherited one, and an explicit
// image also beats a route's own opengraph-image file, so pages with their own card
// (products) pass it as `image`.
const DEFAULT_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sachika Spices logo with the turmeric, chilli, cumin, maize and coriander pouches" };

/*
  Per-page title/description for <head>, Open Graph and Twitter cards.
  Page-level openGraph replaces the layout's object wholesale, so every page
  that sets its own copy goes through here to keep siteName/locale/type.
*/
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: { url: string; alt: string; width?: number; height?: number };
}): Metadata {
  const card = { width: 1200, height: 630, ...image };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${SITE.name}`,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
      images: [card],
    },
  };
}
