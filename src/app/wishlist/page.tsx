"use client";

import Link from "next/link";
import { useCart, useCartHydrated } from "@/lib/store";
import { getProduct, products, type Product } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Ingredient from "@/components/art/Ingredient";
import { Skeleton, useSkeletonCapture } from "@/components/ui/Skeleton";

function Grid({ items }: { items: Product[] }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const wishlist = useCart((s) => s.wishlist);
  const hydrated = useCartHydrated();
  const capture = useSkeletonCapture();
  const items = wishlist.map(getProduct).filter((p) => !!p);

  return (
    <div className="wrap pb-28 pt-[calc(var(--header-h)+3rem)]">
      <p className="eyebrow mb-3 text-turmeric">Saved for later</p>
      <h1 data-split className="display text-[16vw] md:text-[7vw]">
        Wishlist
      </h1>
      {!hydrated || capture ? (
        // Saved items come from localStorage after hydration; the fixture is what `npm run bones` captures.
        <Skeleton name="wishlist-grid" loading fixture={<Grid items={products.slice(0, 4)} />}>
          {null}
        </Skeleton>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <Ingredient kind="sparkle" className="mx-auto w-20" />
          <p className="display mt-6 text-4xl">Nothing saved yet.</p>
          <p className="mx-auto mt-3 max-w-sm opacity-70">Tap the heart on anything you like the look of. We&apos;ll keep it here for you.</p>
          <Link href="/shop" className="btn mt-8">Find something</Link>
        </div>
      ) : (
        <Grid items={items} />
      )}
    </div>
  );
}
