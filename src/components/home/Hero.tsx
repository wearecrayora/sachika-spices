"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, isFinePointer, reduceMotion } from "@/lib/gsap";
import { getProduct, inr, type IngredientKind } from "@/lib/products";
import { useUI } from "@/lib/store";
import PackShot from "@/components/product/PackShot";
import Ingredient from "@/components/art/Ingredient";
import CircleText from "@/components/ui/CircleText";

const FRAMES = ["turmeric-powder", "chilli-powder", "coriander-powder", "cumin-powder", "maize-powder", "maize-millet-blend"].map((s) => getProduct(s)!);

// The ingredient "spread" around the pack: position (%), size (vw), depth for parallax.
const SPREAD: { k: IngredientKind; x: number; y: number; s: number; d: number; r: number }[] = [
  { k: "turmeric", x: 41, y: 31, s: 9, d: 1.4, r: -20 },
  { k: "chilli", x: 83, y: 22, s: 9, d: 1.1, r: 15 },
  { k: "sparkle", x: 26, y: 70, s: 5, d: 0.6, r: 0 },
  { k: "maize", x: 77, y: 70, s: 9, d: 1.3, r: 10 },
  { k: "coriander", x: 45, y: 63, s: 7, d: 0.9, r: 0 },
  { k: "millet", x: 92, y: 48, s: 9, d: 0.8, r: 30 },
  { k: "staranise", x: 30, y: 12, s: 6, d: 0.5, r: 0 },
  { k: "cumin", x: 64, y: 12, s: 6, d: 0.7, r: 20 },
  { k: "leaf", x: 60, y: 84, s: 7, d: 1.2, r: -10 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const loaded = useUI((s) => s.loaded);
  const [frame, setFrame] = useState(0);
  const p = FRAMES[frame];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (!loaded) {
        gsap.set(q("[data-h-line]"), { yPercent: 110 });
        gsap.set(q("[data-jar]"), { scale: 0, rotation: -30 });
        gsap.set(q("[data-ing]"), { scale: 0, autoAlpha: 0 });
        gsap.set(q("[data-h-fade]"), { autoAlpha: 0, y: 30 });
        return;
      }

      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .to(q("[data-h-line]"), { yPercent: 0, duration: 1.3, stagger: 0.1 })
        .to(q("[data-jar]"), { scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.8)" }, 0.25)
        .to(q("[data-ing]"), { scale: 1, autoAlpha: 1, duration: 1, ease: "back.out(2.2)", stagger: { each: 0.05, from: "random" } }, 0.4)
        .to(q("[data-h-fade]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.7);

      if (reduceMotion()) return;

      // Stop-motion swap of the hero pack.
      const swap = gsap.delayedCall(1.6, function tick() {
        setFrame((f) => (f + 1) % FRAMES.length);
        swap.restart(true);
      });

      // Idle bob so the spread is alive on touch screens too.
      q("[data-ing-inner]").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 12 : -12, rotation: i % 2 ? 8 : -8, duration: 2.2 + (i % 3) * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      // Scroll: the spread blows outward, headline sinks, pack tips over.
      const scroll = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 } });
      q("[data-ing]").forEach((el, i) => {
        const s = SPREAD[i];
        scroll.to(el, { xPercent: (s.x - 50) * 6 * s.d, yPercent: (s.y - 50) * 5 * s.d + 80, rotation: s.r * 6, ease: "none" }, 0);
      });
      scroll
        .to(q("[data-jar]"), { yPercent: 40, rotation: 18, scale: 0.85, ease: "none" }, 0)
        .to(q("[data-h-text]"), { yPercent: 30, ease: "none" }, 0);

      // Mouse parallax on desktop.
      if (isFinePointer()) {
        const movers = q("[data-ing-inner]").map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
          d: SPREAD[i].d,
        }));
        const jx = gsap.quickTo(q("[data-jar-inner]"), "rotationY", { duration: 1, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 70 * m.d);
            m.y(ny * 50 * m.d);
          });
          jx(nx * 24);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    },
    { scope: root, dependencies: [loaded] },
  );

  // Hard cut + wobble on every frame change, like a stop-motion shoot.
  useGSAP(
    () => {
      if (!loaded) return;
      gsap.fromTo("[data-jar-frame]", { rotation: frame % 2 ? 6 : -6, scale: 0.94 }, { rotation: 0, scale: 1, duration: 0.5, ease: "steps(3)" });
      gsap.fromTo("[data-caption]", { yPercent: 100 }, { yPercent: 0, duration: 0.5 });
    },
    { dependencies: [frame], scope: root },
  );

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-cinnamon pt-[var(--header-h)] text-cream">
      <span className="odia pointer-events-none absolute -bottom-[6vw] left-1/2 -translate-x-1/2 select-none text-[40vw] font-bold leading-none text-ink/15" aria-hidden>
        ମସଲା
      </span>

      <div className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col">
        <div className="relative flex flex-1 items-center">
          {/* the spread */}
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            {SPREAD.map((s, i) => (
              <div key={i} data-ing className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.s * 1.5}vw`, minWidth: 44, maxWidth: 150 }}>
                <div data-ing-inner style={{ rotate: `${s.r}deg` }}>
                  <Ingredient kind={s.k} className="w-full -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            ))}
          </div>

          <div className="wrap relative z-10 flex flex-col items-center gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <h1 data-h-text className="display whitespace-nowrap text-center text-[16vw] leading-[0.86] md:text-left md:text-[min(8.4vw,132px)]" aria-label="Odisha's finest spices">
              <span className="block overflow-hidden pb-[0.06em]" aria-hidden>
                <span data-h-line className="block">Odisha&apos;s</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em] pr-[0.1em]" aria-hidden>
                <span data-h-line className="block italic text-gold">finest</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]" aria-hidden>
                <span data-h-line className="block">spices</span>
              </span>
            </h1>

            {/* the real pack, beside the headline */}
            <div className="relative w-[44vw] max-w-[340px] shrink-0 md:mr-[2vw] md:w-[22vw]" style={{ perspective: 800 }}>
              <button
                data-jar
                onClick={() => setFrame((f) => (f + 1) % FRAMES.length)}
                className="block w-full"
                aria-label="Show next product"
                data-cursor="Next"
              >
                <div data-jar-inner>
                  {/* every pack stays mounted so the stop-motion cuts never wait on a download */}
                  <div data-jar-frame className="relative">
                    {FRAMES.map((f, i) => (
                      <div key={f.slug} className={`${i === 0 ? "" : "absolute inset-0"} ${i === frame ? "visible" : "invisible"}`}>
                        <PackShot product={f} className="w-full" sizes="(min-width: 768px) 24vw, 46vw" priority={i === 0} />
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="wrap relative z-20 grid grid-cols-1 items-end gap-6 pb-6 md:grid-cols-3 md:pb-10">
          <p data-h-fade className="max-w-xs text-base font-medium leading-snug md:text-lg">
            Turmeric, chilli, coriander and cumin, with stone-ground maize and mandia — cleaned, slow-ground and sealed fresh by <b>Sachika Spices</b>.
          </p>
          <div data-h-fade className="flex flex-col items-start gap-3 md:items-center">
            <Link href={`/shop/${p.slug}`} className="overflow-hidden text-sm font-semibold" aria-live="polite">
              <span data-caption className="block">
                Now showing: <u className="underline-offset-4">{p.name}</u> · {inr(p.sizes[0].price)}
              </span>
            </Link>
            <div className="flex gap-3">
              <Link href="/shop" className="btn btn-gold">Shop the spices</Link>
              <Link href="/about" className="btn btn-cream hidden sm:inline-flex">Our story</Link>
            </div>
          </div>
          <div data-h-fade className="hidden justify-end md:flex">
            <CircleText text="PURE ✦ AROMATIC ✦ SACHIKA SPICES ✦ " className="h-32 w-32 text-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
