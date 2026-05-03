"use client";

import { motion } from "framer-motion";

const dynastyCards = [
  { title: "唐代", subtitle: "诗歌繁盛与制度革新", gradient: "from-[#f9f3f1] to-[#f3ece8]" },
  { title: "宋代", subtitle: "理学兴起与市民文化", gradient: "from-[#f8f4ef] to-[#efebe6]" },
  { title: "元代", subtitle: "多元交融与戏曲发展", gradient: "from-[#f7f2ef] to-[#ece8e5]" },
  { title: "明清", subtitle: "小说高峰与社会转型", gradient: "from-[#f8f4f2] to-[#eee7e4]" },
];

const topicTags = ["古诗词", "成语典故", "历史大事件", "科举考点"];

export function CategoryGrid() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[#991B1B]" />
          <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">朝代时间线（史海钩沉）</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dynastyCards.map((item) => (
            <motion.article
              key={item.title}
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`rounded-2xl bg-gradient-to-br ${item.gradient} p-5 shadow-sm`}
            >
              <h3 className="text-base font-medium text-[#1C1917]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#57534E]">{item.subtitle}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[#991B1B]" />
          <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">主题线（探索主题）</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {topicTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm text-[#57534E] shadow-sm transition hover:bg-[#991B1B]/10 hover:text-[#991B1B]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
