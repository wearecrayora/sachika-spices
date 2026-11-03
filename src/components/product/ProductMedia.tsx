import Image from "next/image";
import { getProduct, photosOf, type Product } from "@/lib/products";

/*
  Fills its (relative) parent with the product's photo. Festival boxes have no
  photo of their own, so they get a collage of the products inside.
*/
export default function ProductMedia({
  product,
  index = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className = "",
  onReady,
}: {
  product: Product;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Called once the (first) photo has loaded or failed — used to end a skeleton. */
  onReady?: () => void;
}) {
  if (product.images.length) {
    const src = product.images[index % product.images.length];
    return (
      <Image src={src} alt={`${product.name} — photo ${index + 1}`} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} onLoad={onReady} onError={onReady} />
    );
  }

  const parts = (product.includes ?? []).map(getProduct).filter((p): p is Product => !!p);
  const photos = photosOf(product);
  const order = [...photos.slice(index % photos.length), ...photos.slice(0, index % photos.length)];
  return (
    <div className={`absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[3px] bg-ink ${className}`} role="img" aria-label={`${product.name}: ${parts.map((p) => p.name).join(", ")}`}>
      {order.map((src, i) => (
        <div key={src} className={`relative overflow-hidden ${i === 0 ? "row-span-2" : ""}`}>
          <Image src={src} alt="" fill sizes={sizes} className="object-cover" onLoad={i === 0 ? onReady : undefined} onError={i === 0 ? onReady : undefined} />
        </div>
      ))}
    </div>
  );
}
