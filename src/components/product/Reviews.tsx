import type { Product } from "@/lib/products";
import { StarIcon } from "@/components/ui/Icons";

// Placeholder reviews for the approval build — to be replaced with real Google reviews.
const SAMPLE = [
  { name: "Subhashree M.", city: "Bhubaneswar", stars: 5, text: "You can smell it the moment the zip opens. Clean, bright and beautifully packed." },
  { name: "Rohan P.", city: "Mumbai", stars: 5, text: "Ordered twice already. The batch date on the pouch is a nice touch — you know it's fresh." },
  { name: "Ananya S.", city: "Bengaluru", stars: 4, text: "Great quality. Would love a 1 kg pack for the family kitchen!" },
];

export default function Reviews({ product }: { product: Product }) {
  const bars = [78, 15, 5, 1, 1];
  return (
    <section id="reviews" className="wrap grid gap-12 py-24 md:grid-cols-[1fr_2fr]">
      <div>
        <p className="eyebrow mb-3 text-turmeric">Reviews</p>
        <p className="display text-8xl">{product.rating.toFixed(1)}</p>
        <p className="mt-2 flex text-turmeric" aria-label={`${product.rating} out of 5`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} />
          ))}
        </p>
        <p className="mt-2 opacity-70">Based on {product.reviews} reviews</p>
        <div className="mt-6 space-y-2">
          {bars.map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-3">{5 - i}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-ink/15 bg-paper">
                <div data-reveal className="h-full bg-turmeric" style={{ width: `${b}%` }} />
              </div>
              <span className="w-8 text-right opacity-60">{b}%</span>
            </div>
          ))}
        </div>
        <button className="btn btn-gold mt-8">Write a review</button>
      </div>
      <ul className="space-y-5">
        {SAMPLE.map((r, i) => (
          <li key={r.name} data-reveal className="rounded-3xl border border-ink/15 bg-paper p-6" style={{ rotate: `${(i - 1) * 0.6}deg` }}>
            <div className="flex items-center justify-between">
              <p className="font-bold">
                {r.name} <span className="font-normal opacity-60">· {r.city}</span>
              </p>
              <span className="flex text-turmeric">
                {Array.from({ length: r.stars }, (_, s) => (
                  <StarIcon key={s} width={16} height={16} />
                ))}
              </span>
            </div>
            <p className="mt-3 text-lg leading-snug">{r.text}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider opacity-50">Verified buyer</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
