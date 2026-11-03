"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useUI } from "@/lib/store";
import { inr, products } from "@/lib/products";
import ProductMedia from "@/components/product/ProductMedia";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

const SUGGEST = ["turmeric", "chilli", "jira", "dhania", "mandia", "box"];

export default function SearchOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const { searchOpen, setSearch } = useUI();
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return products.slice(0, 6);
    return products.filter((p) =>
      [p.name, p.odia, p.category, p.tagline, ...p.details].join(" ").toLowerCase().includes(t),
    );
  }, [term]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, onComplete: () => input.current?.focus() })
        .set(root.current, { visibility: "visible" })
        .fromTo(root.current, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" })
        .from(q("[data-s-in]"), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.7 }, 0.35);
    },
    { scope: root },
  );

  useGSAP(() => {
    if (!tl.current) return;
    if (searchOpen) tl.current.play();
    else tl.current.reverse();
  }, [searchOpen]);

  useGSAP(
    () => {
      gsap.from("[data-result]", { y: 24, autoAlpha: 0, stagger: 0.03, duration: 0.5 });
    },
    { dependencies: [results.length, term === ""], scope: root },
  );

  return (
    <div ref={root} className="invisible fixed inset-0 z-[60] overflow-y-auto bg-gold" role="dialog" aria-label="Search" aria-hidden={!searchOpen} data-lenis-prevent>
      <div className="wrap py-6">
        <div className="flex justify-end">
          <button onClick={() => setSearch(false)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-cream transition hover:rotate-90" aria-label="Close search">
            <CloseIcon />
          </button>
        </div>
        <label data-s-in className="mt-4 flex items-center gap-4 border-b-4 border-ink pb-3">
          <SearchIcon width={36} height={36} />
          <input
            ref={input}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setSearch(false)}
            placeholder="Search turmeric, chilli, millets…"
            className="display w-full bg-transparent text-4xl outline-none placeholder:text-ink/35 md:text-7xl"
            aria-label="Search products"
          />
        </label>
        <div data-s-in className="mt-4 flex flex-wrap gap-2">
          {SUGGEST.map((s) => (
            <button key={s} onClick={() => setTerm(s)} className={`chip ${term === s ? "bg-ink text-cream" : "bg-cream"}`}>
              {s}
            </button>
          ))}
        </div>

        <p data-s-in className="eyebrow mt-10 mb-4">
          {term ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular right now"}
        </p>
        {results.length === 0 ? (
          <p className="display text-3xl">Nothing by that name — yet. Try &ldquo;haladi&rdquo;.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {results.map((p) => (
              <li key={p.slug} data-result>
                <Link href={`/shop/${p.slug}`} onClick={() => setSearch(false)} className="group block" tabIndex={searchOpen ? 0 : -1}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink/15 bg-ink transition-transform duration-500 ease-[var(--ease-squish)] group-hover:-rotate-2">
                    <ProductMedia product={p} sizes="(min-width: 1024px) 16vw, 50vw" className="transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <p className="mt-2 font-bold leading-tight">{p.name}</p>
                  <p className="text-sm opacity-70">{inr(p.sizes[0].price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
