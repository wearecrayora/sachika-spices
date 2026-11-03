import { Skeleton } from "@/components/ui/Skeleton";

/*
  Route-level loading screens. The bones come from the real pages
  ("page-hero", "shop-grid", "product-page") captured by `npm run bones`,
  so the placeholder matches the layout that replaces it.
*/

export function ShopSkeleton({ bg = "var(--color-gold)" }: { bg?: string }) {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <section className="border-b border-ink/15 pb-14 pt-[calc(var(--header-h)+3rem)] md:pb-20 md:pt-[calc(var(--header-h)+5rem)]" style={{ background: bg }}>
        <div className="wrap">
          <Skeleton name="page-hero" loading>
            {null}
          </Skeleton>
        </div>
      </section>
      <section className="wrap py-16">
        <Skeleton name="shop-grid" loading>
          {null}
        </Skeleton>
      </section>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <Skeleton name="product-page" loading select="viewport">
        {null}
      </Skeleton>
    </div>
  );
}
