"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer } from "@/lib/gsap";

/* Desktop-only cursor blob. Elements with data-cursor="Label" swell it into a sticker. */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!isFinePointer()) return;
    el.current?.classList.remove("hidden");
    const x = gsap.quickTo(el.current, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el.current, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor ?? "";
      setLabel((prev) => (prev === next ? prev : next));
    };
    const down = () => gsap.to(el.current, { scale: 0.7, duration: 0.2 });
    const up = () => gsap.to(el.current, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div ref={el} className="pointer-events-none fixed left-0 top-0 z-[95] hidden" aria-hidden>
      <div
        className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full border border-ink/15 font-bold transition-all duration-300 ease-[var(--ease-squish)] ${
          label ? "h-24 w-24 -rotate-12 bg-gold text-sm text-ink" : "h-3.5 w-3.5 bg-turmeric text-[0px]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
