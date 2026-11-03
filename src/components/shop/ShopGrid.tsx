"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, Flip, useGSAP, reduceMotion } from "@/lib/gsap";
import { Skeleton } from "@/components/ui/Skeleton";
import { categories, type CategorySlug, type Product } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Ingredient from "@/components/art/Ingredient";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const SORTS: { v: Sort; label: string }[] = [
  { v: "featured", label: "Featured" },
  { v: "price-asc", label: "Price: low to high" },
  { v: "price-desc", label: "Price: high to low" },
  { v: "rating", label: "Top rated" },
];

export default function ShopGrid({
  items,
  showFilters = true,
  skeletonName,
}: {
  items: Product[];
  showFilters?: boolean;
  /** Capture this grid as a named skeleton (only the full /shop grid is). */
  skeletonName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState>(null);
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [limited, setLimited] = useState(false);

  const visible = useMemo(() => {
    let list = items.filter((p) => (cat === "all" || p.category === cat) && (!limited || p.badge === "Limited stock"));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, cat, sort, limited]);

  // Capture positions before React re-renders, then FLIP into the new layout.
  const change = (fn: () => void) => {
    flipState.current = Flip.getState(root.current!.querySelectorAll("[data-flip]"));
    fn();
  };

  useGSAP(
    () => {
      if (!flipState.current) {
        if (reduceMotion()) return;
        gsap.from("[data-flip]", {
          y: 100,
          rotation: (i) => (i % 2 ? 3 : -3),
          autoAlpha: 0,
          stagger: 0.06,
          duration: 1.1,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
        return;
      }
      Flip.from(flipState.current, {
        duration: 0.8,
        ease: "expo.inOut",
        stagger: 0.03,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { scale: 0.6, autoAlpha: 0, rotation: -8 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.7, ease: "back.out(1.8)" }),
        onLeave: (els) => gsap.to(els, { scale: 0.6, autoAlpha: 0, duration: 0.4 }),
      });
      flipState.current = null;
    },
    { dependencies: [visible], scope: root },
  );

  const counts = (c: CategorySlug | "all") => (c === "all" ? items.length : items.filter((p) => p.category === c).length);

  return (
    <div>
      {showFilters && (
        <div className="sticky-bar z-30 mb-10 border-y border-ink/15 bg-cream/95 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] md:mx-0 md:px-0" role="tablist" aria-label="Filter by category">
              {(["all", ...categories.map((c) => c.slug)] as const).map((c) => {
                const label = c === "all" ? "Everything" : categories.find((x) => x.slug === c)!.name;
                const active = cat === c;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={active}
                    onClick={() => change(() => setCat(c))}
                    className={`chip shrink-0 ${active ? "bg-ink text-cream" : "bg-paper hover:bg-gold"}`}
                  >
                    {label} <span className="opacity-60">{counts(c)}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => change(() => setLimited((s) => !s))} className={`chip ${limited ? "bg-turmeric text-cream" : "bg-paper"}`} aria-pressed={limited}>
                <Ingredient kind="sparkle" className="h-4 w-4" /> Limited lots
              </button>
              <label className="sr-only" htmlFor="sort">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => change(() => setSort(e.target.value as Sort))}
                className="chip cursor-pointer appearance-none bg-paper pr-8"
                style={{ backgroundImage: "linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%)", backgroundPosition: "calc(100% - 16px) 55%, calc(100% - 11px) 55%", backgroundSize: "5px 5px", backgroundRepeat: "no-repeat" }}
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <Skeleton name={skeletonName} loading={false}>
        <div ref={root} className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {visible.map((p) => (
            <div key={p.slug} data-flip data-flip-id={p.slug}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Skeleton>
      {visible.length === 0 && (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing limited in this aisle.</p>
          <button onClick={() => change(() => setLimited(false))} className="btn mt-6">
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
