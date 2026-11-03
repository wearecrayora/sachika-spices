"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useUI } from "@/lib/store";

export default function Toast() {
  const el = useRef<HTMLDivElement>(null);
  const toast = useUI((s) => s.toast);
  const setCart = useUI((s) => s.setCart);

  useGSAP(
    () => {
      if (!toast) return;
      gsap
        .timeline()
        .fromTo(el.current, { xPercent: -50, yPercent: 160, rotation: -6, autoAlpha: 1 }, { yPercent: 0, rotation: -2, duration: 0.7, ease: "back.out(2)" })
        .to(el.current, { yPercent: 160, rotation: 4, duration: 0.5, ease: "power3.in" }, "+=2.4");
    },
    { dependencies: [toast?.id] },
  );

  return (
    <div ref={el} data-toast className="invisible fixed bottom-5 left-1/2 z-[70] w-max max-w-[calc(100vw-32px)]" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-full border border-ink/15 bg-ink py-2 pl-5 pr-2 text-cream shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]">
        <span className="min-w-0 text-sm font-semibold leading-snug">{toast?.text}</span>
        <button onClick={() => setCart(true)} className="shrink-0 whitespace-nowrap rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-ink">
          View bag
        </button>
      </div>
    </div>
  );
}
