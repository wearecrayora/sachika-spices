"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, categories } from "@/lib/products";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/ui/Icons";
import NewsletterForm from "@/components/ui/NewsletterForm";

const COLS = [
  {
    title: "Shop",
    links: [{ href: "/shop", label: "Everything" }, ...categories.map((c) => ({ href: `/collections/${c.slug}`, label: c.name }))],
  },
  {
    title: "Help",
    links: [
      { href: "/track-order", label: "Track your order" },
      { href: "/faq", label: "FAQ" },
      { href: "/policies/shipping", label: "Shipping" },
      { href: "/policies/returns", label: "Returns & refunds" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Sachika",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/process", label: "Our process" },
      { href: "/contact", label: "Bulk & wholesale" },
      { href: "/account", label: "My account" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
];

const WORD = "sachika".split("");

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-letter]"), {
        yPercent: 100,
        rotation: (i) => (i % 2 ? 8 : -8),
        stagger: 0.05,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: q("[data-word]")[0], start: "top 95%", end: "bottom 90%", scrub: 1 },
      });
      gsap.from(q("[data-col]"), {
        y: 50,
        autoAlpha: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink text-cream">
      <div className="wrap grid gap-12 pt-20 pb-10 md:grid-cols-[1.2fr_2fr] md:pt-28">
        <div data-col className="max-w-sm">
          <div className="relative h-16 w-[240px]">
            <Image src="/brand/sachika-logo-cream.png" alt="Sachika Spices" fill sizes="240px" className="object-contain object-left" />
          </div>
          <p className="display mt-6 text-4xl leading-none">Pure spices, <i className="text-gold">finely ground.</i></p>
          <p className="mt-4 opacity-70">Turmeric, chilli, coriander, cumin, maize and mandia from Odisha — cleaned, slow-ground and sealed fresh, delivered across India.</p>
          <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="mt-4 block text-sm leading-relaxed opacity-70 hover:opacity-100">
            <b className="text-gold">{CONTACT.outlet}</b>
            <br />
            {CONTACT.address}
            <br />
            {CONTACT.phones[0]} · {CONTACT.hours}
          </a>
          <div className="mt-6">
            <NewsletterForm dark />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title} data-col>
              <p className="eyebrow mb-4 text-gold">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-draw opacity-85 hover:opacity-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div data-col className="col-span-2 flex flex-wrap items-center gap-3 sm:col-span-3">
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="chip border-cream hover:bg-cream hover:text-ink">
              <InstagramIcon width={16} height={16} /> {CONTACT.instagramHandle}
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="chip border-cream hover:bg-cream hover:text-ink">
              <FacebookIcon width={16} height={16} /> Facebook
            </a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="chip border-cream hover:bg-cream hover:text-ink">
              <WhatsappIcon width={16} height={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div data-word className="wrap select-none overflow-hidden" aria-hidden>
        {/* Sized to the content width (max 1440px wrap) so all eight letters always fit. */}
        <p className="display flex justify-between pb-[0.08em] lowercase italic leading-[0.82] text-gold text-[min(21vw,290px)]">
          {WORD.map((l, i) => (
            <span key={i} data-letter className="inline-block">
              {l}
            </span>
          ))}
        </p>
      </div>

      <div className="wrap flex flex-col gap-3 border-t-2 border-cream/15 py-6 text-sm opacity-70 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Sachika Spices. Pure spices, finely ground.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/policies/privacy" className="link-draw">Privacy</Link>
          <Link href="/policies/terms" className="link-draw">Terms</Link>
          <Link href="/policies/shipping" className="link-draw">Shipping</Link>
          <Link href="/policies/returns" className="link-draw">Returns</Link>
        </div>
        <p className="odia">ଶୁଦ୍ଧ ମସଲା, ଶୁଦ୍ଧ ସ୍ୱାଦ</p>
      </div>
    </footer>
  );
}
