import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

const gossipItems = allContentRecords.filter((item) => item.category === "八卦来了");

const quickAngles = [
  { label: "人物趣闻", text: "从诗人、皇帝、士人日常切入，把熟悉人物读得更立体。" },
  { label: "生活史", text: "吃饭、洗浴、出行、如厕这些小事，往往最能说明时代差异。" },
  { label: "争议辨析", text: "把流传很广的说法拆开，看证据、出处和后世加工。" },
];

export default function GossipPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5">
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-[#7a5a00]">轻知识专栏</p>
                <h1 className="mt-1 text-2xl font-semibold md:text-3xl">八卦来了</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#57534E]">
                  用轻松问题打开严肃历史：人物性格、生活细节、传闻争议，都尽量落回可解释的材料和语境。
                </p>
              </div>
              <Link href="/categories" className="shrink-0 text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                去分类里继续挖 →
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="space-y-3">
              {quickAngles.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#efeae7]">
                  <h2 className="text-base font-semibold">{item.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#57534E]">{item.text}</p>
                </div>
              ))}
            </aside>

            <div className="grid gap-3 md:grid-cols-2">
              {gossipItems.map((item) => (
                <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
                  <ContentCover theme={item.theme} title={item.title} badge={item.tags} className="aspect-video" />
                  <div className="space-y-2 px-1 pt-3">
                    <h2 className="text-base font-semibold leading-6">{item.title}</h2>
                    <p className="text-sm leading-6 text-[#57534E]">{item.content}</p>
                    <div className="flex items-center justify-between gap-3 text-xs text-[#78716C]">
                      <span>来源：{item.source}</span>
                      <span>难度 {item.difficulty}</span>
                    </div>
                    <Link href={`/content/${item.id}`} className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                      看解释 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
