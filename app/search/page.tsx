"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const normalized = q.toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return allContentRecords.slice(0, 8);
    return allContentRecords
      .filter((item) => {
        const haystack = `${item.title} ${item.content} ${item.category} ${item.tags} ${item.source}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 12);
  }, [normalized]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    results.forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + 1));
    return Array.from(map.entries());
  }, [results]);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f1dd] text-[#7a5a00]">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">搜索结果</h1>
            <p className="mt-2 text-sm text-[#57534E]">
              {q ? (
                <>
                  关键词：<span className="font-medium text-[#1C1917]">{q}</span> · 找到 {results.length} 条内容
                </>
              ) : (
                "未输入关键词，先展示站内推荐内容。"
              )}
            </p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(([category, count]) => (
              <span key={category} className="rounded-full bg-[#faf7f5] px-3 py-1.5 text-sm text-[#57534E] ring-1 ring-[#efeae7]">
                {category} · {count}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((item) => (
            <Link key={item.id} href={`/content/${item.id}`} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9] hover:shadow-md">
              <ContentCover theme={item.theme} title={item.title} badge={item.category} className="aspect-video" />
              <div className="space-y-2 px-1 pt-3">
                <div className="flex flex-wrap gap-2 text-xs text-[#78716C]">
                  <span>{item.contentTypeCN}</span>
                  <span>{item.tags}</span>
                  <span>难度 {item.difficulty}</span>
                </div>
                <h2 className="text-base font-semibold leading-6">{item.title}</h2>
                <p className="text-sm leading-6 text-[#57534E]">{item.content}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-4 py-10 text-center shadow-sm ring-1 ring-[#f0ece9]">
          <p className="text-sm text-[#57534E]">没有找到匹配内容，可以换个关键词，或直接向 AI / 达人提问。</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/look/deepseek" className="rounded-xl bg-[#991B1B] px-4 py-2 text-sm text-white hover:bg-[#7F1D1D]">
              AI 问答
            </Link>
            <Link href="/question/new" className="rounded-xl border border-[#e7e5e4] bg-white px-4 py-2 text-sm text-[#57534E] hover:text-[#1C1917]">
              发布提问
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <Suspense fallback={<div className="rounded-2xl bg-white p-6 text-sm text-[#57534E] shadow-sm">正在加载搜索结果...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
