"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduceMotion } from "@/lib/gsap";
import { products } from "@/lib/products";
import { useUI } from "@/lib/store";
import PackShot from "@/components/product/PackShot";

/*
  Stop-motion preloader: the pouches flick through one frame at a time inside
  a gold ring while a counter ticks to 100, then three spice-coloured sheets —
  cinnamon, turmeric, chilli — peel away upward.
*/

const FRAMES = ["turmeric-powder", "chilli-powder", "coriander-powder", "cumin-powder", "maize-powder", "maize-millet-blend"]
  .map((s) => products.find((p) => p.slug === s)!)
  .filter(Boolean);

const WORDS = ["haladi", "lanka", "dhania", "jira", "mandia"];

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const setLoaded = useUI((s) => s.setLoaded);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reduceMotion()) {
        setLoaded();
        setGone(true);
        return;
      }

      const frames = q("[data-frame]");
      const words = q("[data-word]");
      const counter = q("[data-count]")[0] as HTMLElement;
      const state = { v: 0, f: 0 };
      gsap.set(frames, { autoAlpha: 0 });
      gsap.set(frames[0], { autoAlpha: 1 });

      // Stop-motion: hard cuts with a slight, hand-placed tilt on every frame.
      let last = 0;
      const flick = gsap.to(state, {
        f: frames.length * 4,
        duration: 3.6,
        ease: `steps(${frames.length * 4})`,
        repeat: -1,
        onUpdate() {
          const i = Math.floor(state.f) % frames.length;
          if (i === last) return;
          gsap.set(frames[last], { autoAlpha: 0 });
          gsap.set(frames[i], {
            autoAlpha: 1,
            rotation: gsap.utils.random(-4, 4),
            scale: gsap.utils.random(0.96, 1.03),
          });
          last = i;
        },
      });
      gsap.to(q("[data-ring]"), { rotation: 360, duration: 24, ease: "none", repeat: -1 });

      const render = () => {
        counter.textContent = String(Math.round(state.v)).padStart(3, "0");
        gsap.set(q("[data-bar]"), { scaleX: state.v / 100 });
      };

      const assets = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true }))),
      ]);

      const tl = gsap.timeline();
      tl.from(q("[data-in]"), { yPercent: 110, duration: 1, stagger: 0.08 }, 0)
        .from(q("[data-stage]"), { scale: 0.8, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.1)
        .to(state, { v: 72, duration: 1.6, ease: "power2.inOut", onUpdate: render }, 0.2);

      // Words start parked below their 1em window (and invisible until GSAP owns them,
      // so nothing stacks up before hydration).
      gsap.set(words, { yPercent: 110, autoAlpha: 1 });
      // In and out share one ease, so the outgoing word stays exactly one slot above
      // the incoming one (a slot-reel roll) instead of the two crossing mid-window.
      words.forEach((w, i) => {
        tl.to(w, { yPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0.25 + i * 0.36);
        if (i < words.length - 1) tl.to(w, { yPercent: -110, duration: 0.42, ease: "power3.inOut" }, 0.25 + (i + 1) * 0.36);
      });

      tl.add(() => {
        tl.pause();
        assets.then(() => tl.resume());
      }, 1.8);

      tl.to(state, { v: 100, duration: 0.7, ease: "power3.out", onUpdate: render }, 1.81)
        .add(() => flick.pause())
        .to(q("[data-in]"), { yPercent: -110, duration: 0.6, stagger: 0.04, ease: "power3.in" }, "+=0.15")
        .to(q("[data-stage]"), { scale: 0.9, yPercent: -40, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, "<")
        .add(() => setLoaded(), ">-0.2")
        .to(q("[data-sheet]"), {
          yPercent: -100,
          borderBottomLeftRadius: "50% 18vh",
          borderBottomRightRadius: "50% 18vh",
          duration: 1.05,
          ease: "expo.inOut",
          stagger: 0.12,
        }, "<")
        .add(() => setGone(true));
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-busy="true" aria-label="Loading Sachika Spices">
      <div data-sheet className="absolute inset-0 bg-chilli" style={{ zIndex: 1 }} />
      <div data-sheet className="absolute inset-0 bg-turmeric" style={{ zIndex: 2 }} />
      <div data-sheet className="absolute inset-0 flex flex-col overflow-hidden bg-cinnamon text-cream" style={{ zIndex: 3 }}>
        <div className="flex items-start justify-between p-[var(--gutter)] pt-6">
          <div className="overflow-hidden">
            <div data-in className="flex items-center gap-3">
              <Image src="/brand/sachika-mark.png" alt="" width={44} height={44} className="h-10 w-10 md:h-11 md:w-11" priority />
              <span className="display text-xl uppercase tracking-[0.12em] md:text-2xl">Sachika Spices</span>
            </div>
          </div>
          <div className="overflow-hidden text-right">
            <p data-in className="odia text-2xl leading-tight text-gold md:text-3xl">ସଚିକା</p>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div data-stage className="relative grid place-items-center">
            <div data-ring className="absolute aspect-square h-[48vh] max-h-[440px] rounded-full border border-dashed border-gold/45" />
            <div className="absolute aspect-square h-[40vh] max-h-[370px] rounded-full bg-cream/[0.06]" />
            <div className="relative h-[38vh] max-h-[340px] w-[30vh] max-w-[270px]">
              {FRAMES.map((p) => (
                <div key={p.slug} data-frame className="absolute inset-0">
                  <PackShot product={p} className="mx-auto h-full" sizes="280px" priority />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 px-[var(--gutter)] pb-6 md:pb-8">
          <div className="overflow-hidden">
            <p data-in className="display pb-[0.06em] pr-[0.08em] text-[26vw] italic leading-[0.86] text-gold md:text-[15vw]">
              <span data-count>000</span>
            </p>
          </div>
          <div className="mb-3 overflow-hidden text-right md:mb-6">
            <p data-in className="eyebrow mb-2 opacity-70">Grinding your</p>
            <div className="relative h-[1.1em] w-[5em] overflow-hidden text-3xl md:text-5xl">
              {WORDS.map((w) => (
                <span key={w} data-word className="display invisible absolute right-0 top-0 block leading-none italic">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div data-bar className="h-1 origin-left scale-x-0 bg-gold" />
      </div>
    </div>
  );
}
