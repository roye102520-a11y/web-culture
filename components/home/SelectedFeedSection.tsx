"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ContentCover } from "@/components/ui/ContentCover";
import { selectedFeedFromCsv } from "@/data/content-adapters";
import { getAIErrorMessage } from "@/lib/client-ai";

type FeedType = "图文";

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

type FeedItem = {
  id: string;
  type: FeedType;
  title: string;
  summary: string;
  likes: number;
  saves: number;
  comments: number;
  theme: "palace" | "greatwall" | "scroll" | "lantern" | "landscape" | "drama" | "calligraphy" | "mountain" | "bronze" | "tea";
  url: string;
};

const PAGE_SIZE = 8;
const items: FeedItem[] = selectedFeedFromCsv.map((item) => ({
  id: item.id,
  type: "图文",
  title: item.title,
  summary: item.desc,
  likes: item.likes,
  saves: item.collects,
  comments: item.comments,
  theme: item.theme,
  url: item.url,
}));

export function SelectedFeedSection() {
  const [page, setPage] = useState(1);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});
  const [guideMap, setGuideMap] = useState<Record<string, string>>({});

  const visible = useMemo(() => items.slice(0, page * PAGE_SIZE), [page]);

  const loadMore = () => setPage((prev) => prev + 1);

  const runGuide = async (item: FeedItem) => {
    setLoadingMap((prev) => ({ ...prev, [item.id]: true }));
    setErrorMap((prev) => ({ ...prev, [item.id]: null }));

    try {
      const res = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: item.title, mode: 'video_guide' }),
      });
      const data = (await res.json()) as AIRequestPayload;

      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }

      setGuideMap((prev) => ({ ...prev, [item.id]: data.result?.answer ?? '' }));
    } catch (e) {
      setErrorMap((prev) => ({ ...prev, [item.id]: e instanceof Error ? e.message : "暂时不可用" }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const hasMore = visible.length < items.length;

  return (
    <section id="section-selected-feed" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">看看精选</h2>
        <Link href="/look/explain" className="text-sm text-[#57534E] hover:text-[#991B1B]">AI历史讲解 →</Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <span className="rounded-full bg-[#991B1B] px-4 py-2 text-sm text-white">图文精选</span>
      </div>

      <div className="space-y-3">
        {visible.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
            <div className="grid gap-3 md:grid-cols-[40%_1fr]">
              <div className="relative overflow-hidden rounded-xl">
                <ContentCover theme={item.theme} title={item.title} badge={item.type} className="aspect-video" />
              </div>

              <div className="space-y-2 p-1">
                <span className="inline-block rounded-full bg-[#f5f2ef] px-2 py-0.5 text-xs text-[#57534E]">{item.type}</span>
                <h3 className="text-base font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                  {item.summary}
                </p>
                <div className="text-xs text-[#78716C]">
                  👍 {item.likes} | 🔖 {item.saves} | 💬 {item.comments}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm" variant="outline" className="bg-white text-[#57534E]">
                    <Link href={item.url}>阅读全文</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                    onClick={() => void runGuide(item)}
                    disabled={loadingMap[item.id]}
                  >
                    DeepSeek导读
                  </Button>
                </div>

                {loadingMap[item.id] && (
                  <div className="rounded-lg bg-[#f8f4f2] px-3 py-2 text-sm text-[#991B1B] animate-pulse">
                    正在生成导读提纲...
                  </div>
                )}
                {errorMap[item.id] && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMap[item.id]}</div>}
                {guideMap[item.id] && !loadingMap[item.id] && (
                  <div className="rounded-lg bg-stone-50 px-3 py-2 text-sm leading-6 text-[#57534E]">{guideMap[item.id]}</div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} className="bg-white text-[#57534E]">
            加载更多
          </Button>
        </div>
      )}
    </section>
  );
}
