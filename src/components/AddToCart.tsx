"use client";

import { useState } from "react";
import { Check, Heart } from "lucide-react";
import { describeCustom, shop, type CustomDesign } from "@/config/shop";
import type { Product } from "@/data/products";
import { useCart, useToast } from "@/store/cart";
import { useWishlist, useWishlistHydrated } from "@/store/wishlist";
import QuantityInput from "./QuantityInput";

type Mode = "san-co" | "rieng";

/**
 * Trang chi tiết: chọn "Mẫu có sẵn" hoặc "Đặt làm riêng" (màu len + chữ thêu + kiểu chữ),
 * chọn size (nếu có), số lượng, thêm vào giỏ, yêu thích.
 * Thiết kế riêng đi theo dòng hàng trong giỏ và hiện trong tin nhắn đơn gửi shop.
 */
export default function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const wishReady = useWishlistHydrated();

  const [mode, setMode] = useState<Mode>("san-co");
  const [color, setColor] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [font, setFont] = useState(shop.customFonts[0]);
  const [colorError, setColorError] = useState(false);

  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const soldOut = product.stock <= 0;
  const needsSize = product.sizes.length > 0;
  const colorHex = shop.customColors.find((c) => c.name === color)?.hex;

  function handleAdd() {
    if (needsSize && !size) {
      setSizeError(true);
      document.getElementById("size-picker")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    let custom: CustomDesign | undefined;
    if (mode === "rieng") {
      if (!color) {
        setColorError(true);
        document.getElementById("color-picker")?.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      custom = { color, text: text.trim(), font };
    }
    add(
      {
        id: product.id,
        variant: size ?? undefined,
        custom,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      },
      qty
    );
    showToast(`Đã thêm “${product.name}${size ? ` – Size ${size}` : ""}${custom ? " (đặt làm riêng)" : ""}” vào giỏ`);
  }

  function handleWish() {
    const added = toggleWish(product.id);
    showToast(added ? "Đã thêm vào danh sách yêu thích" : "Đã bỏ khỏi danh sách yêu thích", false);
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset disabled={soldOut}>
        <legend className="mb-3 text-[15px] font-bold">Kiểu đặt hàng</legend>
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
          <ModeCard
            active={mode === "san-co"}
            onClick={() => setMode("san-co")}
            title="Mẫu có sẵn"
            text="Như ảnh sản phẩm · giao trong 2–4 ngày"
          />
          <ModeCard
            active={mode === "rieng"}
            onClick={() => setMode("rieng")}
            title="Đặt làm riêng"
            text={`Chọn màu & thêu tên · nhận sau ${shop.customDays}`}
          />
        </div>
      </fieldset>

      {mode === "rieng" && !soldOut && (
        <div className="space-y-5 rounded-card border border-border bg-cream p-4 md:p-5">
          <fieldset id="color-picker">
            <legend className="mb-3 text-[15px] font-bold">
              1. Chọn màu len{color && <span className="font-normal text-muted">: {color}</span>}
            </legend>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-invalid={colorError}>
              {shop.customColors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  role="radio"
                  aria-checked={color === c.name}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => {
                    setColor(c.name);
                    setColorError(false);
                  }}
                  className={`size-10 rounded-full transition ${
                    color === c.name
                      ? "ring-[3px] ring-primary ring-offset-2 ring-offset-cream"
                      : `border-2 ${colorError ? "border-sale" : "border-white"} hover:scale-110`
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            {colorError && <p className="mt-2 text-sm text-sale">Vui lòng chọn màu len cho món quà.</p>}
          </fieldset>

          <div>
            <label htmlFor="emb-text" className="mb-2 flex items-baseline justify-between text-[15px] font-bold">
              2. Chữ muốn thêu
              <span className="text-[13px] font-normal text-muted">
                {text.length}/{shop.customMaxChars} ký tự
              </span>
            </label>
            <input
              id="emb-text"
              value={text}
              maxLength={shop.customMaxChars}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ví dụ: Minh Anh (để trống nếu không thêu)"
              className="field"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-[15px] font-bold">3. Kiểu chữ thêu</legend>
            <div className="flex gap-2.5" role="radiogroup">
              {shop.customFonts.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={font === f}
                  onClick={() => setFont(f)}
                  className={`min-h-11 flex-1 rounded-btn border px-4 text-[15px] transition ${
                    font === f ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary"
                  } ${f === "Viết tay" ? "italic" : "font-bold"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </fieldset>

          {color && (
            <div className="flex items-center gap-4 rounded-btn bg-white p-3">
              <span
                className="flex h-14 min-w-28 items-center justify-center rounded-btn px-3 text-lg"
                style={{ background: colorHex, color: color === "Đỏ rượu" ? "#fff" : "#2b3a3a" }}
              >
                <span className={font === "Viết tay" ? "italic" : "font-bold"}>{text.trim() || "—"}</span>
              </span>
              <p className="text-[13px] leading-5 text-muted">
                Xem trước (minh hoạ). {shop.name} sẽ nhắn xác nhận thiết kế trước khi đan.
              </p>
            </div>
          )}
        </div>
      )}

      {needsSize && (
        <fieldset id="size-picker">
          <legend className="mb-3 flex w-full items-baseline justify-between text-[15px] font-bold">
            Chọn size{size && <span className="font-normal text-muted">: {size}</span>}
          </legend>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-invalid={sizeError}>
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                disabled={soldOut}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={`min-h-11 min-w-14 rounded-btn border px-4 text-[15px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  size === s ? "border-primary bg-primary text-white" : sizeError ? "border-sale" : "border-border hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && <p className="mt-2 text-sm text-sale">Vui lòng chọn size trước khi thêm vào giỏ.</p>}
        </fieldset>
      )}

      <div className="flex gap-3">
        {!soldOut && <QuantityInput value={qty} max={product.stock} onChange={setQty} />}
        <button type="button" onClick={handleAdd} disabled={soldOut} className="btn-primary flex-1">
          {soldOut ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
        <button
          type="button"
          onClick={handleWish}
          aria-pressed={wishReady && wished}
          aria-label={wished ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-btn border border-border hover:border-primary"
        >
          <Heart className={`size-5 ${wishReady && wished ? "fill-brown text-brown" : ""}`} aria-hidden />
        </button>
      </div>
      {mode === "rieng" && color && (
        <p className="-mt-3 text-[13px] text-muted">{describeCustom({ color, text: text.trim(), font })}</p>
      )}
    </div>
  );
}

function ModeCard({ active, onClick, title, text }: { active: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex items-start gap-3 rounded-card border p-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-white hover:border-primary"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-primary bg-primary text-white" : "border-border"
        }`}
      >
        {active && <Check className="size-3" strokeWidth={3} aria-hidden />}
      </span>
      <span>
        <span className="block text-[15px] font-bold">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-muted">{text}</span>
      </span>
    </button>
  );
}
