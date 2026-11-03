"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PlusIcon } from "./Icons";

export type AccordionItem = { q: string; a: React.ReactNode };

export default function Accordion({ items, defaultOpen = -1 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const prev = open;
    const next = open === i ? -1 : i;
    if (prev >= 0 && refs.current[prev]) gsap.to(refs.current[prev], { height: 0, duration: 0.5, ease: "expo.inOut" });
    if (next >= 0 && refs.current[next]) gsap.fromTo(refs.current[next], { height: 0 }, { height: "auto", duration: 0.6, ease: "expo.inOut" });
    setOpen(next);
  };

  return (
    <div className="border-t border-ink/15">
      {items.map((it, i) => (
        <div key={it.q} className="border-b border-ink/15">
          <button onClick={() => toggle(i)} className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-bold" aria-expanded={open === i}>
            {it.q}
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 transition-transform duration-500 ease-[var(--ease-squish)] ${open === i ? "rotate-45 bg-turmeric text-cream" : "bg-paper"}`}>
              <PlusIcon width={16} height={16} />
            </span>
          </button>
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="overflow-hidden"
            style={{ height: i === defaultOpen ? "auto" : 0 }}
          >
            <div className="pb-6 pr-12 leading-relaxed opacity-85">{it.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
