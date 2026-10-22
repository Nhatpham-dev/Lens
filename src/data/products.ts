// Dữ liệu sinh từ data/products.xlsx bằng `npm run import-products` — không sửa tay products.json.
import { shop } from "@/config/shop";
import raw from "./products.json";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  categorySlug: string;
  description: string;
  images: string[];
  stock: number;
  featured: boolean;
  tags: { name: string; slug: string }[]; // cột "the" trong Excel (Nam, Nữ, Mới…)
  sizes: string[]; // cột "kich_thuoc" (S, M, L…) — rỗng nếu sản phẩm không có size
  rating: number | null; // cột "danh_gia" (0–5)
  sold: number | null; // cột "da_ban"
};

/** Ảnh tạm do script tạo (sản phẩm chưa có ảnh thật) → hiện chú thích "Ảnh: …" như bản thiết kế. */
export function isPlaceholderImage(src: string) {
  return src.includes("/tam-");
}

export type Category = { name: string; slug: string; count: number };

const products: Product[] = (raw as Partial<Product>[]).map((p) => ({
  ...(p as Product),
  tags: p.tags ?? [],
  sizes: p.sizes ?? [],
  rating: p.rating ?? null,
  sold: p.sold ?? null,
}));

export type ProductFilter = { category?: string; tag?: string; sale?: boolean; q?: string };

/** Lọc sản phẩm theo danh mục (slug), thẻ (slug), đang giảm giá, từ khoá (không phân biệt dấu). */
export function getProducts(filter: ProductFilter | string = {}) {
  const f = typeof filter === "string" ? { category: filter } : filter;
  const q = f.q ? normalize(f.q) : "";
  return products.filter(
    (p) =>
      (!f.category || p.categorySlug === f.category) &&
      (!f.tag || p.tags.some((t) => t.slug === f.tag)) &&
      (!f.sale || (p.compareAtPrice ?? 0) > p.price) &&
      (!q || normalize(`${p.name} ${p.category} ${p.tags.map((t) => t.name).join(" ")}`).includes(q))
  );
}

export function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
}

/** Sản phẩm có thẻ "Mới"/"New" → hiện nhãn NEW. */
export function isNew(p: Product) {
  return p.tags.some((t) => t.slug === "moi" || t.slug === "new");
}

export function getTags() {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of products)
    for (const t of p.tags) {
      const c = map.get(t.slug) ?? { ...t, count: 0 };
      c.count++;
      map.set(t.slug, c);
    }
  return [...map.values()];
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

/** Sản phẩm nổi bật — luôn đủ hàng 4 (bù bằng sản phẩm khác) để lưới không có hàng lẻ. */
export function getFeaturedProducts(limit = 8) {
  const featured = products.filter((p) => p.featured && p.stock > 0);
  const rest = products.filter((p) => !featured.includes(p) && p.stock > 0);
  const want = Math.min(limit, Math.max(4, Math.ceil(featured.length / 4) * 4));
  return [...featured, ...rest].slice(0, want);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const same = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id);
  const others = products.filter((p) => p.categorySlug !== product.categorySlug);
  return [...same, ...others].slice(0, limit);
}

export function getCategories(): Category[] {
  const map = new Map<string, Category>();
  for (const p of products) {
    const c = map.get(p.categorySlug) ?? { name: p.category, slug: p.categorySlug, count: 0 };
    c.count++;
    map.set(p.categorySlug, c);
  }
  // Thứ tự theo shop.categoryOrder (nếu có, ví dụ theo thiết kế), còn lại theo thứ tự xuất hiện trong Excel
  const order: string[] = (shop as { categoryOrder?: string[] }).categoryOrder ?? [];
  const rank = (c: Category) => {
    const i = order.findIndex((name) => normalize(name) === normalize(c.name));
    return i === -1 ? order.length : i;
  };
  return [...map.values()].sort((a, b) => rank(a) - rank(b));
}
