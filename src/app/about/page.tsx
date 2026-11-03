import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Ingredient from "@/components/art/Ingredient";
import Timeline from "@/components/about/Timeline";

export const metadata: Metadata = pageMeta({
  title: "Our story",
  description: "Sachika Spices is an Odia spice maker grinding turmeric, chilli, coriander, cumin, maize and mandia the slow way — whole crops, small batches, sealed fresh.",
  path: "/about",
});

const VALUES = [
  { t: "Purity first", d: "One ingredient per pouch. No added colour, no fillers, no anti-caking agents. If it isn't spice, it isn't in the pack.", bg: "bg-chilli text-cream", k: "chilli" as const },
  { t: "Fair to farmers", d: "We buy whole crops directly wherever we can, and pay for quality — because great spice starts with a farmer who's paid well for it.", bg: "bg-gold", k: "turmeric" as const },
  { t: "Fresh, always", d: "Small batches, ground and sealed the same day, with the batch and date on every pouch. You can smell the difference.", bg: "bg-cinnamon text-cream", k: "leaf" as const },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream pb-16 pt-[calc(var(--header-h)+4rem)] md:pb-24">
        <div className="wrap">
          <p className="eyebrow mb-4 text-turmeric-deep">Our story</p>
          <h1 data-split className="display text-[16vw] leading-[0.88] md:text-[9.5vw]">
            Spice, the way it <i className="text-turmeric">should</i> be.
          </h1>
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
            <p data-reveal className="odia text-5xl text-cinnamon md:text-7xl">
              ସଚିକା
            </p>
            <p data-reveal className="max-w-lg text-lg leading-relaxed md:text-xl">
              Every Odia kitchen runs on a masala dabba — haladi, lanka, dhania, jira, topped up week after week. <b>Sachika Spices</b> exists to fill it with spices worth cooking with: whole crops, cleaned by hand, ground slow and sealed fresh.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-cream md:py-32">
        <div className="wrap grid items-center gap-14 md:grid-cols-2">
          <div data-pop className="relative mx-auto aspect-square w-[70%] max-w-[440px]">
            <div className="absolute inset-0 rounded-full bg-cinnamon/40" />
            <Image src="/brand/sachika-mark.png" alt="The Sachika Spices emblem" fill sizes="(min-width: 768px) 35vw, 70vw" className="object-contain p-[14%]" />
          </div>
          <div>
            <h2 data-split className="display text-[12vw] md:text-[5vw]">
              Made in Odisha, <i className="text-gold">for every kitchen.</i>
            </h2>
            <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed opacity-85">
              Sachika began with a simple frustration: supermarket spice that smelled of nothing and stained everything. So we started grinding our own — the way our grandmothers did, only cleaner and in sealed packs. Today Sachika makes six signature grinds, from everyday haladi to a maize and mandia blend rooted in Odisha&apos;s millet tradition.
            </p>
            <Link data-reveal href="/process" className="btn btn-gold mt-8">
              See how it&apos;s made
            </Link>
          </div>
        </div>
      </section>

      <Timeline />

      <section className="wrap pb-24 md:pb-32">
        <h2 data-split className="display mb-12 text-[12vw] md:text-[5.5vw]">
          What we stand for
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.t} data-reveal className={`sticker relative min-h-[320px] rounded-[32px] p-8 ${v.bg}`} style={{ rotate: `${(i - 1) * 1}deg` }}>
              <Ingredient kind={v.k} className="absolute -right-5 -top-7 w-20" />
              <span className="display text-6xl italic opacity-40">0{i + 1}</span>
              <h3 className="display mt-6 text-4xl">{v.t}</h3>
              <p className="mt-4 text-lg leading-snug opacity-90">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
