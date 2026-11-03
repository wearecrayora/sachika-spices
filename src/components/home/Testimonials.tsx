"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/lib/products";
import { StarIcon } from "@/components/ui/Icons";

const TILT = [-5, 3, -2, 6, -4];
const COLORS = ["bg-gold", "bg-paper", "bg-chilli text-cream", "bg-paper", "bg-turmeric text-cream"];

/* Notes "dropped" onto the table — they fall in, overshoot and settle. */
export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-note]"), {
        y: -260,
        rotation: (i) => TILT[i % TILT.length] * -4,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.3,
        ease: "bounce.out",
        scrollTrigger: { trigger: q("[data-notes]")[0], start: "top 95%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-coffee py-24 text-cream md:py-36">
      <div className="wrap">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 data-split className="display max-w-[12ch] text-[13vw] md:text-[6vw]">
            Notes from Odia kitchens
          </h2>
          <p data-reveal className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex text-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} width={20} height={20} />
              ))}
            </span>
            4.9 from home cooks across India
          </p>
        </div>

        <div data-notes className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 pt-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-5">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              data-note
              className={`sticker w-[78vw] shrink-0 snap-center rounded-3xl p-6 text-ink sm:w-[46vw] md:w-auto ${COLORS[i]} ${i % 2 ? "lg:mt-16" : ""}`}
              style={{ rotate: `${TILT[i]}deg` }}
            >
              <blockquote className="text-xl font-semibold leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm">
                <b>{t.name}</b> · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
