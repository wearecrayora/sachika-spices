"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText, reduceMotion } from "@/lib/gsap";
import { useUI } from "@/lib/store";

/*
  Mounted once per route (via app/template.tsx). Wires up the declarative
  animation attributes used across pages so server components can opt in
  without becoming client components:

    data-split            heading lines rise out of a mask
    data-reveal           fade-up on enter (batched)
    data-speed="0.2"      scroll parallax
    data-pop              squishy scale-in (stickers, badges)
*/

let firstMount = true;

export default function PageShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const loaded = useUI((s) => s.loaded);

  useGSAP(
    () => {
      if (!loaded) return;
      const q = gsap.utils.selector(root);

      if (reduceMotion()) {
        q("[data-split]").forEach((el) => el.classList.add("is-split"));
        return;
      }

      // Route-change curtain (skipped on first load — the preloader covers that).
      if (!firstMount) {
        gsap.fromTo(
          curtain.current,
          { yPercent: 0, borderBottomLeftRadius: "0% 0vh", borderBottomRightRadius: "0% 0vh" },
          { yPercent: -100, borderBottomLeftRadius: "50% 14vh", borderBottomRightRadius: "50% 14vh", duration: 1, ease: "expo.inOut", delay: 0.05 },
        );
      } else {
        gsap.set(curtain.current, { yPercent: -100 });
      }
      const delay = firstMount ? 0.15 : 0.55;
      firstMount = false;

      q("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            el.classList.add("is-split");
            const inView = el.getBoundingClientRect().top < window.innerHeight;
            return gsap.from(self.lines, {
              yPercent: 115,
              rotation: 2.5,
              transformOrigin: "0% 100%",
              stagger: 0.09,
              duration: 1.15,
              delay: inView ? delay : 0,
              scrollTrigger: inView ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });

      const reveals = q("[data-reveal]");
      gsap.set(reveals, { y: 60, autoAlpha: 0 });
      ScrollTrigger.batch(reveals, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.09, duration: 1.1, delay: batch.some((b) => b.getBoundingClientRect().top < window.innerHeight * 0.6) ? delay : 0 }),
      });

      q("[data-pop]").forEach((el) => {
        gsap.from(el, {
          scale: 0,
          rotation: -25,
          duration: 1,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          delay,
        });
      });

      q("[data-speed]").forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || "0.2");
        gsap.to(el, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [loaded] },
  );

  return (
    <div ref={root}>
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[55] bg-cinnamon" style={{ transform: "translateY(-100%)" }}>
        <div className="flex h-full items-center justify-center">
          <span className="odia text-6xl text-gold">ସଚିକା</span>
        </div>
      </div>
      {children}
    </div>
  );
}
