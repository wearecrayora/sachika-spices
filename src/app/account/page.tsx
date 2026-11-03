"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getProduct } from "@/lib/products";
import PackShot from "@/components/product/PackShot";

export default function AccountPage() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [otpSent, setOtpSent] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo("[data-form] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6 });
    },
    { dependencies: [mode, otpSent], scope: root },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) setOtpSent(true);
    else router.push("/account/orders");
  };

  const art = [getProduct("turmeric-powder")!, getProduct("chilli-powder")!, getProduct("cumin-powder")!];

  return (
    <div ref={root} className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-ink/15 bg-cinnamon text-cream lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12 pt-[calc(var(--header-h)+3rem)]">
          <h2 data-split className="display max-w-[10ch] text-[6vw]">
            Welcome back to the spice room.
          </h2>
          <div className="relative h-[45%]">
            {art.map((p, i) => (
              <div key={p.slug} data-pop className="absolute bottom-0 w-[32%]" style={{ left: `${8 + i * 28}%`, rotate: `${(i - 1) * 10}deg` }}>
                <PackShot product={p} className="w-full" sizes="20vw" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-[var(--gutter)] pb-16 pt-[calc(var(--header-h)+3rem)]">
        <div className="w-full max-w-md">
          <div className="mb-8 inline-flex rounded-full border border-ink/15 bg-paper p-1" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setOtpSent(false);
                }}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${mode === m ? "bg-ink text-cream" : ""}`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form data-form onSubmit={submit} className="space-y-5">
            <h1 className="display text-5xl">{mode === "login" ? "Namaskar!" : "Join Sachika"}</h1>
            <p className="opacity-70">{mode === "login" ? "Sign in with your mobile number — we'll send a one-time code." : "Track orders, save addresses and get first dibs on festival boxes."}</p>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Your name</span>
                <input required className="field" autoComplete="name" />
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Mobile number</span>
              <div className="flex gap-2">
                <span className="field w-auto shrink-0 font-bold">+91</span>
                <input required type="tel" inputMode="numeric" maxLength={10} className="field" autoComplete="tel-national" placeholder="98xxx xxxxx" />
              </div>
            </label>
            {otpSent && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Enter the 6-digit code</span>
                <input required inputMode="numeric" maxLength={6} className="field text-center text-2xl tracking-[0.6em]" autoComplete="one-time-code" placeholder="••••••" />
                <span className="mt-2 block text-xs opacity-60">Demo: any 6 digits will do.</span>
              </label>
            )}
            <button className="btn w-full py-4 text-base">{otpSent ? "Verify & continue" : "Send OTP"}</button>
            <div className="flex items-center gap-3 text-sm opacity-60">
              <span className="h-0.5 flex-1 bg-ink/20" /> or <span className="h-0.5 flex-1 bg-ink/20" />
            </div>
            <button type="button" className="btn btn-cream w-full">Continue with Google</button>
            <p className="text-center text-xs opacity-60">
              By continuing you agree to our <Link href="/policies/terms" className="underline">Terms</Link> and <Link href="/policies/privacy" className="underline">Privacy policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
