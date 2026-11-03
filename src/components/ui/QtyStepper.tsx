"use client";

import { MinusIcon, PlusIcon } from "./Icons";

export default function QtyStepper({
  value,
  onChange,
  min = 0,
  small = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  small?: boolean;
}) {
  const s = small ? "h-8 w-8" : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-cream">
      <button className={`${s} grid place-items-center rounded-full transition hover:bg-gold`} onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity">
        <MinusIcon width={small ? 14 : 18} height={small ? 14 : 18} />
      </button>
      <span className={`${small ? "w-6 text-sm" : "w-8 text-lg"} text-center font-bold tabular-nums`} aria-live="polite">
        {value}
      </span>
      <button className={`${s} grid place-items-center rounded-full transition hover:bg-gold`} onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <PlusIcon width={small ? 14 : 18} height={small ? 14 : 18} />
      </button>
    </div>
  );
}
