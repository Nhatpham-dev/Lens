import Image from "next/image";

/**
 * Ảnh trang trí (hero, danh mục, dịp lễ, câu chuyện…). Chưa có ảnh thật → khối màu kèm chú thích như bản thiết kế.
 * Thêm ảnh: bỏ file vào public/images/site/ và ghi đường dẫn trong src/config/shop.ts → siteImages.
 */
export default function SiteImage({
  src,
  alt,
  caption,
  className = "",
  captionClassName = "text-muted",
  sizes = "100vw",
  preload,
  children,
}: {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  captionClassName?: string;
  sizes?: string;
  preload?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        caption && (
          <span className={`absolute inset-0 flex items-center justify-center p-4 text-center text-sm md:text-[15px] ${captionClassName}`}>
            {caption}
          </span>
        )
      )}
      {children}
    </div>
  );
}
