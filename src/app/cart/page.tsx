"use client";

import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { FREE_SHIPPING_AT, cartTotals, lineDetail, useCart, useCartHydrated, type CartLine } from "@/lib/store";
import { inr, products } from "@/lib/products";
import ProductMedia from "@/components/product/ProductMedia";
import ProductCard from "@/components/product/ProductCard";
import QtyStepper from "@/components/ui/QtyStepper";
import OrderSummary from "@/components/cart/OrderSummary";
import { Skeleton, useSkeletonCapture } from "@/components/ui/Skeleton";
import { CloseIcon } from "@/components/ui/Icons";

// What the skeleton capture renders, since the bag is empty during `npm run bones`.
const SAMPLE_LINES: CartLine[] = [
  { slug: "turmeric-powder", size: "100 g", qty: 1 },
  { slug: "chilli-powder", size: "100 g", qty: 2 },
];

function CartBody({ lines }: { lines: CartLine[] }) {
  const { setQty, remove } = useCart();
  const t = cartTotals(lines);
  const toFree = Math.max(0, FREE_SHIPPING_AT - t.subtotal);

  const removeLine = (slug: string, size: string, el: HTMLElement) => {
    gsap.to(el, { x: 120, rotation: 6, autoAlpha: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, duration: 0.5, ease: "power3.in", onComplete: () => remove(slug, size) });
  };

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="mb-6 rounded-2xl border border-ink/15 bg-gold p-4 font-semibold">
          {toFree > 0 ? <>You&apos;re {inr(toFree)} away from free delivery.</> : <>Free delivery unlocked.</>}
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-ink/15 bg-cream">
            <div className="h-full bg-turmeric transition-[width] duration-700" style={{ width: `${Math.min(100, (t.subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
          </div>
        </div>
        <ul className="space-y-4">
          {lines.map((l) => {
            const d = lineDetail(l);
            if (!d.product) return null;
            return (
              <li key={l.slug + l.size} className="flex gap-4 overflow-hidden rounded-3xl border border-ink/15 bg-paper p-4 md:gap-6">
                <Link href={`/shop/${l.slug}`} className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl border border-ink/15 bg-ink md:h-40 md:w-36">
                  <ProductMedia product={d.product} sizes="144px" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="odia text-sm text-cinnamon">{d.product.odia}</p>
                      <Link href={`/shop/${l.slug}`} className="text-xl font-bold leading-tight hover:underline">{d.product.name}</Link>
                      <p className="text-sm opacity-60">{l.size} · {inr(d.size?.price ?? 0)} each</p>
                    </div>
                    <button
                      onClick={(e) => removeLine(l.slug, l.size, e.currentTarget.closest("li")!)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition hover:rotate-90 hover:bg-turmeric hover:text-cream"
                      aria-label={`Remove ${d.product.name}`}
                    >
                      <CloseIcon width={16} height={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <QtyStepper value={l.qty} onChange={(q) => setQty(l.slug, l.size, q)} small />
                    <p className="display text-2xl">{inr(d.total)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <OrderSummary>
          <Link href="/checkout" className="btn mt-6 w-full py-4 text-base">
            Checkout securely
          </Link>
          <p className="mt-3 text-center text-xs opacity-60">UPI · Cards · Net banking · Cash on delivery</p>
        </OrderSummary>
      </div>
    </div>
  );
}

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCartHydrated();
  const capture = useSkeletonCapture();
  const t = cartTotals(lines);
  const suggestions = products.filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 4);

  return (
    <>
      <section className="wrap pb-16 pt-[calc(var(--header-h)+3rem)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 data-split className="display text-[16vw] md:text-[7vw]">
            Your bag
          </h1>
          <p className="mb-3 font-semibold">{hydrated ? `${t.count} item${t.count === 1 ? "" : "s"}` : " "}</p>
        </div>

        {!hydrated || capture ? (
          // The bag is read from localStorage after hydration; shimmer instead of flashing "empty".
          <Skeleton name="cart-page" loading fixture={<CartBody lines={SAMPLE_LINES} />}>
            {null}
          </Skeleton>
        ) : lines.length === 0 ? (
          <div className="py-20 text-center">
            <p className="display text-4xl md:text-6xl">Empty bag, empty dabba.</p>
            <p className="mx-auto mt-4 max-w-md text-lg opacity-70">Start with a pouch of Turmeric Powder — it&apos;s what everyone orders first.</p>
            <Link href="/shop" className="btn mt-8">Browse the spices</Link>
          </div>
        ) : (
          <CartBody lines={lines} />
        )}
      </section>

      <section className="wrap pb-28">
        <h2 data-split className="display mb-10 text-[11vw] md:text-6xl">
          Room for one more?
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {suggestions.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
