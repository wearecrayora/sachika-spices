"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { inr, type IngredientKind } from "@/lib/products";
import Ingredient from "@/components/art/Ingredient";

const RAIN: IngredientKind[] = ["turmeric", "sparkle", "chilli", "coriander", "sparkle", "cumin", "maize", "staranise", "sparkle", "millet", "leaf", "sparkle"];

type Order = { id: string; total: number; count: number; pay: string };

export default function SuccessPage() {
  const root = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sachika-last-order");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage after mount
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // Ingredients rain down and bounce — a celebratory "confetti" in brand terms.
      q("[data-rain]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: -window.innerHeight * gsap.utils.random(0.4, 1.2), x: 0, rotation: gsap.utils.random(-180, 180) },
          { y: window.innerHeight * 1.2, x: gsap.utils.random(-80, 80), rotation: gsap.utils.random(-360, 360), duration: gsap.utils.random(2.4, 4), ease: "power1.in", delay: 0.6 + i * 0.08, repeat: 1, repeatDelay: gsap.utils.random(0, 1.5) },
        );
      });
      gsap.from(q("[data-stamp]"), { scale: 3, rotation: -40, autoAlpha: 0, duration: 0.9, ease: "back.out(1.8)", delay: 0.9 });
    },
    { scope: root },
  );

  const steps = ["Order placed", "Packed with care", "Out for delivery", "At your door"];

  return (
    <div ref={root} className="relative min-h-[100svh] overflow-hidden bg-turmeric pb-24 pt-[calc(var(--header-h)+4rem)] text-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {RAIN.map((k, i) => (
          <div key={i} data-rain className="absolute top-0 w-12 md:w-16" style={{ left: `${(i * 8.3) % 96}%` }}>
            <Ingredient kind={k} className="w-full" />
          </div>
        ))}
      </div>

      <div className="wrap relative text-center">
        <p className="odia text-4xl text-gold md:text-5xl">ଧନ୍ୟବାଦ</p>
        <h1 data-split className="display mx-auto mt-2 max-w-[12ch] text-[17vw] md:text-[8vw]">
          Order placed!
        </h1>
        <p data-reveal className="mx-auto mt-6 max-w-lg text-lg md:text-xl">
          Dhanyabad. Your spices are being packed at the Sachika unit. We&apos;ve sent a confirmation to your phone and email.
        </p>

        <div data-reveal className="mx-auto mt-12 max-w-xl rounded-[32px] border border-ink/15 bg-cream p-6 text-left text-ink shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow opacity-60">Order number</p>
              <p className="display text-3xl md:text-4xl">{order?.id ?? "SCK000000"}</p>
            </div>
            <span data-stamp className="shrink-0 -rotate-12 rounded-full border-4 border-turmeric px-3 py-1.5 text-xs font-extrabold uppercase text-turmeric md:px-4 md:py-2 md:text-sm">
              Confirmed
            </span>
          </div>
          {order && (
            <p className="mt-2 text-sm opacity-70">
              {order.count} item{order.count === 1 ? "" : "s"} · {inr(order.total)} · {order.pay.toUpperCase()}
            </p>
          )}
          <ol className="mt-8 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {steps.map((s, i) => (
              <li key={s}>
                <span className={`mx-auto mb-2 block h-4 w-4 rounded-full border border-ink/15 ${i === 0 ? "bg-turmeric" : "bg-paper"}`} />
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/track-order" className="btn btn-cream">Track order</Link>
          <Link href="/shop" className="btn btn-ink">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}
