"use client";

import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import { RankingCardBase } from "@/components/ranking/RankingCardBase";
import { Button } from "@/components/ui/button";
import { useLookRankings } from "@/hooks/useLookRankings";
import type { RankingDynasty, RankingTopic } from "@/lib/look-rankings";

const topicOptions: Array<{ value: RankingTopic; label: string }> = [
  { value: "all", label: "全部领域" },
  { value: "history", label: "历史研究" },
  { value: "poetry", label: "诗词鉴赏" },
  { value: "idiom", label: "成语古语" },
];

const dynastyOptions: Array<{ value: RankingDynasty; label: string }> = [
  { value: "all", label: "全部朝代" },
  { value: "tang", label: "唐代" },
  { value: "song", label: "宋代" },
  { value: "ming-qing", label: "明清" },
];

export default function LookPage() {
  const { filters, items, total, isLoading, errorMessage, setBoard, setTopic, setDynasty, retry } =
    useLookRankings();

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <section className="rounded-3xl bg-gradient-to-b from-[#FBF7F5] to-[#F7F6F2] p-5 shadow-sm ring-1 ring-[#991B1B]/8 md:p-6">
          <header className="flex items-center justify-between">
            <button type="button" className="inline-flex items-center gap-1 text-sm text-[#57534E]">
              <ChevronLeft className="h-4 w-4 text-[#991B1B]" />
              返回
            </button>
            <h1 className="text-lg font-semibold tracking-wide">文化人排行榜</h1>
            <span className="w-12" />
          </header>

          <p className="mt-4 text-xs text-[#991B1B]/80">每周更新</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setBoard("free")}
              className={
                filters.board === "free"
                  ? "rounded-full bg-[#991B1B] px-4 py-1.5 text-sm font-medium text-white shadow-sm"
                  : "rounded-full bg-white/90 px-4 py-1.5 text-sm text-[#57534E] ring-1 ring-[#991B1B]/10"
              }
            >
              免费榜
            </button>
            <button
              type="button"
              onClick={() => setBoard("paid")}
              className={
                filters.board === "paid"
                  ? "rounded-full bg-[#991B1B] px-4 py-1.5 text-sm font-medium text-white shadow-sm"
                  : "rounded-full bg-white/90 px-4 py-1.5 text-sm text-[#57534E] ring-1 ring-[#991B1B]/10"
              }
            >
              付费榜
            </button>

            <select
              value={filters.dynasty}
              onChange={(event) => setDynasty(event.target.value as RankingDynasty)}
              className="rounded-full bg-white px-3 py-1.5 text-sm text-[#57534E] outline-none"
            >
              {dynastyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.topic}
              onChange={(event) => setTopic(event.target.value as RankingTopic)}
              className="rounded-full bg-white px-3 py-1.5 text-sm text-[#57534E] outline-none"
            >
              {topicOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-3 text-xs text-[#7F1D1D]">当前: {filters.board === "free" ? "免费榜" : "付费榜"} · 综合排名</p>

          {isLoading && (
            <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-[#991B1B] shadow-sm animate-pulse">
              正在更新排行榜...
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-xl bg-[#991B1B]/10 px-4 py-3 text-sm text-[#991B1B] shadow-sm">
              {errorMessage}
              <Button size="sm" variant="outline" className="ml-2" onClick={() => void retry()}>
                重试
              </Button>
            </div>
          )}

          {!isLoading && !errorMessage && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
              className="mt-4 space-y-3"
            >
              {items.map((item, index) => (
                <RankingCardBase
                  key={item.id}
                  rank={index + 1}
                  name={item.name}
                  badge={item.badge}
                  score={item.score}
                  replyRate={item.replyRate}
                  averageReplyHours={item.averageReplyHours}
                />
              ))}
              {total === 0 && (
                <div className="rounded-xl bg-white px-4 py-8 text-center text-sm text-[#57534E] shadow-sm">
                  当前筛选条件下暂无数据
                </div>
              )}
              <p className="pt-1 text-center text-xs text-[#A8A29E]">没有更多专家了</p>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
