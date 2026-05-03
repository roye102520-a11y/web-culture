import Link from "next/link";

const columns = [
  {
    title: "考试专区",
    desc: "时间线 × 难题 × 刷题，快速建立高频考点的答题框架。",
    href: "/exam",
    tone: "from-[#fff8f6] to-[#f3ece7]",
  },
  {
    title: "剧说古今",
    desc: "甄嬛传・纪录片・大明王朝…从影视入口理解真实历史语境。",
    href: "/drama",
    tone: "from-[#f8faf6] to-[#ebf1e8]",
  },
  {
    title: "八卦来了",
    desc: "翻字狂欢・换颜・本草…轻松趣味中理解文化知识的传播脉络。",
    href: "/gossip",
    tone: "from-[#f8f8fc] to-[#ececf5]",
  },
] as const;

export function ThreeColumnsSection() {
  return (
    <section className="space-y-4" id="section-columns">
      <p className="text-sm leading-6 text-[#78716C]">
        在文脉最独特的传统中华文化、名人轶事——从入口，向一键跳进社区玩法
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {columns.map((item) => (
          <article key={item.title} className={`rounded-2xl bg-gradient-to-br ${item.tone} p-5 shadow-sm ring-1 ring-[#f0ece9]`}>
            <h3 className="text-2xl font-semibold tracking-tight text-[#1C1917]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              {item.desc}
            </p>
            <Link href={item.href} className="mt-5 inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
              进入专区 →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
