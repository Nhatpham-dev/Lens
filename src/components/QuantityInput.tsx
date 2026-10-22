"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityInput({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-10" : "h-12";
  const btn = `inline-flex ${size === "sm" ? "w-10" : "w-11"} items-center justify-center text-ink disabled:opacity-30`;
  return (
    <div className={`inline-flex ${h} items-center rounded-btn border border-border bg-white`}>
      <button type="button" className={`${btn} h-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Giảm số lượng">
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(1, Math.min(n, max)));
        }}
        aria-label="Số lượng"
        className="h-full w-10 bg-transparent text-center text-base font-bold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        className={`${btn} h-full`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
