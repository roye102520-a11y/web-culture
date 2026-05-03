"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { RankingCardBase } from "@/components/ranking/RankingCardBase";
import { getHomepageTopRankings } from "@/lib/look-rankings";

const top3 = getHomepageTopRankings(3);

export function HomeTopRankings() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">本周文化人 Top 3</h2>
        <Link href="/look" className="text-sm text-[#7F1D1D] transition hover:text-[#991B1B]">
          查看完整榜单 &gt;
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible"
      >
        {top3.map((item, index) => (
          <div key={item.id} className="min-w-[250px] md:min-w-0">
            <RankingCardBase
              rank={index + 1}
              name={item.name}
              badge={item.badge}
              score={item.score}
              compact
              className="h-full"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
