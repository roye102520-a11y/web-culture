"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <section className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-[#efeae7]">
          <h1 className="text-2xl font-semibold">搜索结果</h1>
          <p className="mt-2 text-sm text-[#57534E]">
            关键词：<span className="font-medium text-[#1C1917]">{q || "（空）"}</span>
          </p>
          <div className="mt-5 rounded-xl bg-[#faf7f5] px-4 py-6 text-sm text-[#57534E]">
            暂无搜索结果，后续将接入完整检索能力。
          </div>
        </section>
      </main>
    </div>
  );
}
