"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

/*
  Infinite band that reacts to scroll: speeds up with scroll velocity and
  flips direction when the reader scrolls back up.
*/
export default function Marquee({
  items,
  className = "",
  speed = 30,
  reverse = false,
  separator = "✦",
  itemClassName = "",
}: {
  items: React.ReactNode[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: React.ReactNode;
  itemClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current!.querySelector("[data-track]");
      const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 });
      // Start deep into the repeat so a negative timeScale never hits time 0.
      loop.totalTime(speed * 200);
      let dir = 1;
      const st = ScrollTrigger.create({
        onUpdate(self) {
          if (self.direction !== dir) dir = self.direction;
          const v = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 500);
          gsap.to(loop, { timeScale: dir * v, duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1, delay: 0.25 });
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((it, i) => (
        <span key={i} className={`flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          <span className="px-[0.5em]">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div data-track className="flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
