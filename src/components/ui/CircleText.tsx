"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

/* Rotating ring of text; spins faster while the page is being scrolled. */
export default function CircleText({ text, className = "", center }: { text: string; className?: string; center?: React.ReactNode }) {
  const ring = useRef<SVGSVGElement>(null);
  const id = useId();

  useGSAP(() => {
    const spin = gsap.to(ring.current, { rotation: 360, duration: 16, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    const st = ScrollTrigger.create({
      onUpdate(self) {
        const v = Math.min(6, 1 + Math.abs(self.getVelocity()) / 400);
        gsap.to(spin, { timeScale: v, duration: 0.2, overwrite: true });
        gsap.to(spin, { timeScale: 1, duration: 1.2, delay: 0.2 });
      },
    });
    return () => st.kill();
  });

  return (
    <div className={`relative ${className}`}>
      <svg ref={ring} viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <defs>
          <path id={id} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text fill="currentColor" fontSize="17" fontWeight="800" letterSpacing="3.2">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {center ?? (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
        )}
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}
