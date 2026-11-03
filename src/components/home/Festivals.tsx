"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CREAM, INK, GOLD, festivals, getProduct } from "@/lib/products";
import PackShot from "@/components/product/PackShot";
import { ArrowIcon } from "@/components/ui/Icons";

/* Accordion of festival panels — the open one swells, the rest stay as spines. */
export default function Festivals() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-fest]"), {
        y: 120,
        rotation: (i) => (i - 1) * 4,
        stagger: 0.1,
        duration: 1.2,
        scrollTrigger: { trigger: q("[data-fest-row]")[0], start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.fromTo(`[data-fest-body="${open}"] [data-fest-anim]`, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.8, delay: 0.15 });
      gsap.fromTo(`[data-fest-body="${open}"] [data-fest-art]`, { scale: 0.5, rotation: -25 }, { scale: 1, rotation: -8, duration: 1, ease: "back.out(2)", delay: 0.2 });
    },
    { dependencies: [open], scope: root },
  );

  return (
    <section ref={root} className="py-24 md:py-36">
      <div className="wrap mb-12 grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow mb-3 text-turmeric-deep">Made for the calendar</p>
          <h2 data-split className="display text-[13vw] md:text-[6vw]">
            Gift boxes
          </h2>
        </div>
        <p data-reveal className="max-w-md text-lg md:justify-self-end">
          Odisha has a festival for everything, and every one of them starts in the kitchen. We pack a spice box for three — order early, they sell out every year.
        </p>
      </div>

      <div data-fest-row className="wrap flex flex-col gap-4 md:h-[78vh] md:flex-row">
        {festivals.map((f, i) => {
          const isOpen = open === i;
          const box = getProduct(f.box)!;
          const fg = f.bg === CREAM || f.bg === GOLD ? INK : CREAM;
          return (
            <div
              key={f.slug}
              data-fest
              onMouseEnter={() => setOpen(i)}
              onClick={() => setOpen(i)}
              className={`relative cursor-pointer overflow-hidden rounded-[32px] border border-ink/15 transition-[flex-grow,min-height] duration-700 ease-[var(--ease-out-expo)] ${
                isOpen ? "min-h-[520px] md:min-h-0 md:flex-[4]" : "min-h-[96px] md:min-h-0 md:flex-1"
              }`}
              style={{ background: f.bg, color: fg }}
            >
              <div className="flex h-full flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow opacity-75">{f.when}</p>
                    <h3 className="display mt-2 text-4xl md:text-5xl">{f.name}</h3>
                  </div>
                  <span className="odia text-3xl opacity-80 md:text-4xl">{f.odia}</span>
                </div>

                {isOpen && (
                  <div data-fest-body={i} className="relative mt-auto grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p data-fest-anim className="max-w-md text-lg leading-snug md:text-xl">
                        {f.story}
                      </p>
                      <p data-fest-anim className="mt-3 text-sm font-semibold opacity-80">{box.tagline}</p>
                      <Link data-fest-anim href={`/shop/${box.slug}`} className="btn btn-cream mt-6">
                        See the {box.name} <ArrowIcon width={18} height={18} />
                      </Link>
                    </div>
                    <div data-fest-art className="mx-auto w-40 md:w-60">
                      <PackShot product={box} className="w-full" sizes="240px" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
