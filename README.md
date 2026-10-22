# Lens — Handmade từ từng mũi len

Website bán hàng làm bằng Next.js. Khách chọn sản phẩm (mẫu có sẵn hoặc **đặt làm riêng**: chọn màu len, thêu tên), cho vào giỏ, điền thông tin và gửi đơn cho shop qua Zalo/Messenger.

## Xem thử trên máy

Cần cài Node.js (bản 20 trở lên): https://nodejs.org

Mở Terminal ở thư mục dự án (`lens-shop`) và chạy:

    npm install
    npm run dev

Mở trình duyệt vào http://localhost:3000

**Thử trên điện thoại thật** (chung wifi với máy tính): chạy `npm run dev -- -H 0.0.0.0`, rồi trên điện thoại vào `http://<IP máy tính>:3000`. Xem IP bằng lệnh `ipconfig`, dòng "IPv4 Address" (dạng 192.168.1.x).

## Việc cần làm trước khi bán thật

1. Đổi số Zalo nhận đơn, thông tin liên hệ, link mạng xã hội (mục 4 và 5 bên dưới).
2. Thay sản phẩm mẫu bằng sản phẩm thật (mục 1).
3. Sửa nội dung chính sách / hỗ trợ (mục 2 và 3) — hiện đang là nội dung mẫu.

---

# Hướng dẫn sửa nội dung

## Cách làm chung

**Chuẩn bị (một lần):** cài [VS Code](https://code.visualstudio.com) → **File → Open Folder → chọn thư mục `lens-shop`** (không chọn thư mục `Test` bên ngoài). Mọi đường dẫn trong hướng dẫn này tính từ `lens-shop`.

> ⚠️ **Đừng bấm đúp file `.ts` trong File Explorer.** Windows nhầm đuôi `.ts` là file video nên sẽ mở bằng trình phát media. Đây là file chữ (TypeScript) — luôn mở từ cây thư mục bên trái trong VS Code. (Hoặc chuột phải → Open with → Choose another app → Visual Studio Code → tích "Always use this app".)

**Mỗi lần sửa:**
1. Trong VS Code mở **Terminal → New Terminal**, chạy `npm run dev`, để nguyên. Mở http://localhost:3000 để xem.
2. Mở file cần sửa, bấm **Ctrl+F** gõ đoạn chữ muốn tìm (nhanh hơn dò số dòng).
3. Sửa → **Ctrl+S** lưu → trình duyệt tự cập nhật.
4. Xong hết thì chạy `npm run build` để kiểm tra lần cuối — không báo lỗi là có thể đưa lên mạng.

**4 quy tắc khi sửa file code** (`.ts`, `.tsx`):
- Chỉ sửa **chữ nằm giữa hai dấu ngoặc kép** `"..."`. Giữ nguyên dấu `"`, dấu `,` cuối dòng, các ngoặc `{ } [ ]`.
- Trong chữ của bạn **không được có dấu `"`** — muốn trích dẫn hãy dùng `“ ”` hoặc `'`.
- Thấy `${shop.hotline}` hay `{shop.name}` thì **để nguyên** — chỗ đó tự lấy thông tin từ file cấu hình.
- Lỡ sửa sai: **Ctrl+Z** để quay lại.

## Bảng tra nhanh

| Muốn sửa | Mở file |
|---|---|
| Sản phẩm, giá, tồn kho | `data/products.xlsx` → chạy `npm run import-products` |
| Ảnh sản phẩm | thư mục `data/anh/` → chạy `npm run import-products` |
| Số Zalo, liên hệ, mã giảm giá, mọi ảnh trang trí | `src/config/shop.ts` |
| Chính sách, Hỗ trợ | `src/data/pages.ts` |
| Chữ trên slide quảng cáo đầu trang | `src/components/home/HeroSlider.tsx` |
| Về Lens | `src/components/home/AboutCarousel.tsx` |
| Khách hàng nói gì về Lens | `src/app/page.tsx` |
| Dải chữ xanh trên cùng | `src/components/Header.tsx` |

---

## 1. Ảnh và thông tin sản phẩm

**File:** `data/products.xlsx` — sửa bằng Excel, không cần đụng code.

1. Mỗi dòng là một sản phẩm. Sửa trực tiếp tên, giá, mô tả, tồn kho…
2. **Thêm sản phẩm:** thêm dòng mới, cột `ma` không trùng mã đã có (ví dụ SP017).
3. **Ảnh:** chép ảnh vào `data/anh/`, đặt tên bắt đầu bằng mã sản phẩm: `SP001.jpg`, `SP001-2.jpg`… (ảnh đầu tiên là ảnh chính). Hoặc ghi tên file ảnh vào cột `anh`. Ảnh chụp điện thoại để nguyên cũng được — website tự thu nhỏ và nén. Ảnh iPhone dạng HEIC chưa dùng được, hãy xuất sang JPG trước.
4. Lưu Excel, **đóng file**, rồi trong Terminal (bấm Ctrl+C dừng `npm run dev` trước, chạy xong bật lại):

       npm run import-products

5. Đọc kết quả: ❌ là lỗi (phải sửa Excel, website giữ nguyên dữ liệu cũ), ⚠️ là cảnh báo (ví dụ không tìm thấy ảnh).

**Các cột trong Excel:**

| Cột | Ý nghĩa | Ví dụ |
|---|---|---|
| ma | Mã sản phẩm, không trùng | SP017 |
| ten | Tên sản phẩm (bắt buộc) | Khăn len cổ lọ |
| gia | Giá bán (bắt buộc) | 260000 |
| gia_goc | Giá trước giảm, để trống nếu không giảm (có giá gốc sẽ hiện nhãn -20%) | 320000 |
| danh_muc | Đúng một trong: `Khăn len`, `Gấu bông len`, `Khăn tay`, `Móc khóa` | Khăn len |
| mo_ta | Mô tả | ... |
| anh | Tên file ảnh, nhiều ảnh cách nhau bằng dấu \|. Có thể để trống | khan co lo 1.jpg\|khan co lo 2.jpg |
| ton_kho | Số lượng còn; 0 = hiện "Hết hàng" | 20 |
| noi_bat | Gõ `x` để hiện ở mục "Sản phẩm" trang chủ — đánh **đúng 4 sản phẩm** | x |
| the | Dịp tặng, cách nhau bằng dấu phẩy, viết đúng: `Sinh nhật`, `Valentine`, `8/3`, `20/10`, `Noel` | Sinh nhật, Noel |
| danh_gia | Số sao (0–5), để trống thì không hiện | 4.9 |
| da_ban | Số đã bán, để trống thì không hiện | 238 |

**Lưu ý:**
- Viết `danh_muc` khác 4 tên trên sẽ tạo thêm danh mục thứ 5 trên trang chủ.
- Website **không tự trừ tồn kho** khi có đơn — bạn tự cập nhật cột `ton_kho` khi bán được hàng.

**Ảnh danh mục và ảnh quà theo dịp** (các ô "Ảnh: khăn len mint", "Ảnh: quà sinh nhật"…):
1. Chép ảnh vào `public/images/site/` (chưa có thư mục thì tự tạo).
2. Mở `src/config/shop.ts`, tìm `siteImages`, điền:
   ```ts
   categories: { "khan-len": "/images/site/dm-khan-len.jpg", "gau-bong-len": "/images/site/dm-gau.jpg", "khan-tay": "/images/site/dm-khan-tay.jpg", "moc-khoa": "/images/site/dm-moc-khoa.jpg" },
   occasions: { "sinh-nhat": "/images/site/sinh-nhat.jpg", "valentine": "...", "8-3": "...", "20-10": "...", "noel": "..." },
   ```

---

## 2. Các chính sách

**File:** `src/data/pages.ts`, phần `POLICY_PAGES` (Ctrl+F tìm `POLICY_PAGES`).

Mỗi chính sách có dạng:
```ts
{
  slug: "doi-tra",                    // ← KHÔNG sửa (là địa chỉ trang)
  title: "Chính sách đổi trả",        // tiêu đề
  intro: "Đoạn mở đầu...",            // đoạn giới thiệu
  sections: [
    { heading: "Tiêu đề mục", body: ["Câu 1.", "Câu 2."] },   // mỗi "..." là một đoạn
  ],
},
```
- **Sửa nội dung:** sửa chữ trong `title`, `intro`, `heading`, `body`.
- **Thêm một đoạn:** thêm `, "Đoạn mới."` vào trong `body: [ ... ]`.
- **Thêm một mục:** copy cả dòng `{ heading: ..., body: [...] },` dán ngay bên dưới.

## 3. Hỗ trợ

**File:** cũng là `src/data/pages.ts`, phần `SUPPORT_PAGES` (Ctrl+F tìm `SUPPORT_PAGES`) — gồm Hướng dẫn đặt hàng, Giặt & bảo quản, Câu hỏi thường gặp, Tra cứu đơn hàng. Cách sửa giống hệt mục 2.

---

## 4. Liên hệ

**File:** `src/config/shop.ts`
```ts
hotline: "090 123 4567",          // số hiển thị (có dấu cách cho dễ đọc)
email: "hello@lens.vn",
address: "12 Đường Mẫu, Hà Nội",
openHours: "9:00 – 21:00",
socials: {
  facebook: "https://www.facebook.com/tenpagecuaban",
  instagram: "https://www.instagram.com/tencuaban",
  tiktok: "https://www.tiktok.com/@tencuaban",
},
description: "Tiệm len nhỏ xinh – ...",   // câu giới thiệu ở chân trang
```
Sửa một lần → chân trang, mục "Thông tin liên hệ" và các trang hỗ trợ đều tự cập nhật.

## 5. Số Zalo

**File:** `src/config/shop.ts`
```ts
zaloPhone: "0901234567",
```
- Viết **liền, không dấu cách, không dấu chấm**.
- Đây là số **nhận đơn**; `hotline` (mục 4) chỉ để hiển thị, có thể giống hoặc khác.
- **Kiểm tra:** mở `https://zalo.me/<số của bạn>` trên điện thoại **của người khác**. Nếu không nhắn được: Zalo → Cài đặt → Quyền riêng tư → cho phép người lạ nhắn tin. Không bật thì khách không gửi được đơn.

**Messenger (nếu dùng):** điền `messengerPage: "tenfanpage"` (phần sau `facebook.com/` của Fanpage) — nút "Gửi đơn qua Messenger" sẽ tự hiện. Để `""` thì nút ẩn.

---

## 6. Thông tin khuyến mãi

Nằm ở **3 chỗ**:

**a) Mã giảm giá** — `src/config/shop.ts`, tìm `promo`:
```ts
code: "LENS15",                          // mã khách nhập ở giỏ hàng
title: "Giảm 15% đơn hàng đầu tiên",
minQty: 1,                               // số sản phẩm tối thiểu
percent: 15,                             // % giảm
endsAt: "2026-12-31T23:59:59+07:00",     // hạn dùng (năm-tháng-ngày)
```
**Tắt khuyến mãi:** đổi `endsAt` thành ngày đã qua, ví dụ `"2020-01-01T00:00:00+07:00"`.

**b) Chữ trên 3 slide quảng cáo đầu trang** — `src/components/home/HeroSlider.tsx`, Ctrl+F tìm `const SLIDES`. Mỗi slide:
```ts
badge: "Khuyến mãi tháng 10",            // nhãn nâu nhỏ
title: "Món quà đan bằng cả trái tim",   // tiêu đề lớn
subtitle: "...",                          // dòng chữ nghiêng
line: "...",                              // dòng liệt kê
boxTitle: "Giảm 15% đơn hàng đầu tiên",  // chữ nâu trong hộp kem
boxText: "Nhập mã LENS15 · Thêu tên miễn phí",
primary: { label: "Mua ngay", href: "/san-pham" },        // nút nâu: chữ + link
secondary: { label: "Xem sản phẩm", href: "/#san-pham" }, // nút kem
```
**Ảnh nền slide:** chép ảnh khổ 1366 × 658 vào `public/images/site/`, rồi trong `shop.ts` → `siteImages`:
`hero: ["/images/site/hero-1.jpg", "/images/site/hero-2.jpg", "/images/site/hero-3.jpg"]`

**c) Dải chữ xanh trên cùng** ("Handmade từ từng mũi len | Nhận thêu tên…") — `src/components/Header.tsx`, Ctrl+F tìm `Handmade từ từng mũi len`.

⚠️ Đổi mã `LENS15` sang mã khác thì nhớ sửa cả chữ ở slide 1 (`boxText`) và mục "Mã giảm giá" trong `src/data/pages.ts`.

---

## 7. "Về Lens"

**File:** `src/components/home/AboutCarousel.tsx` — carousel có 3 slide:

- **Slide "Về Lens"** (2 đoạn văn): Ctrl+F tìm `là xưởng len nhỏ`. Chữ ở đây **không nằm trong ngoặc kép** mà nằm giữa `<p ...>` và `</p>` — chỉ sửa phần chữ, giữ nguyên `<p ...>`, `</p>` và `{shop.name}`.
- **Slide "Điều Lens luôn giữ":** tìm `const VALUES`:
  ```ts
  { title: "100% handmade", text: "Đan tay từng mũi, không làm hàng loạt." },
  ```
- **Slide "Những dự án Lens đã thực hiện":** tìm `const PROJECTS` — cấu trúc giống VALUES.
- **Ảnh 3 slide:** `shop.ts` → `siteImages`: `about` (xưởng), `values` (quy trình), `projects` (dự án).

## 8. Khách hàng nói gì về Lens

**File:** `src/app/page.tsx`, Ctrl+F tìm `const REVIEWS`:
```ts
{
  text: "Khăn len mềm và ấm hơn mình nghĩ...",   // lời đánh giá
  name: "Minh Anh",                               // tên khách
  context: "Tặng sinh nhật bạn thân",             // dịp mua
},
```
- **Thêm đánh giá:** copy cả khối `{ ... },` dán bên dưới. Nên giữ **3 hoặc 6** đánh giá (mục này xếp 3 cột).
- Nên dùng đánh giá thật của khách, có xin phép họ.

---

# Thông tin thêm

## Phần "Đặt làm riêng" hoạt động thế nào

- Mục "Đặt làm riêng cho người ấy" ở trang chủ **chỉ là hướng dẫn 3 bước**. Nút "Bắt đầu thiết kế" đưa khách lên mục Sản phẩm.
- Ở trang chi tiết mỗi sản phẩm có mục **Kiểu đặt hàng**: "Mẫu có sẵn" hoặc "Đặt làm riêng". Chọn đặt làm riêng thì khách chọn màu len, gõ chữ thêu (tối đa 12 ký tự), chọn kiểu chữ viết tay / in đậm.
- Lựa chọn đó hiện trong giỏ hàng, trang đặt hàng và trong tin nhắn đơn gửi Zalo — shop nhắn lại xác nhận thiết kế trước khi đan.
- Bảng màu, số ký tự, thời gian làm: `src/config/shop.ts` → `customColors`, `customMaxChars`, `customDays`.

## Đặt hàng qua Zalo hoạt động thế nào

Khi khách bấm "Gửi đơn qua Zalo", website **sao chép sẵn nội dung đơn** (sản phẩm, thiết kế riêng, mã giảm giá, tổng tiền, họ tên, SĐT, địa chỉ, thanh toán, ghi chú) và **mở khung chat Zalo** với shop. Khách phải **tự dán và bấm Gửi** — Zalo không cho website điền sẵn tin nhắn. Website không lưu đơn nào; giỏ hàng và danh sách yêu thích chỉ lưu trên trình duyệt của từng khách.

## Đưa website lên mạng (Vercel, miễn phí)

1. Tạo tài khoản GitHub (github.com) và Vercel (vercel.com, đăng nhập bằng GitHub).
2. Đưa thư mục `lens-shop` lên một repository GitHub mới (dùng GitHub Desktop nếu chưa quen lệnh git).
3. Trên Vercel: **Add New → Project → chọn repository → Deploy**. Không cần chỉnh gì.
4. Mỗi lần sửa sản phẩm hoặc nội dung, chỉ cần đẩy thay đổi lên GitHub — Vercel tự cập nhật website sau 1–2 phút.

Muốn dùng tên miền riêng (vd. lens.vn): Vercel → Project → Settings → Domains.

## Những phần chưa có — cần backend

- **Đơn hàng không lưu trên website.** Shop quản lý đơn trong Zalo.
- **Tồn kho không tự trừ** khi có đơn — sửa tay trong Excel.
- **Mã LENS15 "đơn đầu tiên"**: website không biết khách đã mua trước đó hay chưa, nên tin nhắn đơn ghi "nhờ shop xác nhận".
- **Tra cứu đơn hàng**: chưa tự động — trang này hướng dẫn khách nhắn Zalo kèm mã đơn.
- **Thanh toán online** (MoMo, chuyển khoản): khách chọn hình thức trong form, shop gửi thông tin thanh toán khi xác nhận đơn.

## Khi gặp lỗi

- `npm run build` báo lỗi sau khi sửa file code: thường do thiếu/thừa dấu `"` hoặc `,` — đọc tên file và số dòng trong thông báo lỗi, mở ra kiểm tra (hoặc Ctrl+Z về bản trước).
- Website trên Vercel không cập nhật: vào Vercel → Deployments, xem bản mới nhất có báo đỏ không; bấm vào để đọc lỗi (thường là lỗi trong file Excel).
- Nếu chạy được `npm run build` ở máy thì Vercel cũng chạy được.
