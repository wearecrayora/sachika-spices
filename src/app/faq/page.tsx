import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Accordion from "@/components/ui/Accordion";

export const metadata: Metadata = pageMeta({
  title: "FAQ",
  description: "Delivery times, purity, shelf life, bulk orders and returns at Sachika Spices.",
  path: "/faq",
});

const GROUPS = [
  {
    title: "Orders & delivery",
    items: [
      { q: "Where do you deliver?", a: "Everywhere in India with a valid pincode. International shipping for the diaspora is coming soon — join the newsletter to hear first." },
      { q: "How long does delivery take?", a: "Orders are dispatched within 24 hours from our unit in Odisha. Odisha: 1–2 days. Rest of India: 3–5 working days. Express is available at checkout." },
      { q: "Is delivery free?", a: "Free on orders above ₹799. Below that, a flat ₹79." },
      { q: "Do you offer cash on delivery?", a: "Yes, with a small ₹30 handling fee." },
    ],
  },
  {
    title: "The food",
    items: [
      { q: "Is anything added to the spices?", a: "No. Each pouch holds one ingredient — no added colour, no fillers, no anti-caking agents, no preservatives. The colour of our turmeric and chilli comes from the spice itself." },
      { q: "Why do your spices smell stronger?", a: "We grind whole crops cool and slow, in small batches, and seal them the same day. That keeps the essential oils — the aroma and flavour — in the spice instead of letting them fade on a shelf." },
      { q: "What is mandia?", a: "Mandia is the Odia name for ragi, or finger millet — a hardy, fibre-rich grain grown in Odisha's hills for centuries. Our Maize & Millet Blend is built around it." },
      { q: "How long do the spices keep?", a: "Up to 12 months from the packed date on the label. Close the zip-lock after each use and keep the pouch away from heat, light and moisture — a dry spoon helps too." },
      { q: "Do you sell in bulk?", a: "Yes — we supply restaurants, caterers and retailers in larger packs. Call, WhatsApp or write to us from the contact page for wholesale prices." },
    ],
  },
  {
    title: "Returns & help",
    items: [
      { q: "Something arrived broken. What now?", a: "Send a photo on WhatsApp within 48 hours of delivery. We'll replace it or refund you — your choice." },
      { q: "Can I return food I didn't like?", a: "For hygiene reasons we can't accept returns of opened food, but tell us — we'll make it right." },
      { q: "Can I stock Sachika in my store?", a: "We'd love that. Retailers and distributors can write to us from the contact page." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero kicker="Questions, answered" title="Good to know" odia="ପ୍ରଶ୍ନ" ingredients={["coriander", "sparkle", "cumin"]} />
      <div className="wrap grid gap-16 py-16 md:py-24">
        {GROUPS.map((g) => (
          <section key={g.title} data-reveal className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <h2 className="display text-4xl md:text-5xl">{g.title}</h2>
            <Accordion items={g.items} />
          </section>
        ))}
        <div data-reveal className="rounded-[32px] border border-ink/15 bg-gold p-8 text-center md:p-12">
          <p className="display text-4xl">Still hungry for answers?</p>
          <Link href="/contact" className="btn mt-6">Ask us anything</Link>
        </div>
      </div>
    </>
  );
}
