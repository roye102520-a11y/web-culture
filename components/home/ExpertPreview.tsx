import { getHomepageTopRankings } from "@/lib/look-rankings";

const experts = getHomepageTopRankings(3);

export function ExpertPreview() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">文化人排行榜</h2>
        <span className="rounded-full bg-[#991B1B]/10 px-2 py-0.5 text-xs text-[#991B1B]">公测中</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {experts.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white px-4 py-5 text-center shadow-sm ring-1 ring-[#f0ece9]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f0ed] text-lg font-semibold text-[#7F1D1D]">
              {item.name.slice(0, 1)}
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1C1917]">{item.name}</p>
            <p className="mt-1 text-xs text-[#57534E]">{item.badge}</p>
            <div className="mt-3 space-y-1 text-xs text-[#57534E]">
              <p>
                回复率 <span className="font-medium text-[#991B1B]">{item.replyRate}%</span>
              </p>
              <p>
                活跃度 <span className="font-medium text-[#991B1B]">{item.score.toFixed(1)}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
