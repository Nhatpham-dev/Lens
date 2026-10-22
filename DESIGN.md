# Thiết kế — Lens
Nguồn: 7 ảnh chụp trang chủ desktop (rộng 1366px, tỉ lệ 1x) người dùng gửi qua chat.

## Màu (lấy mẫu pixel từ ảnh)
| Vai trò | Mã | Dùng ở |
|---|---|---|
| primary | #3E8E84 | thanh thông báo, logo, nút "Thêm vào giỏ", "Bắt đầu thiết kế", giá, số thứ tự, nhãn nhỏ |
| hero | #629788 | nền hero (chờ ảnh quảng cáo) |
| brown | #8F6249 | nhãn -20%, nhãn "Khuyến mãi tháng 10", nút "Mua ngay", chữ "Giảm 15%…", "Đánh giá 5/5" |
| cream | #F6F1E7 | nền khối carousel "Về Lens", hộp khuyến mãi hero, nút "Xem sản phẩm", chip thanh toán |
| sand | #EDE5D6 | nền "Đặt làm riêng", "Thông tin liên hệ", card xen kẽ |
| card | #F3EEE3 | card danh mục / quà tặng (xen kẽ với sand) |
| tile | #FAF8F3 | ô ảnh trong card danh mục |
| photo | #EFE8DB / #E8E0D0 | ô ảnh sản phẩm (xen kẽ), ô ảnh carousel |
| ink | #2B3A3A | chữ chính, nền footer |
| muted | #5E6B6A | chữ phụ |
| border | #E6DAC4 | viền card |

8 màu len ở mục "Đặt làm riêng": #9FD8CB, #B7D9EE, #F3E7CF, #F4C2C7, #F6DE9A, #B9BEC0, #8E2A3A, #C9AE8C (khai báo trong `src/config/shop.ts` → `customColors`).

## Chữ
- Thiết kế dùng Arial/Helvetica → dùng **Arimo** (cùng số đo với Arial, đủ dấu tiếng Việt), tự host bằng `@fontsource/arimo`.
- Hero H1 56/68 bold · tiêu đề mục 34–36 (Danh mục, Sản phẩm, Đặt làm riêng, Quà tặng: thường; Về Lens, Khách hàng, Liên hệ: đậm) · tên SP 16 bold · giá 20 bold màu primary · body 15–16.

## Hình khối
- Container 1200px (lề 83px ở màn 1366px), mobile lề 16px.
- Bo góc nhỏ: card 4px, nút 4px, chấm màu tròn. Viền card 1px màu border.
- Nút cao 48px. Ảnh SP vuông (258×258 trong card 280px).

## Trang chủ (từ trên xuống)
Thanh thông báo → header (logo Lens, menu Trang chủ / Cửa hàng / Đặt làm riêng / Về Lens / Liên hệ, link Tìm kiếm / Yêu thích / Giỏ hàng (n)) → hero trình chiếu 3 slide (mũi tên + chấm) → Danh mục sản phẩm (4 card) → Sản phẩm (4 card) → Đặt làm riêng cho người ấy (3 bước, 8 chấm màu, nút "Bắt đầu thiết kế") → Quà tặng theo dịp (5 card) → carousel 3 slide (Về Lens / Điều Lens luôn giữ / Những dự án Lens đã thực hiện) → Khách hàng nói gì về Lens → Thông tin liên hệ → footer.

## Hành vi đã thống nhất với chủ shop
- Mục "Đặt làm riêng" trên trang chủ **chỉ là hướng dẫn**. Nút "Bắt đầu thiết kế" cuộn lên mục Sản phẩm.
- Việc đặt làm riêng là **một lựa chọn khi đặt hàng**: ở trang chi tiết sản phẩm, khách chọn "Mẫu có sẵn" hoặc "Đặt làm riêng" (chọn 1 trong 8 màu len, chữ thêu tối đa 12 ký tự, kiểu chữ viết tay / in đậm). Lựa chọn này đi theo dòng hàng trong giỏ và hiện trong tin nhắn đơn gửi Zalo.
- Chấm màu ở trang chủ bấm được để xem tên màu (minh hoạ), không lưu gì.

## Suy ra (không có trong thiết kế)
- Trang Cửa hàng, chi tiết SP, giỏ hàng, đặt hàng, tìm kiếm, yêu thích, chính sách, hướng dẫn: cùng màu, card viền mảnh, nút primary.
- Mục Sản phẩm trang chủ thêm link "Xem tất cả sản phẩm" bên dưới 4 card.
- Dưới hàng chấm màu ở mục "Đặt làm riêng" thêm dòng chữ nhỏ "Màu len: …" để khách biết tên màu khi bấm.
- Hero có 3 slide (thiết kế chỉ thể hiện slide 1): slide 2 giới thiệu đặt làm riêng, slide 3 quà 20/10.
- Ô ảnh chưa có ảnh thật → khối màu kèm chú thích như thiết kế; đường dẫn ảnh đặt trong `shop.siteImages`.
- Số sao / đã bán lấy từ cột `danh_gia`, `da_ban` trong Excel (thêm vào script nhập).

## Khác thiết kế vì lý do kỹ thuật
- Mã LENS15: website không biết khách đã từng mua hay chưa (không có backend) → khách nhập mã ở giỏ hàng, tin nhắn đơn ghi rõ "shop xác nhận đơn đầu tiên".
- "Tra cứu đơn hàng": không có hệ thống đơn → trang hướng dẫn nhắn Zalo kèm mã đơn.
