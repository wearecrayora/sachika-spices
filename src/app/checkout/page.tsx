"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { gsap, useGSAP, reduceMotion } from "@/lib/gsap";
import { cartTotals, useCart, useCartHydrated } from "@/lib/store";
import OrderSummary from "@/components/cart/OrderSummary";
import { Skeleton, useSkeletonCapture } from "@/components/ui/Skeleton";

const STEPS = ["Contact", "Delivery", "Payment"] as const;

const PAYMENTS = [
  { id: "upi", label: "UPI", note: "GPay, PhonePe, Paytm, BHIM" },
  { id: "card", label: "Credit / Debit card", note: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net banking", note: "All major Indian banks" },
  { id: "cod", label: "Cash on delivery", note: "₹30 handling fee" },
];

const STATES = ["Odisha", "Andhra Pradesh", "Delhi", "Karnataka", "Maharashtra", "Telangana", "Tamil Nadu", "West Bengal", "Other"];

function Field({ label, id, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input id={id} className="field" {...rest} />
    </label>
  );
}

export default function CheckoutPage() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState("upi");
  const [speed, setSpeed] = useState("standard");
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const t = cartTotals(lines);
  const hydrated = useCartHydrated();
  const capture = useSkeletonCapture();

  useGSAP(
    () => {
      if (!reduceMotion()) gsap.fromTo("[data-step-panel] > *", { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.7 });
      gsap.to("[data-step-bar]", { scaleX: (step + 1) / STEPS.length, duration: 0.8, ease: "expo.inOut" });
    },
    // Re-run once the persisted bag hydrates and the form actually mounts.
    { dependencies: [step, hydrated && lines.length > 0], scope: root },
  );

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const id = "SCK" + String(Math.floor(100000 + Math.random() * 899999));
    try {
      sessionStorage.setItem("sachika-last-order", JSON.stringify({ id, total: t.total, count: t.count, pay }));
    } catch {}
    clear();
    router.push("/checkout/success");
  };

  const form = (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <form onSubmit={next}>
        <ol className="mb-3 flex justify-between text-sm font-bold" aria-label="Checkout steps">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button type="button" disabled={i > step} onClick={() => setStep(i)} className={`flex items-center gap-2 ${i <= step ? "" : "opacity-40"}`} aria-current={i === step ? "step" : undefined}>
                <span className={`grid h-8 w-8 place-items-center rounded-full border border-ink/15 ${i < step ? "bg-ink text-cream" : i === step ? "bg-turmeric text-cream" : "bg-paper"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </button>
            </li>
          ))}
        </ol>
        <div className="mb-10 h-2 overflow-hidden rounded-full border border-ink/15 bg-paper">
          <div data-step-bar className="h-full origin-left scale-x-0 bg-turmeric" />
        </div>

        <div data-step-panel key={step} className="space-y-5">
          {step === 0 && (
            <>
              <h2 className="display text-4xl">Who&apos;s eating?</h2>
              <Field label="Full name" id="name" required autoComplete="name" placeholder="Sasmita Pradhan" />
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Mobile number" id="phone" required type="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" />
                <Field label="Email" id="email" required type="email" autoComplete="email" placeholder="you@email.com" />
              </div>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-[var(--color-turmeric)]" /> Send me order updates on WhatsApp
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="display text-4xl">Where to?</h2>
              <Field label="House / flat, street" id="line1" required autoComplete="address-line1" />
              <Field label="Area, landmark" id="line2" autoComplete="address-line2" />
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Pincode" id="zip" required inputMode="numeric" maxLength={6} autoComplete="postal-code" />
                <Field label="City" id="city" required autoComplete="address-level2" />
                <label htmlFor="state" className="block">
                  <span className="mb-1.5 block text-sm font-bold">State</span>
                  <select id="state" className="field" defaultValue="Odisha">
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <fieldset className="grid gap-3 md:grid-cols-2">
                <legend className="mb-2 text-sm font-bold">Delivery speed</legend>
                {[
                  { id: "standard", t: "Standard", d: "3–5 working days", p: t.shipping === 0 ? "Free" : "₹79" },
                  { id: "express", t: "Express", d: "1–2 working days", p: "₹149" },
                ].map((o) => (
                  <label key={o.id} className={`flex cursor-pointer items-center justify-between rounded-2xl border border-ink/15 p-4 transition ${speed === o.id ? "bg-gold shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]" : "bg-paper"}`}>
                    <span>
                      <input type="radio" name="speed" value={o.id} checked={speed === o.id} onChange={() => setSpeed(o.id)} className="sr-only" />
                      <span className="block font-bold">{o.t}</span>
                      <span className="text-sm opacity-70">{o.d}</span>
                    </span>
                    <span className="font-bold">{o.p}</span>
                  </label>
                ))}
              </fieldset>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="display text-4xl">How&apos;d you like to pay?</h2>
              <fieldset className="space-y-3">
                <legend className="sr-only">Payment method</legend>
                {PAYMENTS.map((p) => (
                  <label key={p.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border border-ink/15 p-4 transition ${pay === p.id ? "bg-gold shadow-[0_24px_50px_-24px_rgba(43,22,12,0.45)]" : "bg-paper"}`}>
                    <input type="radio" name="pay" value={p.id} checked={pay === p.id} onChange={() => setPay(p.id)} className="h-5 w-5 accent-[var(--color-turmeric)]" />
                    <span>
                      <span className="block font-bold">{p.label}</span>
                      <span className="text-sm opacity-70">{p.note}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              {pay === "upi" && <Field label="UPI ID" id="upi" placeholder="name@okaxis" />}
              {pay === "card" && (
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="md:col-span-3">
                    <Field label="Card number" id="cc" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
                  </div>
                  <Field label="Expiry" id="exp" placeholder="MM/YY" autoComplete="cc-exp" />
                  <Field label="CVV" id="cvv" placeholder="•••" autoComplete="cc-csc" />
                </div>
              )}
              <p className="rounded-2xl border-2 border-dashed border-ink p-4 text-sm">
                Demo checkout — no payment is taken. Payment gateway (Razorpay / Cashfree) to be connected in the build phase.
              </p>
            </>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="font-bold underline underline-offset-4">
              ← Back
            </button>
          ) : (
            <Link href="/cart" className="font-bold underline underline-offset-4">← Back to bag</Link>
          )}
          <button className="btn px-8 py-4 text-base">{step === STEPS.length - 1 ? "Place order" : `Continue to ${STEPS[step + 1].toLowerCase()}`}</button>
        </div>
      </form>

      <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <OrderSummary compact />
      </div>
    </div>
  );

  return (
    <div ref={root} className="wrap pb-28 pt-[calc(var(--header-h)+3rem)]">
      <h1 data-split className="display text-[16vw] md:text-[6vw]">
        Checkout
      </h1>

      {!hydrated || capture ? (
        // The bag is read from localStorage after hydration; shimmer instead of flashing "empty".
        <Skeleton name="checkout" loading fixture={form}>
          {null}
        </Skeleton>
      ) : lines.length === 0 ? (
        <div className="py-16">
          <p className="text-lg">Your bag is empty, so there&apos;s nothing to check out yet.</p>
          <Link href="/shop" className="btn mt-6">Back to the spices</Link>
        </div>
      ) : (
        form
      )}
    </div>
  );
}
