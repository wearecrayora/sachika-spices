"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, isFinePointer } from "@/lib/gsap";
import { TURMERIC, INK, CINNAMON, inr, photosOf, type Product } from "@/lib/products";
import { useCart, useUI } from "@/lib/store";
import Ingredient from "@/components/art/Ingredient";
import ProductMedia from "./ProductMedia";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeartIcon, PlusIcon } from "@/components/ui/Icons";

export const darkStage = (c: string) => c === INK || c === CINNAMON || c === TURMERIC;

// Where the three ingredients burst to on hover (percent of their own size).
const BURST = [
  { x: -120, y: -110, r: -30 },
  { x: 130, y: -90, r: 35 },
  { x: 120, y: 110, r: 60 },
];

export default function ProductCard({ product, priority = false, className = "" }: { product: Product; priority?: boolean; className?: string }) {
  const card = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.slug));
  const showToast = useUI((s) => s.showToast);
  const size = product.sizes[0];
  const hasAlt = photosOf(product).length > 1;
  const [ready, setReady] = useState(false);

  const enter = (e: React.PointerEvent) => {
    if (!isFinePointer()) return;
    const q = gsap.utils.selector(card);
    const r = card.current!.querySelector("[data-frame]")!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    // Second photo wipes in as a circle from wherever the cursor entered.
    if (hasAlt) gsap.fromTo(q("[data-alt]"), { clipPath: `circle(0% at ${x}% ${y}%)` }, { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.9, ease: "expo.out" });
    gsap.to(q("[data-frame]"), { rotation: -1.5, y: -6, duration: 0.6, ease: "back.out(2)" });
    q("[data-ing]").forEach((el, i) =>
      gsap.to(el, { xPercent: BURST[i].x, yPercent: BURST[i].y, rotation: BURST[i].r, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2)", delay: i * 0.04 }),
    );
  };
  const leave = () => {
    if (!isFinePointer()) return;
    const q = gsap.utils.selector(card);
    if (hasAlt) gsap.to(q("[data-alt]"), { clipPath: "circle(0% at 50% 50%)", duration: 0.6, ease: "power3.inOut" });
    gsap.to(q("[data-frame]"), { rotation: 0, y: 0, duration: 0.6 });
    gsap.to(q("[data-ing]"), { xPercent: 0, yPercent: 0, rotation: 0, scale: 0.3, autoAlpha: 0, duration: 0.45, ease: "power3.in" });
  };

  const quickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    add(product.slug, size.label);
    showToast(`${product.name} · ${size.label} added`);
    gsap.fromTo(e.currentTarget, { rotation: 0, scale: 0.8 }, { rotation: 180, scale: 1, duration: 0.6, ease: "back.out(3)" });
    gsap.fromTo(card.current!.querySelector("[data-frame]"), { y: 0 }, { y: -18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
  };

  const body = (
    <>
      <div className="relative">
        {/* ingredients tucked behind the frame, popping out on hover */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
          {product.ingredientsArt.map((k, i) => (
            <div key={i} data-ing className="invisible absolute w-[24%] scale-[0.3] opacity-0">
              <Ingredient kind={k} className="w-full" />
            </div>
          ))}
        </div>

        <Link href={`/shop/${product.slug}`} data-cursor="View" className="relative block" tabIndex={-1} aria-hidden>
          <div
            data-frame
            className="relative rounded-[28px] border border-ink/15 p-2 transition-shadow duration-300 group-hover:shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]"
            style={{ background: product.stage }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-ink/15 bg-ink">
              <ProductMedia product={product} priority={priority} onReady={() => setReady(true)} />
              {hasAlt && (
                <div data-alt className="absolute inset-0" style={{ clipPath: "circle(0% at 50% 50%)" }}>
                  <ProductMedia product={product} index={1} />
                </div>
              )}
            </div>
          </div>
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-4 top-4 -rotate-6 rounded-full border border-ink/15 bg-cream px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-ink">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => toggleWish(product.slug)}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition ${wished ? "bg-turmeric text-cream" : "bg-cream text-ink"}`}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
        >
          <HeartIcon filled={wished} width={18} height={18} />
        </button>
        <button
          onClick={quickAdd}
          className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-gold text-ink shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)] transition hover:bg-turmeric hover:text-cream"
          aria-label={`Add ${product.name} ${size.label} to bag`}
        >
          <PlusIcon />
        </button>
      </div>

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="mt-3 flex items-start justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="odia truncate text-xs text-cinnamon">{product.odia}</p>
            <h3 className="line-clamp-2 text-base font-bold leading-tight md:text-lg">{product.name}</h3>
            <p className="truncate text-sm opacity-60">{product.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-extrabold">{inr(size.price)}</p>
            {size.mrp > size.price && <p className="text-xs line-through opacity-45">{inr(size.mrp)}</p>}
            <p className="text-xs opacity-60">{size.label}</p>
          </div>
        </div>
      </Link>
    </>
  );

  // Shimmer until the photo arrives. The real card is the server-rendered
  // fallback, so names and prices are in the HTML before hydration.
  return (
    <div ref={card} className={`group relative ${className}`} onPointerEnter={enter} onPointerLeave={leave}>
      <Skeleton name="product-card" loading={!ready} fallback={body}>
        {body}
      </Skeleton>
    </div>
  );
}
