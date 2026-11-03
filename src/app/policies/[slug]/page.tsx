import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";

// Placeholder legal copy — to be replaced with client-approved policies.
const POLICIES: Record<string, { title: string; body: { h: string; p: string }[] }> = {
  shipping: {
    title: "Shipping policy",
    body: [
      { h: "Dispatch", p: "Orders are packed and dispatched from our unit in Odisha within 24 hours on working days." },
      { h: "Delivery times", p: "Odisha: 1–2 working days. Metro cities: 3–4 working days. Rest of India: 4–6 working days." },
      { h: "Charges", p: "Free delivery on orders above ₹799. A flat ₹79 applies below that. Express delivery is ₹149." },
      { h: "Bulk orders", p: "Wholesale orders ship by surface freight; we'll call you to confirm the delivery date." },
    ],
  },
  returns: {
    title: "Returns & refunds",
    body: [
      { h: "Damaged items", p: "If anything arrives damaged or leaking, send a photo within 48 hours of delivery and we'll replace it or refund you in full." },
      { h: "Food returns", p: "For hygiene reasons, opened food products can't be returned." },
      { h: "Refund timeline", p: "Approved refunds are processed within 5–7 working days to the original payment method." },
    ],
  },
  privacy: {
    title: "Privacy policy",
    body: [
      { h: "What we collect", p: "Your name, contact details and delivery address — only what we need to deliver your order." },
      { h: "How we use it", p: "To process orders, send order updates and, if you opt in, our monthly newsletter. We never sell your data." },
      { h: "Your choices", p: "Write to hello@sachikaspices.com anytime to see, change or delete what we hold about you." },
    ],
  },
  terms: {
    title: "Terms of service",
    body: [
      { h: "Using this site", p: "By placing an order you agree to these terms. Prices are in INR and include applicable taxes." },
      { h: "Product information", p: "We describe products as accurately as we can. Natural spices vary slightly in colour and strength from harvest to harvest — that's what real spice does." },
      { h: "Governing law", p: "These terms are governed by the laws of India, with jurisdiction in Odisha." },
    ],
  },
};

// Every slug is prerendered by generateStaticParams, so navigations here are already
// instant; opt out of the dev-time Suspense validation for the params read.
export const instant = false;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  return p ? pageMeta({ title: p.title, description: p.body[0].p, path: `/policies/${slug}` }) : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="wrap grid gap-12 pb-28 pt-[calc(var(--header-h)+4rem)] md:grid-cols-[220px_1fr]">
      <nav className="flex flex-wrap gap-2 md:sticky md:top-[calc(var(--header-h)+2rem)] md:flex-col md:self-start" aria-label="Policies">
        {Object.entries(POLICIES).map(([k, v]) => (
          <Link key={k} href={`/policies/${k}`} className={`chip justify-start ${k === slug ? "bg-ink text-cream" : "bg-paper hover:bg-gold"}`}>
            {v.title}
          </Link>
        ))}
      </nav>
      <article className="max-w-2xl">
        <p className="eyebrow mb-3 text-turmeric">Last updated · November 2026</p>
        <h1 data-split className="display text-[13vw] md:text-7xl">
          {policy.title}
        </h1>
        <div className="mt-12 space-y-10">
          {policy.body.map((b) => (
            <section key={b.h} data-reveal>
              <h2 className="text-2xl font-bold">{b.h}</h2>
              <p className="mt-2 text-lg leading-relaxed opacity-85">{b.p}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
