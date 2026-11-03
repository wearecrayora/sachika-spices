"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { gsap, useGSAP, isFinePointer, reduceMotion } from "@/lib/gsap";
import { getCategory, getProduct, inr, photosOf, type Product } from "@/lib/products";
import { useCart, useUI } from "@/lib/store";
import Ingredient from "@/components/art/Ingredient";
import QtyStepper from "@/components/ui/QtyStepper";
import Accordion from "@/components/ui/Accordion";
import { HeartIcon, InstagramIcon, StarIcon, TruckIcon } from "@/components/ui/Icons";

// Stickers pinned around the photo frame.
const CORNERS = ["-left-5 -top-6", "-right-6 top-[18%]", "-bottom-6 left-[12%]", "-right-4 -bottom-5"];

export default function ProductDetail({ product }: { product: Product }) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.slug));
  const showToast = useUI((s) => s.showToast);
  const size = product.sizes[sizeIdx];
  const off = Math.round((1 - size.price / size.mrp) * 100);
  const cat = getCategory(product.category)!;
  const photos = photosOf(product);
  const inside = (product.includes ?? []).map(getProduct).filter((p): p is Product => !!p);

  useGSAP(
    () => {
      if (reduceMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-pd-frame]"), { scale: 0.7, rotation: -8, y: 80, duration: 1.3, ease: "back.out(1.5)", delay: 0.35 });
      gsap.from(q("[data-sticker]"), { scale: 0, rotation: -90, duration: 0.9, ease: "back.out(2.4)", stagger: 0.1, delay: 0.8 });
      q("[data-sticker] > *").forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? 10 : -10, rotation: i % 2 ? 10 : -10, duration: 2 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      );
      gsap.from(q("[data-pd-in]"), { y: 40, autoAlpha: 0, stagger: 0.06, duration: 1, delay: 0.5 });

      if (isFinePointer()) {
        const stage = q("[data-stage]")[0] as HTMLElement;
        const rx = gsap.quickTo(q("[data-pd-frame]"), "rotationY", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(q("[data-pd-frame]"), "rotationX", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          rx(((e.clientX - r.left) / r.width - 0.5) * 14);
          ry(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const out = () => {
          rx(0);
          ry(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", out);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", out);
        };
      }
    },
    { scope: root },
  );

  // Stop-motion cut between photos: the new shot drops in with a few hard frames of wobble.
  const firstShot = useRef(true);
  useGSAP(
    () => {
      if (firstShot.current) {
        firstShot.current = false;
        return;
      }
      gsap.fromTo(`[data-shot="${shot}"]`, { yPercent: -8, rotation: shot % 2 ? 4 : -4, scale: 1.08, autoAlpha: 0 }, { yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "steps(4)" });
    },
    { dependencies: [shot], scope: root },
  );

  const addToBag = (e?: React.MouseEvent<HTMLButtonElement>) => {
    add(product.slug, size.label, qty);
    showToast(`${qty} × ${product.name} (${size.label}) added`);
    if (e) gsap.fromTo(e.currentTarget, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.fromTo("[data-pd-frame]", { y: 0 }, { y: -30, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
  };

  const checkPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(/^\d{6}$/.test(pin) ? (pin.startsWith("75") ? "Delivers in 1–2 days · COD available" : "Delivers in 3–5 days · COD available") : "Enter a valid 6-digit pincode");
  };

  return (
    <div ref={root} className="wrap grid gap-10 pb-24 pt-[calc(var(--header-h)+1.5rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* gallery */}
      <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <div data-stage className="relative rounded-[36px] border border-ink/15 p-4 md:p-6" style={{ background: product.stage, perspective: 1000 }}>
          <div data-pd-frame className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[24px] border border-ink/15 bg-ink">
              {/* Bone stand-in: boneyard draws square images as circles, so the capture skips <img> and uses this */}
              <span aria-hidden className="absolute inset-0 rounded-[inherit]" />
              {photos.map((src, i) => (
                <div key={src} data-shot={i} className={`absolute inset-0 ${i === shot ? "visible z-10" : "invisible z-0"}`}>
                  <Image src={src} alt={`${product.name} — photo ${i + 1}`} fill priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
            {product.ingredientsArt.concat("sparkle").map((k, i) => (
              <div key={i} data-sticker className={`pointer-events-none absolute z-20 w-14 md:w-20 ${CORNERS[i % CORNERS.length]}`} aria-hidden>
                <div>
                  <Ingredient kind={k} className="w-full drop-shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]" />
                </div>
              </div>
            ))}
          </div>
          {product.badge && (
            <span data-pop className="absolute left-8 top-8 z-30 -rotate-6 rounded-full border border-ink/15 bg-cream px-4 py-1.5 text-sm font-extrabold uppercase text-ink">
              {product.badge}
            </span>
          )}
        </div>

        {photos.length > 1 && (
          <div data-reveal className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2 pt-1" role="tablist" aria-label="Product photos">
            {photos.map((src, i) => (
              <button
                key={src}
                role="tab"
                aria-selected={shot === i}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setShot(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink/15 transition md:h-24 md:w-24 ${shot === i ? "-rotate-3 shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]" : "opacity-60 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* details */}
      <div className="min-w-0">
        <nav data-pd-in className="mb-6 text-sm" aria-label="Breadcrumb">
          <Link href="/shop" className="link-draw opacity-70">Shop</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href={`/collections/${cat.slug}`} className="link-draw opacity-70">{cat.name}</Link>
        </nav>
        <p data-pd-in className="odia text-2xl text-cinnamon">{product.odia}</p>
        <h1 data-split className="display mt-1 text-[13vw] md:text-7xl">
          {product.name}
        </h1>
        <div data-pd-in className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1 font-bold">
            <StarIcon width={18} height={18} className="text-turmeric" /> {product.rating.toFixed(1)}
            <a href="#reviews" className="ml-1 font-normal underline underline-offset-4 opacity-70">
              {product.reviews} reviews
            </a>
          </span>
          <span className="opacity-30">|</span>
          <span className="text-sm">From {product.origin}</span>
          {product.instagram && (
            <>
              <span className="opacity-30">|</span>
              <a href={product.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm underline underline-offset-4">
                <InstagramIcon width={15} height={15} /> See the post
              </a>
            </>
          )}
        </div>
        <p data-pd-in className="mt-6 text-xl font-semibold leading-snug">{product.tagline}</p>

        <div data-pd-in className="mt-8 flex flex-wrap items-end gap-3">
          <span className="display text-6xl">{inr(size.price)}</span>
          {size.mrp > size.price && (
            <>
              <span className="mb-2 text-lg line-through opacity-45">{inr(size.mrp)}</span>
              <span className="mb-2 -rotate-3 rounded-full bg-turmeric px-3 py-1 text-sm font-bold text-cream">{off}% off</span>
            </>
          )}
        </div>
        <p data-pd-in className="mt-1 text-sm opacity-60">
          {product.fromLabel && sizeIdx === 0 ? "MRP as printed on the pack · " : ""}Inclusive of all taxes
        </p>

        {inside.length > 0 && (
          <div data-pd-in className="mt-8 rounded-2xl border border-ink/15 bg-paper p-4">
            <p className="eyebrow mb-3">What&apos;s in the box</p>
            <ul className="grid grid-cols-3 gap-3">
              {inside.map((p) => (
                <li key={p.slug}>
                  <Link href={`/shop/${p.slug}`} className="group block text-center">
                    <span className="relative block aspect-square overflow-hidden rounded-xl border border-ink/15">
                      <span aria-hidden className="absolute inset-0 rounded-[inherit]" />
                      <Image src={p.images[0]} alt="" fill sizes="120px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="mt-1.5 block text-xs font-bold leading-tight">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div data-pd-in className="mt-8">
          <p className="eyebrow mb-3">Size</p>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className={`rounded-2xl border border-ink/15 px-5 py-3 text-left transition ${sizeIdx === i ? "bg-gold shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]" : "bg-paper hover:bg-cream"}`}
                aria-pressed={sizeIdx === i}
              >
                <span className="block font-bold">{s.label}</span>
                <span className="text-sm opacity-70">{inr(s.price)}</span>
              </button>
            ))}
          </div>
        </div>

        <div data-pd-in className="mt-8 flex flex-wrap items-center gap-3">
          <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} min={1} />
          <button onClick={addToBag} className="btn flex-1 py-4 text-base">
            Add to bag · {inr(size.price * qty)}
          </button>
          <button
            onClick={() => toggleWish(product.slug)}
            className={`grid h-14 w-14 place-items-center rounded-full border border-ink/15 transition ${wished ? "bg-turmeric text-cream" : "bg-paper"}`}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={wished}
          >
            <HeartIcon filled={wished} />
          </button>
        </div>
        <button
          data-pd-in
          onClick={() => {
            addToBag();
            router.push("/checkout");
          }}
          className="btn btn-ink mt-3 w-full py-4 text-base"
        >
          Buy it now
        </button>

        <form data-pd-in onSubmit={checkPin} className="mt-8 rounded-2xl border-2 border-dashed border-ink p-4">
          <label htmlFor="pin" className="flex items-center gap-2 font-bold">
            <TruckIcon /> Check delivery
          </label>
          <div className="mt-3 flex gap-2">
            <input id="pin" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="Pincode" className="field py-2.5" />
            <button className="btn btn-gold px-5 py-2.5">Check</button>
          </div>
          {pinMsg && <p className="mt-2 text-sm font-semibold">{pinMsg}</p>}
        </form>

        <ul data-pd-in className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold md:text-sm">
          {["Free delivery over ₹799", "Nothing added, ever", "Cash on delivery"].map((t, i) => (
            <li key={t} className="rounded-2xl border border-ink/15 bg-paper p-3" style={{ rotate: `${(i - 1) * 1.5}deg` }}>
              {t}
            </li>
          ))}
        </ul>

        <div data-pd-in className="mt-10">
          <Accordion
            defaultOpen={0}
            items={[
              { q: "About this product", a: product.description },
              {
                q: "At a glance",
                a: (
                  <ul className="flex flex-wrap gap-2">
                    {product.details.map((d) => (
                      <li key={d} className="chip bg-paper text-sm">{d}</li>
                    ))}
                  </ul>
                ),
              },
              { q: "How to use", a: product.howTo },
              { q: "Shipping & returns", a: "Dispatched within 24 hours from our unit in Odisha. Delivered in 2–5 working days across India. Damaged in transit? Send us a photo within 48 hours and we'll replace it, no questions asked." },
            ]}
          />
        </div>
      </div>

      {/* mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-ink/15 bg-cream p-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{product.name}</p>
          <p className="text-sm opacity-70">{size.label} · {inr(size.price)}</p>
        </div>
        <button onClick={addToBag} className="btn px-5 py-3">Add to bag</button>
      </div>
    </div>
  );
}
