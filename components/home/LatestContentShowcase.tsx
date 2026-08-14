import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { latestContentFromCsv } from "@/data/content-adapters";
import { fmtCount } from "@/lib/format";

const hotTop5 = latestContentFromCsv
  .slice()
  .sort((a, b) => b.playCount - a.playCount)
  .slice(0, 5)
  .map((item, index) => ({ rank: index + 1, title: item.title, url: item.url }));

export function LatestContentShowcase() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">内容广场 · 最新上线</h2>
        <Link href="/explore" className="text-sm text-[#57534E] hover:text-[#991B1B]">
          更多
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {latestContentFromCsv.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
              <ContentCover theme={item.theme} title={item.title} badge={item.type} className="aspect-video" />
              <div className="space-y-2 px-1 pb-1 pt-3">
                <h3 className="text-base font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between text-xs text-[#78716C]">
                  <span>{item.publishedAt} 上线</span>
                  <span>播放量 {fmtCount(item.playCount)}</span>
                </div>
                <Link href={item.url} className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                  查看详情 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#f0ece9]">
          <h3 className="text-base font-semibold text-[#1C1917]">历史热听榜</h3>
          <div className="mt-3 space-y-2">
            {hotTop5.map((item, index) => (
              <Link
                key={item.rank}
                href={item.url}
                className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-[#faf7f5]"
              >
                <span className="w-5 shrink-0 text-sm font-semibold text-[#991B1B]">{index + 1}</span>
                <span className="text-sm text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
