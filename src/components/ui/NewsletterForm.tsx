"use client";

import { useState } from "react";
import { ArrowIcon } from "./Icons";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className={`display text-2xl ${dark ? "text-gold" : "text-turmeric"}`}>Dhanyabad! Check your inbox.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className={`flex items-center rounded-full border-2 p-1.5 ${dark ? "border-cream" : "border-ink bg-paper"}`}
    >
      <label htmlFor={dark ? "nl-footer" : "nl-main"} className="sr-only">
        Email address
      </label>
      <input
        id={dark ? "nl-footer" : "nl-main"}
        type="email"
        required
        placeholder="you@email.com"
        className="min-w-0 flex-1 bg-transparent px-4 py-2 outline-none placeholder:opacity-50"
      />
      <button className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-bold transition hover:gap-3 ${dark ? "bg-gold text-ink" : "bg-turmeric text-cream"}`}>
        Join <ArrowIcon width={16} height={16} />
      </button>
    </form>
  );
}
