import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getProduct, inr, products, related } from "@/lib/products";
import ProductDetail from "@/components/product/ProductDetail";
import ProductCard from "@/components/product/ProductCard";
import Reviews from "@/components/product/Reviews";
import Marquee from "@/components/ui/Marquee";
import { Skeleton } from "@/components/ui/Skeleton";

// Every slug is prerendered by generateStaticParams, so navigations here are already
// instant; opt out of the dev-time Suspense validation for the params read.
export const instant = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const from = p.sizes[0];
  return pageMeta({
    title: p.name,
    description: `${p.tagline} ${inr(from.price)} for ${from.label}. ${p.description.split(". ")[0]}.`,
    path: `/shop/${p.slug}`,
    image: { url: `/shop/${p.slug}/opengraph-image`, alt: `${p.name} by Sachika Spices — ${inr(from.price)} for ${from.label}` },
  });
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      {/* Captured as the "product-page" skeleton shown by loading.tsx */}
      <Skeleton name="product-page" loading={false} snapshotConfig={{ excludeSelectors: ["img"] }}>
        <ProductDetail product={product} />
      </Skeleton>

      <div className="border-y border-ink/15 bg-gold py-4">
        <Marquee
          items={product.details.map((i) => (
            <span key={i} className="display text-3xl md:text-4xl">
              {i}
            </span>
          ))}
          separator={<span className="text-turmeric">✦</span>}
          speed={24}
        />
      </div>

      <Reviews product={product} />

      <section className="wrap pb-28">
        <h2 data-split className="display mb-10 text-[12vw] md:text-6xl">
          Pairs well with
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {related(product).map((p) => (
            <div key={p.slug} data-reveal>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
