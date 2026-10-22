// Nội dung các trang chính sách / hỗ trợ ở chân trang — NỘI DUNG MẪU, chủ shop sửa lại cho đúng.
import { shop } from "@/config/shop";
import { formatVND } from "@/lib/format";

export type InfoPage = { slug: string; title: string; intro: string; sections: { heading: string; body: string[] }[] };

export const POLICY_PAGES: InfoPage[] = [
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    intro: `${shop.name} muốn mỗi món quà đến tay bạn đều trọn vẹn. Nếu có lỗi từ phía shop, bọn mình đổi trả nhanh chóng.`,
    sections: [
      {
        heading: "Trường hợp được đổi trả",
        body: [
          "Sản phẩm bị lỗi do Lens: tuột mũi đan, sai màu len, thêu sai chữ so với đơn đã xác nhận.",
          "Sản phẩm bị hư hỏng trong quá trình vận chuyển.",
          "Thời hạn: trong 7 ngày kể từ khi nhận hàng.",
        ],
      },
      {
        heading: "Trường hợp không áp dụng",
        body: [
          "Sản phẩm đặt làm riêng (thêu tên, chọn màu theo yêu cầu) đúng như thông tin đã xác nhận.",
          "Sản phẩm đã giặt sai cách, bị bẩn hoặc hư hỏng do người dùng.",
        ],
      },
      {
        heading: "Cách đổi trả",
        body: [
          `Nhắn Zalo ${shop.hotline} kèm mã đơn hàng và ảnh/video sản phẩm lỗi.`,
          "Lens chịu phí vận chuyển hai chiều với sản phẩm lỗi do shop.",
        ],
      },
    ],
  },
  {
    slug: "van-chuyen",
    title: "Chính sách vận chuyển",
    intro: "Lens giao hàng toàn quốc qua các đơn vị vận chuyển uy tín.",
    sections: [
      {
        heading: "Phí giao hàng",
        body: [
          `Phí giao hàng đồng giá ${formatVND(shop.shippingFee)}` +
            (shop.freeShippingFrom ? `; miễn phí cho đơn từ ${formatVND(shop.freeShippingFrom)}.` : "."),
          "Phí có thể thay đổi với khu vực huyện đảo — shop sẽ báo trước khi gửi.",
        ],
      },
      {
        heading: "Thời gian giao hàng",
        body: [
          "Sản phẩm có sẵn: gửi trong 1–2 ngày, nhận hàng sau 2–4 ngày tuỳ khu vực.",
          `Sản phẩm đặt làm riêng: nhận hàng sau ${shop.customDays} kể từ khi xác nhận đơn.`,
        ],
      },
    ],
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật",
    intro: "Lens tôn trọng và bảo vệ thông tin cá nhân của bạn.",
    sections: [
      {
        heading: "Thông tin thu thập",
        body: [
          "Website không lưu thông tin của bạn trên máy chủ. Họ tên, số điện thoại, địa chỉ chỉ được dùng để soạn tin nhắn đơn hàng mà bạn tự gửi cho shop qua Zalo/Messenger.",
          "Giỏ hàng và danh sách yêu thích được lưu ngay trên trình duyệt của bạn.",
        ],
      },
      {
        heading: "Sử dụng thông tin",
        body: ["Thông tin chỉ dùng để giao hàng và chăm sóc khách hàng, không chia sẻ cho bên thứ ba."],
      },
    ],
  },
  {
    slug: "dieu-khoan",
    title: "Điều khoản sử dụng",
    intro: `Khi mua hàng tại ${shop.name}, bạn đồng ý với các điều khoản dưới đây.`,
    sections: [
      {
        heading: "Đơn hàng",
        body: [
          "Đơn hàng chỉ được xác nhận khi shop nhắn lại qua Zalo/Messenger.",
          "Giá và khuyến mãi có thể thay đổi; giá áp dụng là giá tại thời điểm shop xác nhận đơn.",
        ],
      },
      {
        heading: "Sản phẩm handmade",
        body: ["Mỗi sản phẩm đan tay có thể chênh lệch nhỏ về kích thước và màu sắc so với ảnh — đó là nét riêng của đồ thủ công."],
      },
    ],
  },
];

export const SUPPORT_PAGES: InfoPage[] = [
  {
    slug: "huong-dan-dat-hang",
    title: "Hướng dẫn đặt hàng",
    intro: "Đặt hàng tại Lens chỉ mất khoảng 2 phút.",
    sections: [
      {
        heading: "Mua sản phẩm có sẵn",
        body: [
          "1. Vào Cửa hàng, chọn sản phẩm bạn thích.",
          "2. Ở trang sản phẩm, chọn “Mẫu có sẵn”, chọn số lượng rồi bấm “Thêm vào giỏ”.",
          "3. Vào Giỏ hàng → “Tiến hành đặt hàng”, điền thông tin nhận hàng.",
          "4. Bấm “Gửi đơn qua Zalo”: website tự sao chép nội dung đơn và mở Zalo của shop. Bạn chỉ cần dán và gửi.",
        ],
      },
      {
        heading: "Đặt làm riêng (chọn màu & thêu tên)",
        body: [
          "1. Chọn sản phẩm, ở mục “Kiểu đặt hàng” chọn “Đặt làm riêng”.",
          `2. Chọn 1 trong ${shop.customColors.length} màu len, nhập chữ muốn thêu (tối đa ${shop.customMaxChars} ký tự) và kiểu chữ viết tay hoặc in đậm.`,
          `3. Thêm vào giỏ và gửi đơn như bình thường. Lens sẽ nhắn xác nhận thiết kế trước khi đan; nhận quà sau ${shop.customDays}.`,
        ],
      },
      {
        heading: "Mã giảm giá",
        body: ["Nhập mã LENS15 ở trang Giỏ hàng để được giảm 15% cho đơn hàng đầu tiên. Shop sẽ xác nhận khi nhận đơn."],
      },
    ],
  },
  {
    slug: "giat-bao-quan",
    title: "Hướng dẫn giặt & bảo quản",
    intro: "Giữ món len luôn mềm và bền màu với vài lưu ý nhỏ.",
    sections: [
      {
        heading: "Giặt",
        body: [
          "Giặt tay bằng nước lạnh hoặc ấm dưới 30°C với nước giặt dịu nhẹ.",
          "Không vò mạnh, không vắt xoắn; ấn nhẹ để ráo nước.",
          "Không dùng thuốc tẩy, không giặt máy chế độ mạnh.",
        ],
      },
      {
        heading: "Phơi & cất",
        body: [
          "Phơi phẳng trên khăn ở nơi thoáng mát, tránh nắng gắt để len không bai, không bạc màu.",
          "Gấp gọn khi cất, không treo móc lâu ngày.",
        ],
      },
    ],
  },
  {
    slug: "cau-hoi-thuong-gap",
    title: "Câu hỏi thường gặp",
    intro: "Những thắc mắc khách hay hỏi Lens nhất.",
    sections: [
      { heading: "Thêu tên có mất phí không?", body: ["Thêu tên miễn phí, tối đa 12 ký tự."] },
      { heading: "Đặt làm riêng bao lâu thì nhận được?", body: [`Khoảng ${shop.customDays} kể từ khi shop xác nhận thiết kế.`] },
      {
        heading: "Thanh toán thế nào?",
        body: ["Bạn có thể thanh toán khi nhận hàng (COD), chuyển khoản hoặc MoMo. Shop sẽ gửi thông tin khi xác nhận đơn."],
      },
      { heading: "Có gói quà không?", body: ["Tất cả đơn đều được gói quà cẩn thận, có thiệp viết tay nếu bạn ghi chú lời nhắn."] },
    ],
  },
  {
    slug: "tra-cuu-don-hang",
    title: "Tra cứu đơn hàng",
    intro:
      "Website chưa có hệ thống tra cứu tự động. Để kiểm tra tình trạng đơn, bạn nhắn Zalo cho shop kèm mã đơn (dạng DH261022-AB12) có trong tin nhắn đặt hàng.",
    sections: [
      {
        heading: "Liên hệ",
        body: [`Zalo / Hotline: ${shop.hotline}`, `Email: ${shop.email}`, `Giờ làm việc: ${shop.openHours}`],
      },
    ],
  },
];
