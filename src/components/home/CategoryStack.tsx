"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { byCategory, categories } from "@/lib/products";
import ProductMedia from "@/components/product/ProductMedia";
import { ArrowIcon } from "@/components/ui/Icons";

/* Sticky stacked category panels: each one slides over and pushes the last one back. */
export default function CategoryStack() {
  const root = useRef<HTMLElement>(null);
  const cats = categories.filter((c) => c.slug !== "boxes");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-cat]");
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          gsap.fromTo(
            card.querySelector("[data-cat-inner]"),
            { scale: 1, rotation: 0, filter: "brightness(1)" },
            {
              scale: 0.9,
              rotation: i % 2 ? 1.5 : -1.5,
              filter: "brightness(0.8)",
              ease: "none",
              scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
            },
          );
        }
        // Packs fan out as each panel arrives.
        gsap.from(card.querySelectorAll("[data-fan]"), {
          rotation: (j) => (j - 1) * -12,
          y: 160,
          stagger: 0.08,
          ease: "back.out(1.6)",
          duration: 1.1,
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative pb-24">
      <div className="wrap pb-10 pt-24">
        <p className="eyebrow mb-3 text-turmeric-deep">Shelf by shelf</p>
        <h2 data-split className="display max-w-[14ch] text-[13vw] md:text-[6vw]">
          From the spice room
        </h2>
      </div>

      <div className="wrap">
        {cats.map((c, i) => {
          // Three polaroids: one per product, topped up with other photos when a category is small.
          const items = byCategory(c.slug);
          const picks = [0, 1, 2].map((j) => ({ p: items[j % items.length], i: j < items.length ? 0 : j + 1 }));
          return (
            <div key={c.slug} data-cat className="sticky" style={{ top: `calc(var(--header-h) + ${i * 14}px)` }}>
              <div
                data-cat-inner
                className="relative mb-8 grid min-h-[72svh] origin-top overflow-hidden rounded-[36px] border border-ink/15 md:grid-cols-2"
                style={{ background: c.bg, color: c.fg }}
              >
                <div className="relative z-10 flex flex-col justify-between p-6 md:p-12">
                  <div>
                    <p className="eyebrow opacity-75">0{i + 1} / 0{cats.length}</p>
                    <h3 className="display mt-4 text-[16vw] md:text-[7.5vw]">{c.name}</h3>
                    <p className="odia mt-1 text-3xl opacity-80 md:text-4xl">{c.odia}</p>
                  </div>
                  <div className="mt-8">
                    <p className="max-w-sm text-lg leading-snug">{c.blurb}</p>
                    <Link href={`/collections/${c.slug}`} className="btn btn-cream mt-6">
                      Shop {c.name.toLowerCase()} <ArrowIcon width={18} height={18} />
                    </Link>
                  </div>
                </div>
                <div className="relative min-h-[340px]">
                  {picks.map(({ p, i }, j) => (
                    <div
                      key={p.slug + i}
                      className="absolute bottom-[10%] left-1/2 w-[44%] md:w-[38%]"
                      style={{ transform: `translateX(${-50 + (j - 1) * 66}%) rotate(${(j - 1) * 10}deg)`, zIndex: j === 1 ? 2 : 1 }}
                    >
                      <div data-fan>
                        <Link
                          href={`/shop/${p.slug}`}
                          data-cursor="View"
                          className="block rounded-xl border border-ink/15 bg-paper p-2 pb-8 shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)] transition-transform duration-500 ease-[var(--ease-squish)] hover:-translate-y-6"
                        >
                          <span className="relative block aspect-square overflow-hidden rounded-md bg-ink">
                            <ProductMedia product={p} index={i} sizes="(min-width: 768px) 18vw, 40vw" />
                          </span>
                          <span className="absolute inset-x-0 bottom-1.5 truncate px-2 text-center text-xs font-bold text-ink">{p.name}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
