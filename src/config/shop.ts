// Thông tin riêng của shop — chỉ cần sửa file này.
export const shop = {
  name: "Lens",
  tagline: "Handmade từ từng mũi len",
  description: "Tiệm len nhỏ xinh – đan tay từng mũi, gửi trọn yêu thương trong từng món quà.",
  zaloPhone: "0865799527", // ĐỔI: SĐT Zalo nhận đơn; "" để ẩn nút Zalo
  messengerPage: "", // phần sau facebook.com/ của Fanpage; để "" nếu không dùng
  hotline: "0865799527",
  email: "hello@lens.vn",
  address: "12 Đường Mẫu, Hà Nội", // ĐỔI: địa chỉ thật
  openHours: "9:00 – 21:00",
  socials: {
    // ĐỔI: link trang mạng xã hội của shop
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },
  shippingFee: 30000,
  freeShippingFrom: 500000, // đơn từ mức này miễn phí ship; 0 = không áp dụng
  priceSuffix: "đ", // ký hiệu sau giá — theo thiết kế ("₫" hoặc "đ")
  categoryOrder: ["Khăn len", "Gấu bông len", "Khăn tay", "Móc khóa"], // thứ tự danh mục theo thiết kế
  // Mã giảm giá khách tự nhập ở giỏ hàng (requireCode: true). minQty = số sản phẩm tối thiểu.
  promo: {
    code: "LENS15",
    title: "Giảm 15% đơn hàng đầu tiên",
    minQty: 1,
    percent: 15,
    endsAt: "2026-12-31T23:59:59+07:00",
    requireCode: true,
  } as null | { code: string; title: string; minQty: number; percent: number; endsAt: string; requireCode?: boolean },
  paymentMethods: ["COD", "Chuyển khoản", "MoMo"],

  // --- Đặt làm riêng ---
  customDays: "5–7 ngày", // thời gian làm hàng đặt riêng
  customMaxChars: 12, // số ký tự thêu tối đa
  customColors: [
    { name: "Xanh mint", hex: "#9FD8CB" },
    { name: "Xanh trời", hex: "#B7D9EE" },
    { name: "Kem", hex: "#F3E7CF" },
    { name: "Hồng phấn", hex: "#F4C2C7" },
    { name: "Vàng bơ", hex: "#F6DE9A" },
    { name: "Xám khói", hex: "#B9BEC0" },
    { name: "Đỏ rượu", hex: "#8E2A3A" },
    { name: "Nâu be", hex: "#C9AE8C" },
  ],
  customFonts: ["Viết tay", "In đậm"],

  // Ảnh trang trí: bỏ ảnh vào public/images/site/ rồi ghi đường dẫn, ví dụ "/images/site/hero-1.jpg".
  // Để "" thì hiện khối màu kèm chú thích như bản thiết kế.
  siteImages: {
    hero: ["", "", ""], // 3 slide đầu trang, khung 1366 × 658
    categories: {} as Record<string, string>, // ví dụ { "khan-len": "/images/site/dm-khan-len.jpg" }
    occasions: {} as Record<string, string>, // ví dụ { "sinh-nhat": "/images/site/qua-sinh-nhat.jpg" }
    about: "", // xưởng / góc làm việc
    values: "", // quy trình làm món len
    projects: "", // các dự án
  },
};

export type CustomDesign = { color: string; text: string; font: string };

export function describeCustom(c: CustomDesign) {
  return `Đặt làm riêng: len ${c.color}${c.text ? ` · thêu “${c.text}” (${c.font.toLowerCase()})` : " · không thêu chữ"}`;
}
