"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduceMotion } from "@/lib/gsap";
import { useCart, useUI } from "@/lib/store";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export default function SmoothScroll() {
  const pathname = usePathname();
  const locked = useUI((s) => s.menuOpen || s.cartOpen || s.searchOpen || !s.loaded);

  useEffect(() => {
    useCart.persist.rehydrate();
    if (reduceMotion()) return;

    // Touch devices keep native scrolling (syncTouch off) so momentum feels right;
    // ScrollTrigger still drives every scroll animation on mobile.
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (locked) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [locked]);

  useEffect(() => {
    // Any route change closes whatever overlay was open (menu, bag, search).
    useUI.setState({ menuOpen: false, cartOpen: false, searchOpen: false });
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    // Let the new page's layout settle before measuring triggers.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
