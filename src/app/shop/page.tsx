import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import ShopGrid from "@/components/shop/ShopGrid";
import { products } from "@/lib/products";

export const metadata: Metadata = pageMeta({
  title: "Shop the spices",
  description: "Turmeric, chilli, coriander and cumin powders, maize and millet flours, and festival gift boxes from Sachika Spices. Free delivery over ₹799.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <PageHero
        kicker="The full range"
        title="The spice rack"
        odia="ମସଲା"
        intro="Turmeric, chilli, coriander and cumin, stone-ground maize and mandia, and festival gift boxes — every Sachika grind on one shelf. Free delivery over ₹799."
        ingredients={["turmeric", "sparkle", "chilli"]}
      />
      <section className="wrap pb-28 pt-0">
        {/* Captured as the "shop-grid" skeleton shown by the shop/collection loading.tsx */}
        <ShopGrid items={products} skeletonName="shop-grid" />
      </section>
    </>
  );
}
