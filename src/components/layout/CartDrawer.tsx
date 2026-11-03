"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FREE_SHIPPING_AT, cartTotals, lineDetail, useCart, useUI } from "@/lib/store";
import { inr } from "@/lib/products";
import ProductMedia from "@/components/product/ProductMedia";
import QtyStepper from "@/components/ui/QtyStepper";
import { CloseIcon } from "@/components/ui/Icons";

export default function CartDrawer() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const { cartOpen, setCart } = useUI();
  const { lines, setQty, remove } = useCart();
  const t = cartTotals(lines);
  const toFree = Math.max(0, FREE_SHIPPING_AT - t.subtotal);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(q("[data-scrim]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(q("[data-panel]"), { xPercent: 105, rotation: 4 }, { xPercent: 0, rotation: 0, duration: 0.9, transformOrigin: "100% 100%" }, 0);
    },
    { scope: root },
  );

  useGSAP(() => {
    if (!tl.current) return;
    if (cartOpen) {
      tl.current.timeScale(1).play();
      gsap.fromTo("[data-cart-line]", { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.06, delay: 0.25, duration: 0.7 });
    } else tl.current.timeScale(1.8).reverse();
  }, [cartOpen]);

  return (
    <div ref={root} className="invisible fixed inset-0 z-[60]" aria-hidden={!cartOpen}>
      <button data-scrim className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={() => setCart(false)} aria-label="Close bag" tabIndex={-1} />
      <aside
        data-panel
        role="dialog"
        aria-label="Your bag"
        className="absolute bottom-0 right-0 top-0 flex w-full max-w-[460px] flex-col border-l border-ink/15 bg-cream"
      >
        <div className="flex items-center justify-between border-b border-ink/15 p-5">
          <h2 className="display text-4xl">Your bag</h2>
          <button onClick={() => setCart(false)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-paper transition hover:rotate-90" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-ink/15 bg-gold px-5 py-3 text-sm font-semibold">
          {toFree > 0 ? (
            <>Add <b>{inr(toFree)}</b> more for free delivery across India</>
          ) : (
            <>You&apos;ve unlocked free delivery. Dhanyabad!</>
          )}
          <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-ink/15 bg-cream">
            <div className="h-full bg-turmeric transition-[width] duration-700" style={{ width: `${Math.min(100, (t.subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="display text-3xl">The bag is empty.</p>
              <p className="mt-2 max-w-xs opacity-70">The masala dabba at home is looking a little empty. Go fill it.</p>
              <Link href="/shop" onClick={() => setCart(false)} className="btn mt-6">
                Browse the spices
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => {
                const d = lineDetail(l);
                if (!d.product) return null;
                return (
                  <li key={l.slug + l.size} data-cart-line className="flex gap-4 rounded-2xl border border-ink/15 bg-paper p-3">
                    <Link href={`/shop/${l.slug}`} onClick={() => setCart(false)} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-ink/15 bg-ink">
                      <ProductMedia product={d.product} sizes="80px" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-bold leading-tight">{d.product.name}</p>
                          <p className="text-sm opacity-60">{l.size}</p>
                        </div>
                        <p className="font-bold">{inr(d.total)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <QtyStepper value={l.qty} onChange={(q) => setQty(l.slug, l.size, q)} small />
                        <button onClick={() => remove(l.slug, l.size)} className="text-sm font-semibold underline underline-offset-4 opacity-60 hover:opacity-100">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="space-y-3 border-t border-ink/15 p-5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-bold">{inr(t.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span className="font-bold">{t.shipping === 0 ? "Free" : inr(t.shipping)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/cart" onClick={() => setCart(false)} className="btn btn-cream">
                View bag
              </Link>
              <Link href="/checkout" onClick={() => setCart(false)} className="btn">
                Checkout · {inr(t.total)}
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
