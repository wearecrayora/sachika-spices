import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getCategory, getProduct, inr, photosOf, products } from "@/lib/products";
import { Brand, C, OG_SIZE, OG_TYPE, asJpeg, ogDomain, ogFonts, ogImages, ogPhoto, photoFolder } from "@/lib/og";

export const alt = "Sachika Spices product";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const cat = getCategory(p.category)!;
  const size0 = p.sizes[0];
  // Boxes have no photo of their own: show the three products inside.
  const photos = await Promise.all(photosOf(p).slice(0, p.images.length ? 1 : 3).map((src) => ogPhoto(photoFolder(src))));
  const nameSize = p.name.length > 18 ? 66 : 80;

  const image = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.cream }}>
        {/* photo side */}
        <div style={{ display: "flex", position: "relative", width: 560, height: "100%", background: C.ink, borderRight: `4px solid ${C.ink}` }}>
          {photos.length === 1 ? (
            // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only
            <img src={photos[0]} width={560} height={630} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", width: "100%", height: "100%", gap: 4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
              <img src={photos[0]} width={300} height={630} alt="" style={{ objectFit: "cover" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
                <img src={photos[1]} width={256} height={313} alt="" style={{ objectFit: "cover" }} />
                {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
                <img src={photos[2]} width={256} height={313} alt="" style={{ objectFit: "cover" }} />
              </div>
            </div>
          )}
          {p.badge && (
            <div style={{ position: "absolute", left: 28, top: 30, display: "flex", padding: "8px 18px", borderRadius: 999, border: `2px solid ${C.gold}`, background: C.cream, color: C.ink, fontFamily: "Manrope", fontWeight: 800, fontSize: 22, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {p.badge}
            </div>
          )}
        </div>

        {/* details side */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "44px 52px 44px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Brand color={C.ink} scale={0.72} />
            <div style={{ display: "flex", marginTop: 26, fontFamily: "Manrope", fontWeight: 800, fontSize: 20, letterSpacing: 3, color: C.turmericDeep, textTransform: "uppercase" }}>
              Made in Odisha · {cat.name}
            </div>
            <div style={{ display: "flex", marginTop: 14, fontFamily: "Fraunces", fontWeight: 600, fontSize: nameSize, lineHeight: 1, color: C.ink }}>{p.name}</div>
            <div style={{ display: "flex", marginTop: 12, fontFamily: "Manrope", fontWeight: 800, fontSize: 24, color: C.cinnamon }}>From {p.origin} · {size0.label}</div>
            <div style={{ display: "flex", marginTop: 18, fontFamily: "Manrope", fontWeight: 500, fontSize: 27, lineHeight: 1.3, color: C.ink }}>{p.tagline}</div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 600, fontSize: 72, color: C.ink, lineHeight: 1 }}>{inr(size0.price)}</div>
                <div style={{ display: "flex", fontFamily: "Manrope", fontWeight: 800, fontSize: 26, color: C.cinnamon }}>/ {size0.label}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, background: C.ink, color: C.cream, fontFamily: "Manrope", fontWeight: 800, fontSize: 20 }}>{ogDomain}</div>
              </div>
            </div>
            <div style={{ display: "flex", width: 118, height: 118, borderRadius: 999, background: C.cinnamon, alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
              <img src={ogImages.mark} width={86} height={86} alt="" />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
  return asJpeg(image);
}
