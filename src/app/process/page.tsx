import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { products } from "@/lib/products";
import ShopGrid from "@/components/shop/ShopGrid";
import Marquee from "@/components/ui/Marquee";
import Ingredient from "@/components/art/Ingredient";

export const metadata: Metadata = pageMeta({
  title: "Our process",
  description: "How Sachika Spices are made — whole crops sourced at origin, cleaned by hand, slow-ground in small batches and sealed fresh, with nothing added.",
  path: "/process",
});

// The Sachika quality promises. Details to be confirmed by the client.
const STEPS = [
  { n: "01", t: "Sourced whole", d: "We buy turmeric fingers, chillies, seeds, maize and mandia as whole crops — so we know exactly what goes into the grinder.", k: "turmeric" as const },
  { n: "02", t: "Cleaned by hand", d: "Every lot is sun-dried, sieved and hand-sorted. Stones, stalks and tired pieces never make it to the mill.", k: "coriander" as const },
  { n: "03", t: "Ground cool & slow", d: "Small batches at low speed keep the grind cool, so the essential oils — the flavour and aroma — stay in the spice.", k: "chilli" as const },
  { n: "04", t: "Sealed the same day", d: "Light-proof, zip-lock pouches with the batch and date on every pack. No added colour, no fillers, nothing hidden.", k: "sparkle" as const },
];

export default function ProcessPage() {
  return (
    <>
      <section data-hero-dark className="relative overflow-hidden bg-ink pb-20 pt-[calc(var(--header-h)+3rem)] text-cream md:pb-28">
        <div className="wrap grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
          <div data-pop className="relative mx-auto aspect-square w-[80%] max-w-[480px]">
            <div className="absolute inset-0 rounded-full border border-dashed border-gold/40" />
            <div className="absolute inset-[6%] overflow-hidden rounded-full">
              <Image src="/products/chilli-powder/2.webp" alt="Sachika turmeric, chilli and coriander powders with whole spices" fill priority sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-cinnamon p-4 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)] md:h-36 md:w-36">
              <div className="relative h-full w-full">
                <Image src="/brand/sachika-mark.png" alt="" fill sizes="144px" className="object-contain" />
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4 text-gold">Our process</p>
            <h1 data-split className="display text-[15vw] md:text-[7vw]">
              From field <i className="text-gold">to pouch</i>
            </h1>
            <p className="odia mt-2 text-3xl text-gold">ଶୁଦ୍ଧ ମସଲା, ଶୁଦ୍ଧ ସ୍ୱାଦ</p>
            <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed opacity-85 md:text-xl">
              Great spice can&apos;t be rushed. Sachika takes whole crops from the field, cleans them by hand, grinds them cool and slow, and seals them the same day — so what reaches your kitchen still smells like the harvest.
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <a href="#range" className="btn btn-gold">See the range</a>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-ink/15 bg-chilli py-4 text-cream">
        <Marquee items={["Pure spices, finely ground", "ଶୁଦ୍ଧ ମସଲା, ଶୁଦ୍ଧ ସ୍ୱାଦ", "Nothing added", "Sealed fresh"].map((t) => <span key={t} className="display text-3xl italic md:text-5xl">{t}</span>)} separator="✦" />
      </div>

      <section className="wrap py-24 md:py-32">
        <h2 data-split className="display mb-14 max-w-[14ch] text-[12vw] md:text-[5.5vw]">
          The Sachika standard
        </h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} data-reveal className="sticker relative rounded-3xl bg-paper p-6" style={{ rotate: `${(i % 2 ? 1 : -1) * 0.8}deg` }}>
              <Ingredient kind={s.k} className="absolute -right-4 -top-6 w-16" />
              <span className="display text-5xl italic text-turmeric">{s.n}</span>
              <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 opacity-80">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="range" className="wrap scroll-mt-24 pb-28">
        <h2 data-split className="display mb-10 text-[12vw] md:text-[5.5vw]">
          The full range
        </h2>
        <ShopGrid items={products} />
      </section>
    </>
  );
}
