import { BookOpenText, Landmark, ScrollText } from "lucide-react";

const items = [
  {
    title: "朝代纪元",
    subtitle: "从唐宋到明清，沿时间线重构历史场景",
    icon: Landmark,
    className: "sm:col-span-4",
    tone: "from-[#fffdfb] to-[#f4eee9]",
  },
  {
    title: "学林试剑",
    subtitle: "聚焦高频考点与错因链路",
    icon: ScrollText,
    className: "sm:col-span-2",
    tone: "from-[#fffdfa] to-[#f2ece7]",
  },
  {
    title: "书山探径",
    subtitle: "四大名著与典籍导读的沉浸入口",
    icon: BookOpenText,
    className: "sm:col-span-3",
    tone: "from-[#fffefc] to-[#f4efea]",
  },
  {
    title: "剧说古今",
    subtitle: "从影视线索回溯真实史料脉络",
    icon: ScrollText,
    className: "sm:col-span-3",
    tone: "from-[#fffdfb] to-[#f3ede8]",
  },
];

export function TimeTravelGrid() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">时空漫游</h2>
      <div className="grid gap-3 sm:grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className={`${item.className} rounded-2xl bg-gradient-to-br ${item.tone} p-5 shadow-sm ring-1 ring-[#f0ece9]`}
            >
              <Icon className="h-4 w-4 text-[#991B1B]" />
              <h3 className="mt-3 text-base font-semibold text-[#1C1917]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#57534E]">{item.subtitle}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
