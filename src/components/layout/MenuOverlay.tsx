"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useUI } from "@/lib/store";
import { CONTACT, getProduct } from "@/lib/products";
import PackShot from "@/components/product/PackShot";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/Icons";

const LINKS = [
  { href: "/", label: "Home", odia: "ଘର", art: "turmeric-powder" },
  { href: "/shop", label: "Shop all", odia: "ଦୋକାନ", art: "chilli-powder" },
  { href: "/collections/spices", label: "Ground spices", odia: "ମସଲା", art: "coriander-powder" },
  { href: "/collections/grains", label: "Maize & millets", odia: "ମାଣ୍ଡିଆ", art: "maize-millet-blend" },
  { href: "/collections/boxes", label: "Gift boxes", odia: "ଉପହାର", art: "diwali-box" },
  { href: "/process", label: "Our process", odia: "ପ୍ରକ୍ରିୟା", art: "cumin-powder" },
  { href: "/about", label: "Our story", odia: "କାହାଣୀ", art: "maize-powder" },
];

const SMALL = [
  { href: "/track-order", label: "Track order" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function MenuOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const { menuOpen, setMenu } = useUI();
  const [hover, setHover] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(root.current, { clipPath: "circle(0% at 3% 3%)" }, { clipPath: "circle(150% at 3% 3%)", duration: 1.1, ease: "expo.inOut" })
        .from(q("[data-line]"), { yPercent: 120, rotation: 4, duration: 0.9, stagger: 0.06 }, 0.35)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.05 }, 0.6)
        .from(q("[data-preview]"), { scale: 0.4, rotation: -20, autoAlpha: 0, duration: 1, ease: "back.out(1.6)" }, 0.5);

      gsap.to(q("[data-rail]"), { yPercent: -50, duration: 18, ease: "none", repeat: -1 });
    },
    { scope: root },
  );

  useGSAP(() => {
    if (!tl.current) return;
    if (menuOpen) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();
  }, [menuOpen]);

  // Preview pack does a stop-motion hop when the hovered link changes.
  useGSAP(
    () => {
      gsap.fromTo("[data-preview-art]", { y: 30, rotation: -12, scale: 0.9 }, { y: 0, rotation: 0, scale: 1, duration: 0.6, ease: "back.out(2.5)" });
    },
    { dependencies: [hover], scope: root },
  );

  const art = getProduct(LINKS[hover].art)!;

  return (
    <div ref={root} className="invisible fixed inset-0 z-40 overflow-hidden bg-cinnamon text-cream" aria-hidden={!menuOpen} role="dialog" aria-label="Site menu">
      <div className="wrap grid h-full grid-cols-1 gap-8 pb-8 pt-[calc(var(--header-h)+2vh)] md:grid-cols-[1.3fr_1fr]">
        <nav className="flex flex-col justify-center" aria-label="Menu">
          <ul>
            {LINKS.map((l, i) => (
              <li key={l.href} className="overflow-hidden" onMouseEnter={() => setHover(i)}>
                <Link
                  href={l.href}
                  onClick={() => setMenu(false)}
                  data-line
                  className="group flex items-baseline gap-4 py-0.5"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className="display text-[13vw] leading-[1.02] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-4 md:text-[min(5.6vw,9.5vh)]">
                    {l.label}
                  </span>
                  <span className="odia text-lg opacity-0 transition-opacity duration-300 group-hover:opacity-80 md:text-2xl">{l.odia}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {SMALL.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setMenu(false)} data-fade className="link-draw font-semibold" tabIndex={menuOpen ? 0 : -1}>
                {s.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="relative hidden items-center justify-center md:flex">
          <div data-preview className="relative aspect-square w-[78%] rounded-full border border-ink/15 bg-gold shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]">
            <div data-preview-art className="absolute inset-[10%] flex justify-center">
              <PackShot product={art} className="h-full" sizes="320px" />
            </div>
          </div>
          <div data-fade className="absolute bottom-0 left-0 right-0 flex items-end justify-between">
            <div>
              <p className="eyebrow opacity-70">Call us</p>
              <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`} className="link-draw text-lg font-bold">{CONTACT.phones[0]}</a>
            </div>
            <div className="flex gap-2">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-cream/50" aria-label="Sachika Spices on Instagram">
                <InstagramIcon />
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-cream/50" aria-label="WhatsApp">
                <WhatsappIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* vertical rail of the tagline, running up the right edge */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-14 overflow-hidden border-l border-ink/15 bg-gold text-ink xl:block">
        <div data-rail className="flex flex-col items-center">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="display whitespace-nowrap py-6 text-2xl [writing-mode:vertical-rl]">
              Pure spices, finely ground ✦
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
