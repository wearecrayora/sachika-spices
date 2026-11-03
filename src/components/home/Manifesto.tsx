"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Ingredient from "@/components/art/Ingredient";

const TEXT =
  "Masala means more than heat. Every Sachika pouch starts as a whole crop — turmeric fingers, sun-dried red chillies, coriander and cumin seeds, golden maize and hardy mandia. Cleaned by hand, ground slow, sealed fresh. Nothing added, nothing hidden.";

// Highlighted words, and the spice colour each one takes.
const HIGHLIGHT: Record<string, string> = {
  "Masala": "text-turmeric",
  "whole": "text-turmeric",
  "crop": "text-turmeric",
  "turmeric": "text-turmeric",
  "red": "text-chilli",
  "chillies,": "text-chilli",
  "mandia.": "text-coffee",
  "Nothing": "text-cinnamon",
  "added,": "text-cinnamon",
  "hidden.": "text-cinnamon",
};

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-w]"),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-para]")[0], start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-seal]"),
        { rotation: -30 },
        { rotation: 20, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div data-speed="0.6" className="absolute left-[4%] top-[2%] w-14 md:top-[12%] md:w-24">
          <Ingredient kind="turmeric" className="w-full rotate-12" />
        </div>
        <div data-speed="1.1" className="absolute right-[6%] top-[4%] w-12 md:top-[22%] md:w-20">
          <Ingredient kind="chilli" className="w-full -rotate-12" />
        </div>
        <div data-speed="0.4" className="absolute bottom-[1%] left-[12%] w-10 md:bottom-[10%] md:w-16">
          <Ingredient kind="coriander" className="w-full" />
        </div>
        <div data-speed="0.9" className="absolute bottom-[14%] right-[16%] hidden w-14 md:block md:w-20">
          <Ingredient kind="millet" className="w-full rotate-12" />
        </div>
      </div>

      <div className="wrap relative">
        <div className="mb-10 flex items-center gap-4">
          <div data-seal className="relative h-16 w-16 md:h-20 md:w-20">
            <Image src="/brand/sachika-mark.png" alt="" fill sizes="80px" className="object-contain" />
          </div>
          <p className="eyebrow text-cinnamon">
            ମସଲା · <span className="normal-case tracking-normal">noun, Odia</span> — spice, the soul of every pot
          </p>
        </div>
        <p data-para className="max-w-[22ch] text-[8.5vw] font-extrabold leading-[1.05] tracking-[-0.03em] md:max-w-[28ch] md:text-[4.2vw]">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} data-w className={HIGHLIGHT[w] ? `display font-medium italic ${HIGHLIGHT[w]}` : ""}>
              {w}{" "}
            </span>
          ))}
        </p>
        <div className="gold-rule mt-10 max-w-md" aria-hidden>
          <span className="text-xs">◆</span>
        </div>
        <p className="odia mt-6 text-2xl text-cinnamon md:text-3xl">ଶୁଦ୍ଧ ମସଲା, ଶୁଦ୍ଧ ସ୍ୱାଦ — pure spice, pure taste.</p>
      </div>
    </section>
  );
}
