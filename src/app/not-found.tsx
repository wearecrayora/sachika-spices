import Link from "next/link";
import Ingredient from "@/components/art/Ingredient";

export default function NotFound() {
  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-gold px-[var(--gutter)] pt-[var(--header-h)] text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Ingredient kind="turmeric" className="absolute left-[8%] top-[24%] w-20 rotate-12" />
        <Ingredient kind="chilli" className="absolute bottom-[18%] right-[10%] w-24" />
        <Ingredient kind="sparkle" className="absolute right-[20%] top-[18%] w-12" />
      </div>
      <div className="relative">
        <p data-pop className="display text-[40vw] leading-none text-turmeric md:text-[22vw]">404</p>
        <h1 data-split className="display -mt-4 text-5xl md:text-7xl">
          This pouch is empty.
        </h1>
        <p data-reveal className="mx-auto mt-4 max-w-md text-lg">
          The page you&apos;re looking for has been used up, moved, or never existed. The spice rack is still full, though.
        </p>
        <div data-reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ink">Go home</Link>
          <Link href="/shop" className="btn">Shop the spices</Link>
        </div>
      </div>
    </div>
  );
}
