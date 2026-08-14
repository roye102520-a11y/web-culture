"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ContentCover, type ContentCoverTheme } from "@/components/ui/ContentCover";
import { categoryContentFromCsv } from "@/data/content-adapters";

type Dynasty = "唐" | "宋" | "元" | "明" | "清";
type ContentType = "成语" | "新词" | "影视" | "历史";

type CategoryItem = {
  id: string;
  title: string;
  summary: string;
  dynasty: Dynasty;
  contentType: ContentType;
  coverImage: string;
  likes: number;
  favorites: number;
  url: string;
  theme: ContentCoverTheme;
};

const dynastyOptions: Dynasty[] = ["唐", "宋", "元", "明", "清"];
const typeOptions: ContentType[] = ["成语", "新词", "影视", "历史"];
const items: CategoryItem[] = categoryContentFromCsv.map((item) => ({
  id: item.id,
  title: item.title,
  summary: item.desc,
  dynasty: item.dynasty,
  contentType: item.contentType,
  coverImage: "",
  likes: item.likes,
  favorites: item.collects,
  url: item.url,
  theme: item.theme,
}));

interface CategoryBrowseSectionProps {
  title?: string;
}

export function CategoryBrowseSection({ title = "分类浏览" }: CategoryBrowseSectionProps) {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty>("唐");
  const [selectedType, setSelectedType] = useState<ContentType>("历史");

  const filtered = useMemo(() => {
    return items.filter((item) => item.dynasty === selectedDynasty && item.contentType === selectedType);
  }, [selectedDynasty, selectedType]);

  const baseTag = "rounded-full border px-3 py-1.5 text-sm transition";
  const activeTag = "border-[#D4A017] bg-[#f8f1dd] text-[#7a5a00]";
  const idleTag = "border-[#e7e5e4] bg-white text-[#57534E] hover:text-[#1C1917]";

  return (
    <section className="space-y-4" id="section-category">
      <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">{title}</h2>

      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#f0ece9]">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-[#78716C]">朝代筛选</p>
          <div className="flex flex-wrap gap-2">
            {dynastyOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedDynasty(item)}
                className={`${baseTag} ${selectedDynasty === item ? activeTag : idleTag}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-[#78716C]">类型筛选</p>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedType(item)}
                className={`${baseTag} ${selectedType === item ? activeTag : idleTag}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
            <div className="relative overflow-hidden rounded-xl">
              <ContentCover theme={item.theme} title={item.title} badge={item.contentType} className="aspect-video" />
            </div>

            <div className="space-y-2 px-1 pb-1 pt-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-[#57534E]">{item.dynasty}</span>
                <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-[#57534E]">{item.contentType}</span>
              </div>
              <h3 className="text-sm font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {item.summary}
              </p>
              <p className="text-xs text-[#78716C]">👍 {item.likes} · ⭐ {item.favorites}</p>
              <Link href={item.url} className="inline-block text-xs text-[#991B1B] hover:text-[#7F1D1D]">
                查看详情 →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[#57534E] shadow-sm ring-1 ring-[#f0ece9]">
          当前筛选组合下暂无内容，请调整筛选条件。
        </div>
      )}
    </section>
  );
}
