import { formatVND } from "@/lib/format";

export default function PriceTag({
  price,
  compareAt,
  size = "md",
  className = "",
}: {
  price: number;
  compareAt: number | null;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      <span className={`font-bold text-primary ${size === "lg" ? "text-[28px]" : "text-[18px] md:text-[20px]"}`}>
        {formatVND(price)}
      </span>
      {compareAt && compareAt > price && (
        <s className={`text-muted/80 ${size === "lg" ? "text-lg" : "text-[13px] md:text-[14px]"}`}>
          <span className="sr-only">Giá gốc </span>
          {formatVND(compareAt)}
        </s>
      )}
    </p>
  );
}
