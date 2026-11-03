import Ingredient from "@/components/art/Ingredient";
import { Skeleton } from "@/components/ui/Skeleton";
import type { IngredientKind } from "@/lib/products";

/* Shared top-of-page banner for inner pages. */
export default function PageHero({
  kicker,
  title,
  odia,
  intro,
  bg = "var(--color-gold)",
  fg = "var(--color-ink)",
  ingredients = ["chilli", "sparkle", "leaf"],
  children,
}: {
  kicker: string;
  title: string;
  odia?: string;
  intro?: string;
  bg?: string;
  fg?: string;
  ingredients?: IngredientKind[];
  children?: React.ReactNode;
}) {
  const spots = [
    { c: "right-[6%] top-[22%] w-16 md:w-28", s: "0.8" },
    { c: "right-[24%] bottom-[12%] w-10 md:w-16", s: "0.4" },
    { c: "right-[3%] bottom-[18%] w-12 md:w-20", s: "1.2" },
  ];
  return (
    <section className="relative overflow-hidden border-b border-ink/15 pb-14 pt-[calc(var(--header-h)+3rem)] md:pb-20 md:pt-[calc(var(--header-h)+5rem)]" style={{ background: bg, color: fg }}>
      {odia && (
        <span className="odia pointer-events-none absolute -bottom-[0.25em] right-[-0.05em] select-none text-[34vw] font-bold leading-none opacity-[0.08] md:text-[22vw]" aria-hidden>
          {odia}
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
        {ingredients.map((k, i) => (
          <div key={i} data-pop className={`absolute ${spots[i % 3].c}`}>
            <div data-speed={spots[i % 3].s}>
              <Ingredient kind={k} className="w-full" />
            </div>
          </div>
        ))}
      </div>
      {/* Captured as the "page-hero" skeleton used by route loading.tsx files */}
      <Skeleton name="page-hero" loading={false} className="wrap relative">
        <p className="eyebrow mb-4 opacity-80">{kicker}</p>
        <h1 data-split className="display max-w-[14ch] text-[15vw] md:text-[8vw]">
          {title}
        </h1>
        {intro && (
          <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl">
            {intro}
          </p>
        )}
        {children}
      </Skeleton>
    </section>
  );
}
