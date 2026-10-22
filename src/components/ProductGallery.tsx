"use client";

import Image from "next/image";
import { useState } from "react";
import { isPlaceholderImage } from "@/data/products";

export default function ProductGallery({ images, name, soldOut }: { images: string[]; name: string; soldOut?: boolean }) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-card bg-photo">
        <Image
          src={src}
          alt={name}
          fill
          preload
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover ${soldOut ? "opacity-50" : ""}`}
        />
        {isPlaceholderImage(src) && (
          <span className="absolute inset-0 flex items-center justify-center text-[15px] text-muted">
            Ảnh: {name.toLowerCase()}
          </span>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-[3px] bg-ink px-3 py-1 text-[13px] font-bold text-white">Hết hàng</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative size-20 shrink-0 overflow-hidden rounded-btn border-2 ${
                i === active ? "border-primary" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
