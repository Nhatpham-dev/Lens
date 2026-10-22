import type { Metadata } from "next";
import SearchView from "@/components/SearchView";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default function SearchPage() {
  return (
    <div className="container-page min-h-[60vh] pb-20 pt-10 md:pt-12">
      <h1 className="text-[30px] font-bold md:text-[36px]">Tìm kiếm</h1>
      <SearchView />
    </div>
  );
}
