#!/usr/bin/env node
/**
 * Nhập sản phẩm (thông tin + ảnh) từ Excel (.xlsx) hoặc CSV vào website.
 *
 * Cách dùng (chạy ở thư mục gốc dự án):
 *   node scripts/import-products.mjs                 # tự tìm data/products.xlsx, nếu không có thì data/products.csv
 *   node scripts/import-products.mjs duong/dan.xlsx  # chỉ định file
 *   node scripts/import-products.mjs --tao-excel data/products.csv data/products.xlsx
 *                                                    # đổi CSV mẫu thành file Excel để người dùng sửa
 *
 * Cột (tên cột không phân biệt hoa thường / có dấu hay không):
 *   ma        Mã sản phẩm (nên có, dùng để tự tìm ảnh)        ví dụ: SP001
 *   ten       Tên sản phẩm (bắt buộc)                          ví dụ: Áo thun cotton basic
 *   gia       Giá bán (bắt buộc)                               ví dụ: 199000 | 199.000đ | 199k | 1,2tr
 *   gia_goc   Giá trước giảm (tuỳ chọn, phải > gia)            ví dụ: 249000
 *   danh_muc  Danh mục                                         ví dụ: Áo
 *   mo_ta     Mô tả
 *   anh       Tên file ảnh trong data/anh/ hoặc link https, nhiều ảnh cách nhau bằng |
 *             Để trống → tự tìm ảnh trong data/anh/ có tên bắt đầu bằng mã SP
 *             (SP001.jpg, SP001-2.jpg, SP001_mat-sau.png) hoặc thư mục data/anh/SP001/
 *   ton_kho   Số lượng còn (để trống = 100, 0 = hết hàng)
 *   noi_bat   Đánh dấu x / có / 1 để hiện ở trang chủ
 *   the       (tuỳ chọn) Thẻ để lọc / gắn nhãn, cách nhau bằng dấu phẩy: Nam, Nữ, Mới, Thu Đông 2026
 *             Thẻ "Mới" (hoặc "New") hiện nhãn NEW trên ảnh sản phẩm.
 *   kich_thuoc (tuỳ chọn) Các size để khách chọn, cách nhau bằng dấu phẩy: S, M, L, XL  |  38, 39, 40
 *
 * ẢNH: người dùng chỉ bỏ ảnh gốc vào data/anh/ (tên file tuỳ ý, có dấu, viết hoa đều được).
 * Script tạo lại toàn bộ public/images/products/ mỗi lần chạy: đổi tên file gọn gàng (<slug>-1.webp),
 * xoay đúng chiều ảnh chụp điện thoại, thu nhỏ còn tối đa 1600px và nén WebP (nếu có thư viện sharp,
 * Next.js đã cài sẵn). Sản phẩm không có ảnh → ảnh tạm SVG.
 * => public/images/products/ là thư mục SINH TỰ ĐỘNG, không bỏ ảnh trực tiếp vào đó.
 *
 * Màu ảnh tạm: mặc định bảng màu pastel; muốn khớp thiết kế thì thêm vào package.json:
 *   "importProducts": { "placeholderColors": ["#D9C7AE", "#C9CBAD"], "placeholderText": false }
 *   (màu dùng xen kẽ theo thứ tự sản phẩm; placeholderText: false = khối màu trơn như bản thiết kế)
 *
 * Kết quả: src/data/products.json (không sửa tay file này).
 * Có lỗi dữ liệu → in lỗi theo số dòng Excel và thoát mã 1 (build dừng lại, không deploy dữ liệu sai).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let XLSX;
try {
  XLSX = require("xlsx");
} catch {
  console.error("❌ Thiếu thư viện đọc Excel. Chạy: npm i -D xlsx");
  process.exit(1);
}
let sharp = null;
try {
  sharp = require(require.resolve("sharp", { paths: [process.cwd()] }));
} catch {}

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, "src/data/products.json");
const SRC_IMG_DIR = path.join(ROOT, "data/anh");
const IMG_DIR = path.join(ROOT, "public/images/products");
const IMG_URL = "/images/products";
const WEB_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);
const UNSUPPORTED_EXT = new Set([".heic", ".heif", ".tif", ".tiff", ".bmp", ".psd", ".raw", ".cr2", ".nef"]);
const MAX_SIDE = 1600;

// ---------- tiện ích ----------
export function removeDiacritics(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}
export function slugify(s) {
  return removeDiacritics(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function normKey(k) {
  return removeDiacritics(k).toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
const ALIASES = {
  ma: ["ma", "ma_sp", "ma_san_pham", "sku", "id", "code"],
  ten: ["ten", "ten_sp", "ten_san_pham", "name", "san_pham"],
  gia: ["gia", "gia_ban", "price"],
  gia_goc: ["gia_goc", "gia_cu", "gia_niem_yet", "compare_at_price", "old_price"],
  danh_muc: ["danh_muc", "loai", "category", "nhom"],
  mo_ta: ["mo_ta", "description", "mo_ta_san_pham"],
  anh: ["anh", "hinh", "hinh_anh", "image", "images", "anh_san_pham"],
  ton_kho: ["ton_kho", "so_luong", "stock", "qty", "sl"],
  noi_bat: ["noi_bat", "featured", "hot", "trang_chu"],
  the: ["the", "tag", "tags", "nhan", "bo_loc", "gioi_tinh"],
  kich_thuoc: ["kich_thuoc", "size", "sizes", "kich_co", "co", "phan_loai"],
  danh_gia: ["danh_gia", "sao", "rating"],
  da_ban: ["da_ban", "luot_ban", "sold"],
};
const KEY_OF = Object.fromEntries(Object.entries(ALIASES).flatMap(([k, list]) => list.map((a) => [a, k])));

export function parsePrice(v) {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number") return Math.round(v);
  let s = String(v).toLowerCase().replace(/\s/g, "");
  let mult = 1;
  if (/\d(k|nghin|ngan)$/.test(s)) { mult = 1000; s = s.replace(/(k|nghin|ngan)$/, ""); }
  else if (/\d(tr|trieu)$/.test(s)) { mult = 1_000_000; s = s.replace(/(tr|trieu)$/, ""); }
  if (mult > 1) {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? Math.round(n * mult) : NaN;
  }
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
}
function parseBool(v) {
  return ["x", "co", "1", "true", "yes", "y", "v"].includes(normKey(String(v ?? "")));
}
const naturalSort = (a, b) => a.localeCompare(b, "vi", { numeric: true, sensitivity: "base" });

// ---------- đọc file ----------
function readRows(file) {
  const ext = path.extname(file).toLowerCase();
  let wb;
  if (ext === ".csv" || ext === ".txt") {
    const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
    // Excel bản Việt hay lưu CSV ngăn cách bằng dấu chấm phẩy
    const firstLine = text.split(/\r?\n/)[0];
    const sep = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";
    wb = XLSX.read(text, { type: "string", FS: sep, raw: true });
  } else {
    wb = XLSX.readFile(file);
  }
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
}

// ---------- kho ảnh gốc (data/anh) ----------
function scanImages(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const rel = path.relative(dir, full).split(path.sep).join("/");
        const ext = path.extname(e.name).toLowerCase();
        files.push({
          full, rel, ext,
          stemKey: normKey(path.basename(e.name, path.extname(e.name))),
          relKey: normKey(rel.slice(0, rel.length - ext.length)),
          relExtKey: normKey(rel),
          folderKey: rel.includes("/") ? normKey(rel.split("/")[0]) : null,
        });
      }
    }
  })(dir);
  return files.sort((a, b) => naturalSort(a.rel, b.rel));
}

/** Tìm 1 ảnh theo tên người dùng ghi trong cột "anh" (không phân biệt hoa thường, dấu, khoảng trắng). */
function findByName(files, token) {
  const t = token.replace(/^\/+/, "").replace(/^(data\/anh|public\/images\/products|images\/products)\//i, "");
  const hasExt = path.extname(t) !== "";
  const key = normKey(hasExt ? t : t);
  return (
    files.find((f) => f.relExtKey === key) ||
    files.find((f) => normKey(path.basename(f.rel)) === normKey(path.basename(t))) ||
    (!hasExt && (files.find((f) => f.relKey === key) || files.find((f) => f.stemKey === normKey(path.basename(t))))) ||
    null
  );
}

/** Tự tìm ảnh khi cột "anh" để trống: theo mã SP (SP001.jpg, SP001-2.jpg, SP001/...) hoặc theo tên SP. */
function findAuto(files, code, slug) {
  const keys = [code && normKey(code), normKey(slug)].filter(Boolean);
  for (const k of keys) {
    const found = files.filter(
      (f) => f.folderKey === k || f.stemKey === k || f.stemKey.startsWith(k + "_")
    );
    if (found.length) return found;
  }
  return [];
}

// ---------- ảnh tạm ----------
let PALETTE = ["#E8EEF7", "#F6E9E1", "#E6F2EC", "#F3EAF5", "#FBF1D9", "#E7F0F3", "#F5E6E8", "#ECEDF7"];
let PLACEHOLDER_TEXT = true;
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).importProducts;
  if (Array.isArray(cfg?.placeholderColors) && cfg.placeholderColors.length) PALETTE = cfg.placeholderColors;
  if (cfg?.placeholderText === false) PLACEHOLDER_TEXT = false;
} catch {}
function placeholderSvg(name, category, index) {
  const bg = PALETTE[index % PALETTE.length];
  const initials = removeDiacritics(name).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${bg}"/>${PLACEHOLDER_TEXT ? `
  <text x="400" y="520" font-family="system-ui, sans-serif" font-size="180" font-weight="600" fill="#00000033" text-anchor="middle">${esc(initials)}</text>
  <text x="400" y="620" font-family="system-ui, sans-serif" font-size="34" fill="#00000055" text-anchor="middle">${esc(category || "Ảnh tạm")}</text>` : ""}
</svg>`;
}

/** Chép + tối ưu 1 ảnh gốc sang public. Trả về URL. */
async function publishImage(src, baseName, stats) {
  const ext = src.ext === ".jpeg" ? ".jpg" : src.ext;
  if (sharp && ![".svg", ".gif"].includes(ext)) {
    const out = `${baseName}.webp`;
    await sharp(src.full)
      .rotate() // xoay theo EXIF (ảnh chụp điện thoại)
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(IMG_DIR, out));
    stats.optimized++;
    return `${IMG_URL}/${out}`;
  }
  const out = `${baseName}${ext}`;
  fs.copyFileSync(src.full, path.join(IMG_DIR, out));
  const mb = fs.statSync(src.full).size / 1024 / 1024;
  if (mb > 1.5) stats.big.push(`${src.rel} (${mb.toFixed(1)} MB)`);
  return `${IMG_URL}/${out}`;
}

// ---------- chuyển CSV → Excel ----------
function csvToExcel(src, dest) {
  const rows = readRows(src);
  const ws = XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0] || {});
  ws["!cols"] = headers.map((h) => ({ wch: h === "mo_ta" ? 60 : h === "ten" ? 34 : h === "anh" ? 28 : 14 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "San pham");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  XLSX.writeFile(wb, dest);
  console.log(`✅ Đã tạo ${path.relative(ROOT, dest)} (${rows.length} sản phẩm). Từ giờ hãy sửa file Excel này.`);
}

// ---------- chính ----------
async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--tao-excel") {
    if (!args[1] || !args[2]) { console.error("Cách dùng: --tao-excel <nguon.csv> <dich.xlsx>"); process.exit(1); }
    return csvToExcel(path.resolve(args[1]), path.resolve(args[2]));
  }

  let input = args[0] ? path.resolve(args[0]) : null;
  if (!input) {
    input = ["data/products.xlsx", "data/products.csv"].map((p) => path.join(ROOT, p)).find((p) => fs.existsSync(p));
  }
  if (!input || !fs.existsSync(input)) {
    console.error("❌ Không tìm thấy file sản phẩm. Hãy đặt file ở data/products.xlsx hoặc data/products.csv");
    process.exit(1);
  }

  const rawRows = readRows(input);
  const allImages = scanImages(SRC_IMG_DIR);
  const usedImages = new Set();
  const errors = [];
  const warnings = [];
  const drafts = [];
  const seenIds = new Set();
  const seenSlugs = new Map();

  // --- Bước 1: đọc & kiểm tra dữ liệu (chưa đụng tới file nào) ---
  rawRows.forEach((raw, i) => {
    const line = i + 2; // dòng 1 là tiêu đề
    const r = {};
    for (const [k, v] of Object.entries(raw)) {
      const key = KEY_OF[normKey(k)];
      if (key) r[key] = typeof v === "string" ? v.trim() : v;
    }
    if (Object.values(r).every((v) => v === "" || v === undefined)) return; // dòng trống

    const name = String(r.ten ?? "").trim();
    if (!name) { errors.push(`Dòng ${line}: thiếu tên sản phẩm (cột "ten")`); return; }

    const price = parsePrice(r.gia);
    if (price === null) { errors.push(`Dòng ${line} (${name}): thiếu giá (cột "gia")`); return; }
    if (Number.isNaN(price) || price <= 0) { errors.push(`Dòng ${line} (${name}): giá "${r.gia}" không hợp lệ`); return; }

    let compareAtPrice = parsePrice(r.gia_goc);
    if (Number.isNaN(compareAtPrice)) { warnings.push(`Dòng ${line} (${name}): giá gốc "${r.gia_goc}" không đọc được, bỏ qua`); compareAtPrice = null; }
    if (compareAtPrice !== null && compareAtPrice <= price) {
      warnings.push(`Dòng ${line} (${name}): giá gốc không lớn hơn giá bán, bỏ qua giá gốc`);
      compareAtPrice = null;
    }

    let slug = slugify(name) || `san-pham-${line}`;
    const n = (seenSlugs.get(slug) || 0) + 1;
    seenSlugs.set(slug, n);
    if (n > 1) slug = `${slug}-${n}`;

    const code = String(r.ma ?? "").trim();
    const id = code || slug;
    if (seenIds.has(id)) { errors.push(`Dòng ${line} (${name}): mã "${id}" bị trùng`); return; }
    seenIds.add(id);

    const category = String(r.danh_muc ?? "").trim() || "Khác";

    let stock = 100;
    if (r.ton_kho !== "" && r.ton_kho !== undefined) {
      const s = Number(String(r.ton_kho).replace(/[^\d-]/g, ""));
      if (Number.isFinite(s) && s >= 0) stock = s;
      else warnings.push(`Dòng ${line} (${name}): tồn kho "${r.ton_kho}" không hợp lệ, dùng 100`);
    }

    // Ảnh: theo cột "anh", hoặc tự tìm theo mã / tên
    const sources = [];
    const tokens = String(r.anh ?? "").split(/[|;\n]+/).map((s) => s.trim()).filter(Boolean);
    for (const tk of tokens) {
      if (/^https?:\/\//i.test(tk)) {
        warnings.push(`Dòng ${line} (${name}): ảnh là link ngoài — cần khai báo tên miền trong next.config (images.remotePatterns)`);
        sources.push({ url: tk });
        continue;
      }
      const f = findByName(allImages, tk);
      if (!f) warnings.push(`Dòng ${line} (${name}): không thấy ảnh "${tk}" trong data/anh/`);
      else sources.push(f);
    }
    if (tokens.length === 0) sources.push(...findAuto(allImages, code, slug));

    const usable = [];
    for (const s of sources) {
      if (s.url) { usable.push(s); continue; }
      if (UNSUPPORTED_EXT.has(s.ext)) {
        warnings.push(`Dòng ${line} (${name}): ảnh "${s.rel}" là định dạng ${s.ext.slice(1).toUpperCase()} trình duyệt không hiển thị được — hãy xuất lại sang JPG/PNG`);
        usedImages.add(s.full);
        continue;
      }
      if (!WEB_EXT.has(s.ext)) { warnings.push(`Dòng ${line} (${name}): "${s.rel}" không phải file ảnh, bỏ qua`); continue; }
      usable.push(s);
      usedImages.add(s.full);
    }

    const tags = [...new Set(String(r.the ?? "").split(/[,;|\n]+/).map((t) => t.trim()).filter(Boolean))];

    const sizes = [...new Set(String(r.kich_thuoc ?? "").split(/[,;|\n]+/).map((t) => t.trim()).filter(Boolean))];

    // Lens: số sao (0–5) và số đã bán — tuỳ chọn, để trống thì không hiện
    let rating = null;
    if (r.danh_gia !== "" && r.danh_gia !== undefined) {
      const v = Number(String(r.danh_gia).replace(",", "."));
      if (Number.isFinite(v) && v >= 0 && v <= 5) rating = v;
      else warnings.push(`Dòng ${line} (${name}): đánh giá "${r.danh_gia}" phải là số từ 0 đến 5, bỏ qua`);
    }
    let sold = null;
    if (r.da_ban !== "" && r.da_ban !== undefined) {
      const v = Number(String(r.da_ban).replace(/[^\d]/g, ""));
      if (Number.isFinite(v)) sold = v;
    }

    drafts.push({
      rating, sold,
      line, id, slug, name, price, compareAtPrice, tags, sizes,
      category, categorySlug: slugify(category),
      description: String(r.mo_ta ?? "").trim(),
      sources: usable, stock, featured: parseBool(r.noi_bat),
    });
  });

  if (errors.length) {
    warnings.forEach((w) => console.warn("⚠️  " + w));
    errors.forEach((e) => console.error("❌ " + e));
    console.error(`\nCó ${errors.length} lỗi trong ${path.relative(ROOT, input)}. Sửa file rồi chạy lại. Dữ liệu và ảnh cũ trên web được giữ nguyên.`);
    process.exit(1);
  }
  if (drafts.length === 0) {
    console.error("❌ File không có sản phẩm nào.");
    process.exit(1);
  }

  // --- Bước 2: dữ liệu hợp lệ → tạo lại thư mục ảnh và products.json ---
  fs.rmSync(IMG_DIR, { recursive: true, force: true });
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const stats = { optimized: 0, big: [] };
  const products = [];
  const noImage = [];
  for (const [index, d] of drafts.entries()) {
    const images = [];
    for (const [i, s] of d.sources.entries()) {
      if (s.url) { images.push(s.url); continue; }
      try {
        images.push(await publishImage(s, `${d.slug}-${i + 1}`, stats));
      } catch (e) {
        warnings.push(`Dòng ${d.line} (${d.name}): không đọc được ảnh "${s.rel}" (${e.message.split("\n")[0]})`);
      }
    }
    if (images.length === 0) {
      const file = `tam-${d.slug}.svg`;
      fs.writeFileSync(path.join(IMG_DIR, file), placeholderSvg(d.name, d.category, index));
      images.push(`${IMG_URL}/${file}`);
      noImage.push(d.name);
    }
    products.push({
      id: d.id, slug: d.slug, name: d.name, price: d.price, compareAtPrice: d.compareAtPrice,
      category: d.category, categorySlug: d.categorySlug, description: d.description,
      images, stock: d.stock, featured: d.featured,
      tags: d.tags.map((t) => ({ name: t, slug: slugify(t) })),
      sizes: d.sizes,
      rating: d.rating, sold: d.sold,
    });
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(products, null, 2) + "\n");

  const unused = allImages.filter((f) => !usedImages.has(f.full) && (WEB_EXT.has(f.ext) || UNSUPPORTED_EXT.has(f.ext)));
  warnings.forEach((w) => console.warn("⚠️  " + w));
  if (unused.length) console.warn(`⚠️  ${unused.length} ảnh trong data/anh/ không thuộc sản phẩm nào: ${unused.map((f) => f.rel).join(", ")}`);
  if (stats.big.length) console.warn(`⚠️  Ảnh nặng (nên nén bớt để web nhanh hơn): ${stats.big.join(", ")}`);

  const cats = [...new Set(products.map((p) => p.category))];
  const imgCount = products.reduce((s, p) => s + p.images.length, 0) - noImage.length;
  console.log(`✅ Đã nhập ${products.length} sản phẩm, ${cats.length} danh mục (${cats.join(", ")}) từ ${path.relative(ROOT, input)}`);
  const allTags = [...new Set(products.flatMap((p) => p.tags.map((t) => t.name)))];
  if (allTags.length) console.log(`🏷  Thẻ: ${allTags.join(", ")}`);
  console.log(`🖼  ${imgCount} ảnh${stats.optimized ? ` (đã thu nhỏ & nén WebP ${stats.optimized} ảnh)` : ""}${allImages.length === 0 ? " — chưa có thư mục data/anh/" : ""}`);
  if (noImage.length) console.log(`ℹ️  ${noImage.length} sản phẩm đang dùng ảnh tạm: ${noImage.join(", ")}`);
}

main().catch((e) => {
  console.error("❌ Lỗi không mong muốn:", e.message);
  process.exit(1);
});
