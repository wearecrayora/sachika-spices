"use client";

import { useState } from "react";
import { cartTotals, lineDetail, useCart } from "@/lib/store";
import { inr } from "@/lib/products";
import ProductMedia from "@/components/product/ProductMedia";

// Demo coupon for the approval build.
const COUPONS: Record<string, number> = { SACHIKA10: 0.1, NUAKHAI15: 0.15 };

export function useCoupon() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const apply = () => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) {
      setApplied(c);
      setError("");
    } else {
      setApplied(null);
      setError("That code doesn't exist. Try SACHIKA10.");
    }
  };
  return { code, setCode, applied, error, apply, rate: applied ? COUPONS[applied] : 0 };
}

export default function OrderSummary({ compact = false, children }: { compact?: boolean; children?: React.ReactNode }) {
  const lines = useCart((s) => s.lines);
  const coupon = useCoupon();
  const base = cartTotals(lines);
  const discount = Math.round(base.subtotal * coupon.rate);
  const t = cartTotals(lines, discount);

  return (
    <div className="sticker rounded-[28px] bg-paper p-6">
      <h2 className="display text-3xl">Order summary</h2>
      {compact && (
        <ul className="mt-5 space-y-3 border-b-2 border-dashed border-ink/30 pb-5">
          {lines.map((l) => {
            const d = lineDetail(l);
            if (!d.product) return null;
            return (
              <li key={l.slug + l.size} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 rounded-lg border border-ink/15 bg-ink">
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <ProductMedia product={d.product} sizes="48px" />
                  </span>
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-cream">{l.qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{d.product.name}</p>
                  <p className="text-xs opacity-60">{l.size}</p>
                </div>
                <p className="text-sm font-bold">{inr(d.total)}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5 flex gap-2">
        <label htmlFor="coupon" className="sr-only">
          Coupon code
        </label>
        <input id="coupon" value={coupon.code} onChange={(e) => coupon.setCode(e.target.value)} placeholder="Coupon code" className="field py-2.5 uppercase" />
        <button onClick={coupon.apply} className="btn btn-gold px-5 py-2.5">
          Apply
        </button>
      </div>
      {coupon.error && <p className="mt-2 text-sm font-semibold text-turmeric-deep">{coupon.error}</p>}
      {coupon.applied && <p className="mt-2 text-sm font-semibold text-cinnamon">{coupon.applied} applied — you saved {inr(discount)}</p>}

      <dl className="mt-6 space-y-2.5">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{inr(t.subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-cinnamon">
            <dt>Discount</dt>
            <dd className="font-semibold">−{inr(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="font-semibold">{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd>
        </div>
        <div className="flex items-end justify-between border-t border-ink/15 pt-4">
          <dt className="font-bold">Total</dt>
          <dd className="display text-4xl">{inr(t.total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
