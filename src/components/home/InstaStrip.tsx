import Image from "next/image";
import { CONTACT, singles } from "@/lib/products";
import Marquee from "@/components/ui/Marquee";
import { InstagramIcon } from "@/components/ui/Icons";

/*
  Product photos, each tile linking to the brand's Instagram. In production
  this could become a live feed of real posts.
*/
const TILES = singles.flatMap((p) =>
  p.images.slice(1, 3).map((src) => ({ src, name: p.name, href: p.instagram ?? CONTACT.instagram })),
);

export default function InstaStrip() {
  const tiles = TILES.map((t) => (
    <a
      key={t.src}
      href={t.href}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      className="group relative mx-2 block aspect-square w-56 overflow-hidden rounded-3xl border border-ink/15 bg-ink md:w-72"
    >
      <Image src={t.src} alt={`${t.name} on Instagram`} fill sizes="288px" className="object-cover transition-transform duration-700 ease-[var(--ease-squish)] group-hover:rotate-2 group-hover:scale-110" />
      <span className="absolute bottom-3 left-3 rounded-full border border-ink/15 bg-cream px-3 py-1 text-xs font-bold text-ink">{t.name}</span>
      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink text-cream opacity-0 transition group-hover:opacity-100">
        <InstagramIcon width={16} height={16} />
      </span>
    </a>
  ));

  return (
    <section className="py-24 md:py-32">
      <div className="wrap mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 data-split className="display text-[13vw] md:text-[6vw]">
          Follow the spice trail
        </h2>
        <div data-reveal className="flex flex-wrap gap-3">
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="chip bg-paper hover:bg-gold">
            <InstagramIcon width={16} height={16} /> {CONTACT.instagramHandle}
          </a>
        </div>
      </div>
      <Marquee items={tiles} separator={null} speed={60} />
    </section>
  );
}
