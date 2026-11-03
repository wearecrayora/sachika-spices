"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import PageHero from "@/components/ui/PageHero";

const STAGES = [
  { t: "Order placed", d: "28 Oct, 10:14 am" },
  { t: "Sealed & packed at the Sachika unit", d: "28 Oct, 6:40 pm" },
  { t: "Shipped via Delhivery", d: "29 Oct, 9:02 am" },
  { t: "Out for delivery", d: "Today, 8:30 am" },
  { t: "Delivered", d: "Expected today by 7 pm" },
];

export default function TrackPage() {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const current = 3;

  useGSAP(
    () => {
      if (!shown) return;
      gsap.fromTo("[data-track-line]", { scaleY: 0 }, { scaleY: current / (STAGES.length - 1), duration: 1.6, ease: "expo.inOut" });
      gsap.from("[data-stage-row]", { x: -40, autoAlpha: 0, stagger: 0.12, duration: 0.8 });
      gsap.from("[data-truck]", { x: -200, duration: 1.4, ease: "back.out(1.4)", delay: 0.4 });
    },
    { dependencies: [shown], scope: root },
  );

  return (
    <>
      <PageHero kicker="Where's my masala?" title="Track your order" odia="ଟ୍ରାକ" bg="var(--color-cinnamon)" fg="var(--color-cream)" ingredients={["sparkle", "chilli", "leaf"]} />
      <div ref={root} className="wrap grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShown(true);
          }}
          className="space-y-5"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Order number</span>
            <input required className="field uppercase" placeholder="SCK482913" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Mobile number or email</span>
            <input required className="field" placeholder="98xxx xxxxx" />
          </label>
          <button className="btn py-4">Track it</button>
          <p className="text-sm opacity-60">Demo: enter anything to see a sample timeline.</p>
        </form>

        {shown ? (
          <div className="sticker rounded-[32px] bg-paper p-6 md:p-8">
            <div className="flex items-center justify-between">
              <p className="display text-3xl">SCK482913</p>
              <span data-truck className="rounded-full border border-ink/15 bg-turmeric px-4 py-1 text-sm font-bold text-cream">On the way</span>
            </div>
            <ol className="relative mt-8 space-y-7 pl-10">
              <span className="absolute bottom-2 left-[11px] top-2 w-1 rounded bg-ink/10" />
              <span data-track-line className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-1 origin-top rounded bg-turmeric" />
              {STAGES.map((s, i) => (
                <li key={s.t} data-stage-row className="relative">
                  <span className={`absolute -left-10 top-0.5 h-6 w-6 rounded-full border border-ink/15 ${i <= current ? "bg-turmeric" : "bg-paper"} ${i === current ? "ring-4 ring-turmeric/30" : ""}`} />
                  <p className={`font-bold ${i > current ? "opacity-40" : ""}`}>{s.t}</p>
                  <p className="text-sm opacity-60">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="grid place-items-center rounded-[32px] border-2 border-dashed border-ink p-10 text-center">
            <p className="display text-3xl opacity-60">Your order&apos;s journey will show up here.</p>
          </div>
        )}
      </div>
    </>
  );
}
