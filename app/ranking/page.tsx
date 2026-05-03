"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type RankingTab = "周榜" | "月榜" | "总榜";

type ExpertItem = {
  id: string;
  name: string;
  culturePoints: number;
  level: string;
  fans: number;
  articles: number;
};

const tabs: RankingTab[] = ["周榜", "月榜", "总榜"];

const baseExperts: ExpertItem[] = [
  { id: "e-01", name: "李明", culturePoints: 9820, level: "文化点达人", fans: 12890, articles: 126 },
  { id: "e-02", name: "王芳", culturePoints: 9560, level: "文化点达人", fans: 11420, articles: 103 },
  { id: "e-03", name: "Dr.Chen", culturePoints: 9320, level: "文化点达人", fans: 10980, articles: 97 },
  { id: "e-04", name: "赵雷", culturePoints: 9010, level: "文化研究者", fans: 9840, articles: 88 },
  { id: "e-05", name: "钱玄", culturePoints: 8890, level: "文化研究者", fans: 9250, articles: 79 },
  { id: "e-06", name: "孙月", culturePoints: 8620, level: "文化讲解官", fans: 8520, articles: 72 },
  { id: "e-07", name: "周宁", culturePoints: 8430, level: "文化讲解官", fans: 8010, articles: 68 },
  { id: "e-08", name: "吴清", culturePoints: 8210, level: "文化点达人", fans: 7690, articles: 61 },
  { id: "e-09", name: "郑嘉", culturePoints: 8030, level: "文化研究者", fans: 7350, articles: 56 },
  { id: "e-10", name: "林岳", culturePoints: 7860, level: "文化讲解官", fans: 7020, articles: 51 },
];

const hotQuestions = [
  "《竹书纪年》与《史记》差异如何取证？",
  "王阳明后学为何批判朱子？",
  "唐宋科举制度变化的核心逻辑是什么？",
  "《红楼梦》建筑美学如何影响人物叙事？",
  "里耶秦简如何帮助重建秦代基层治理？",
];

function formatNum(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  return `${value}`;
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[#f9e7b4] text-[#8a6400] ring-[#e2bf5f]";
  if (rank === 2) return "bg-[#eceff3] text-[#5f6b7a] ring-[#c8d0db]";
  if (rank === 3) return "bg-[#f3ddd0] text-[#8d5a34] ring-[#dfb898]";
  return "bg-[#f5f2ef] text-[#78716C] ring-[#e7e5e4]";
}

function getDiceBearAvatar(name: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
}

export default function RankingPage() {
  const [tab, setTab] = useState<RankingTab>("周榜");

  const list = useMemo(() => {
    if (tab === "周榜") return baseExperts;
    if (tab === "月榜") {
      return baseExperts
        .map((item, index) => ({ ...item, culturePoints: item.culturePoints + 400 - index * 10 }))
        .sort((a, b) => b.culturePoints - a.culturePoints);
    }
    return baseExperts
      .map((item, index) => ({ ...item, culturePoints: item.culturePoints + 900 - index * 20 }))
      .sort((a, b) => b.culturePoints - a.culturePoints);
  }, [tab]);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <section className="space-y-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold">文化人排行榜</h1>
              <div className="flex gap-2">
                {tabs.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      tab === item
                        ? "bg-[#991B1B] text-white"
                        : "bg-white text-[#57534E] ring-1 ring-[#e7e5e4] hover:text-[#1C1917]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {list.map((item, idx) => {
                const rank = idx + 1;
                return (
                  <article key={item.id} className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#f0ece9]">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1 ${rankBadgeClass(rank)}`}>
                        {rank}
                      </div>

                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f3f0ed] ring-1 ring-[#e8e2dd]">
                        <Image
                          src={getDiceBearAvatar(item.name)}
                          alt={`${item.name} avatar`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-[#1C1917]">{item.name}</p>
                          <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-xs text-[#57534E]">{item.level}</span>
                          <span className="ml-auto text-sm font-semibold text-[#991B1B]">{item.culturePoints} 点</span>
                        </div>
                        <p className="text-xs text-[#78716C]">粉丝 {formatNum(item.fans)} · 主页文章 {item.articles} 篇</p>
                      </div>

                      <Link href={`/expert/${item.id}`} className="shrink-0 text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                        查看主页 →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#efeae7] lg:sticky lg:top-6">
            <h2 className="text-base font-semibold text-[#1C1917]">🔥 热门问题</h2>
            <div className="mt-3 space-y-2">
              {hotQuestions.map((q, idx) => (
                <div key={q} className="rounded-lg bg-[#faf7f5] px-3 py-2">
                  <p className="text-xs text-[#991B1B]">TOP {idx + 1}</p>
                  <p className="mt-1 text-sm leading-6 text-[#57534E]">{q}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
