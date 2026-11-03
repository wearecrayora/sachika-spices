import Image from "next/image";
import { packsOf, type Product } from "@/lib/products";

// How the three packs of a festival box fan out (percent of the frame).
const FAN = [
  { left: "0%", top: "6%", rotate: -11, z: 1 },
  { left: "36%", top: "6%", rotate: 11, z: 1 },
  { left: "18%", top: "0%", rotate: 0, z: 2 },
];

/*
  The real product pack, cut out on a transparent background. Fills a 2:3 box;
  festival boxes show their three packs fanned together.
*/
export default function PackShot({
  product,
  className = "",
  sizes = "(min-width: 768px) 25vw, 50vw",
  priority = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const packs = packsOf(product);
  const shadow = "drop-shadow-[0_18px_16px_rgba(43,22,12,0.35)]";

  return (
    <div className={`relative aspect-[2/3] ${className}`} role="img" aria-label={`${product.name} pack`}>
      {packs.length === 1 ? (
        <Image src={packs[0]} alt="" fill sizes={sizes} priority={priority} className={`object-contain ${shadow}`} />
      ) : (
        packs.slice(0, 3).map((src, i) => (
          <div
            key={src}
            className="absolute h-[92%] w-[64%]"
            style={{ left: FAN[i].left, top: FAN[i].top, rotate: `${FAN[i].rotate}deg`, zIndex: FAN[i].z }}
          >
            <Image src={src} alt="" fill sizes={sizes} priority={priority} className={`object-contain ${shadow}`} />
          </div>
        ))
      )}
    </div>
  );
}
