"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowIcon } from "@/components/ui/Icons";

// Placeholder figures for the approval build — confirm with the client.
const STATS = [
  { n: 100, suffix: "%", label: "natural, single-origin spices" },
  { n: 0, suffix: "", label: "added colours or fillers" },
  { n: 6, suffix: "", label: "signature grinds" },
  { n: 48, suffix: "h", label: "from grinding to sealing" },
];

/* The brand spotlight: the gold emblem turns into place, a real product shot pinned beside it. */
export default function Standard() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-logo]"),
        { rotation: -40, scale: 0.75 },
        { rotation: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 1 } },
      );
      gsap.to(q("[data-ring]"), { rotation: 360, duration: 60, ease: "none", repeat: -1 });
      gsap.fromTo(
        q("[data-photo]"),
        { rotation: 8, yPercent: 30 },
        { rotation: -4, yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      q("[data-stat]").forEach((el) => {
        const target = Number((el as HTMLElement).dataset.stat);
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-IN")),
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-24 text-cream md:py-36">
      <div className="wrap grid items-center gap-14 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-[78%] max-w-[520px]">
          <div data-ring className="absolute inset-[-8%] rounded-full border border-dashed border-gold/40" />
          <div className="absolute inset-[4%] rounded-full bg-cinnamon/40" />
          <div data-logo className="relative h-full w-full p-[14%]">
            <div className="relative h-full w-full">
              <Image src="/brand/sachika-mark.png" alt="The Sachika Spices emblem" fill sizes="(min-width: 768px) 32vw, 64vw" className="object-contain" />
            </div>
          </div>
          {/* a real product shot, pinned on like a photo */}
          <figure data-photo className="absolute -bottom-10 -right-6 w-[46%] rounded-lg bg-paper p-1.5 pb-6 text-ink shadow-[0_30px_60px_-28px_rgba(0,0,0,0.8)] md:-right-12">
            <span className="relative block aspect-square overflow-hidden rounded">
              <Image src="/products/turmeric-powder/2.webp" alt="Sachika turmeric, chilli and coriander powders on a kitchen table" fill sizes="20vw" className="object-cover" />
            </span>
            <figcaption className="absolute inset-x-0 bottom-1 text-center text-[11px] font-bold">Sealed fresh, every batch</figcaption>
          </figure>
        </div>

        <div>
          <p className="eyebrow mb-4 text-gold">The Sachika standard</p>
          <h2 data-split className="display text-[13vw] md:text-[5.6vw]">
            Ground slow. <i className="text-gold">Sealed fresh.</i>
          </h2>
          <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed opacity-85 md:text-xl">
            We buy whole crops, never pre-ground powder. Every lot is cleaned, sun-dried and slow-ground in small batches so the oils that carry flavour and aroma don&apos;t burn off — then sealed in light-proof pouches the same day.
          </p>
          <p data-reveal className="odia mt-4 text-2xl text-gold">ଶୁଦ୍ଧ ମସଲା, ଶୁଦ୍ଧ ସ୍ୱାଦ</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-cream/15 pt-8">
            {STATS.map((s) => (
              <div key={s.label} data-reveal>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block whitespace-nowrap text-[2.75rem] leading-none text-gold md:text-5xl">
                    <span data-stat={s.n}>0</span>
                    {s.suffix}
                  </span>
                  <span className="mt-1 block text-sm opacity-70">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Link data-reveal href="/process" className="btn btn-gold mt-10">
            See how it&apos;s made <ArrowIcon width={18} height={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
