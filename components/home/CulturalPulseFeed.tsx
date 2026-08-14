"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { getContentLinkByTitle } from "@/data/content-adapters";

const feedItems = [
  {
    id: "pulse-1",
    title: "李白和杜甫在洛阳相遇时聊了什么？",
    cta: "点击查看 AI 深度解析",
  },
  {
    id: "pulse-2",
    title: "《红楼梦》里的建筑美学，如何体现在潇湘馆？",
    cta: "点击进入典籍探疑",
  },
  {
    id: "pulse-3",
    title: "科举改变了谁的人生路径？",
    cta: "点击查看历史脉络",
  },
];

export function CulturalPulseFeed() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">大家正在探讨</h2>
        <Link href="/explore" className="text-sm text-[#57534E] hover:text-[#991B1B]">
          更多
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {feedItems.map((item) => (
          <Link key={item.id} href={getContentLinkByTitle(item.title)} className="block">
            <motion.article
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-w-[260px] rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-[#efebe8] md:min-w-[320px]"
            >
              <p className="text-sm leading-7 text-[#1C1917]">{item.title}</p>
              <p className="mt-3 text-xs text-[#991B1B]">{item.cta} →</p>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}
