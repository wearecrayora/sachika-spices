"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { cartTotals, useCart, useUI } from "@/lib/store";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/process", label: "Our process" },
  { href: "/collections/boxes", label: "Gift boxes" },
  { href: "/about", label: "Our Story" },
];

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const wish = useCart((s) => s.wishlist.length);
  const { count } = cartTotals(lines);
  const { menuOpen, setMenu, setCart, setSearch, loaded } = useUI();
  const [solid, setSolid] = useState(false);

  useGSAP(
    () => {
      gsap.set(root.current, { yPercent: -110 });
      if (!loaded) return;
      gsap.to(root.current, { yPercent: 0, duration: 1, delay: 0.5 });

      // Hide on the way down, return on the way up.
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          setSolid(self.scroll() > 40);
          if (useUI.getState().menuOpen) return;
          const hide = self.direction === 1 && self.scroll() > 240;
          gsap.to(root.current, { yPercent: hide ? -110 : 0, duration: 0.6, overwrite: "auto" });
          // Sticky bars (shop filters) slide up into the space the header leaves.
          document.documentElement.style.setProperty("--header-offset", hide ? "0px" : "var(--header-h)");
        },
      });
      return () => {
        st.kill();
        document.documentElement.style.removeProperty("--header-offset");
      };
    },
    { dependencies: [loaded] },
  );

  // Bounce the bag count whenever it changes.
  useEffect(() => {
    if (!countRef.current || count === 0) return;
    gsap.fromTo(countRef.current, { scale: 1.8, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  }, [count]);

  const onDark = pathname === "/" && !solid && !menuOpen;

  return (
    <header
      ref={root}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid && !menuOpen ? "border-b border-ink/15 bg-cream/90 backdrop-blur-md" : "bg-transparent"
      } ${onDark || menuOpen ? "text-cream" : "text-ink"}`}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-6">
          <button
            onClick={() => setMenu(!menuOpen)}
            className="group flex items-center gap-3 font-bold"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-7">
              <span className={`absolute left-0 block h-[3px] w-full rounded bg-current transition-all duration-500 ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 group-hover:w-5"}`} />
              <span className={`absolute left-0 block h-[3px] w-full rounded bg-current transition-all duration-500 ${menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
            <span className="hidden text-sm uppercase tracking-[0.14em] sm:inline">{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`link-draw text-sm font-semibold ${pathname.startsWith(n.href) ? "bg-[length:100%_2px]" : ""}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Sachika Spices home" onClick={() => setMenu(false)}>
          <Image src="/brand/sachika-mark.png" alt="" width={48} height={48} className="h-9 w-9 md:h-11 md:w-11" priority />
          <span className="flex flex-col leading-none">
            <span className="display text-[1.35rem] uppercase tracking-[0.08em] md:text-[1.6rem]">Sachika</span>
            <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.5em] opacity-70 md:text-[0.6rem]">Spices</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <button onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-current/10" aria-label="Search">
            <SearchIcon />
          </button>
          <Link href="/account" className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-current/10 sm:grid" aria-label="Account">
            <UserIcon />
          </Link>
          <Link href="/wishlist" className="relative hidden h-10 w-10 place-items-center rounded-full transition hover:bg-current/10 sm:grid" aria-label={`Wishlist, ${wish} items`}>
            <HeartIcon />
            {wish > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-chilli ring-2 ring-cream" />}
          </Link>
          <button
            onClick={() => setCart(true)}
            className="ml-1 flex items-center gap-2 rounded-full border border-ink/15 bg-gold py-1.5 pl-3 pr-1.5 font-bold text-ink shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)] transition hover:-translate-y-0.5"
            aria-label={`Open bag, ${count} items`}
          >
            <BagIcon width={18} height={18} />
            <span className="hidden text-sm sm:inline">Bag</span>
            <span ref={countRef} className="grid h-7 min-w-7 place-items-center rounded-full bg-ink px-1.5 text-xs text-cream">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
