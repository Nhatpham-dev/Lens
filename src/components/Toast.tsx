"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useToast } from "@/store/cart";

export default function Toast() {
  const { message, cartLink, hide } = useToast();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 md:top-28">
      {message && (
        <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-card bg-ink py-3 pl-5 pr-2 text-[15px] text-white shadow-xl">
          <p className="leading-6">
            {message}
            {cartLink && (
              <>
                {" — "}
                <Link href="/gio-hang" onClick={hide} className="font-bold underline underline-offset-2">
                  Xem giỏ
                </Link>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={hide}
            aria-label="Đóng thông báo"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
