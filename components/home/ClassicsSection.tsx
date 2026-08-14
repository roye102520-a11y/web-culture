"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { classicsContentFromCsv } from "@/data/content-adapters";

type ClassicBook = "红楼梦" | "三国演义" | "水浒传" | "西游记";
type ClassicCard = {
  id: string;
  href: string;
  title: string;
  summary: string;
  type: "视频" | "播客" | "长文";
};

const books: ClassicBook[] = ["红楼梦", "三国演义", "水浒传", "西游记"];

const typeColor: Record<ClassicCard["type"], string> = {
  视频: "bg-red-50 text-red-700",
  播客: "bg-amber-50 text-amber-700",
  长文: "bg-stone-100 text-stone-700",
};

export function ClassicsSection() {
  const [activeBook, setActiveBook] = useState<ClassicBook>("红楼梦");
  const cards = useMemo(
    () =>
      classicsContentFromCsv[activeBook].map(
        (card): ClassicCard => ({
          id: `csv-${card.id}`,
          href: `/content/${card.id}`,
          title: card.title,
          summary: card.content,
          type: "长文",
        }),
      ),
    [activeBook],
  );
  const accentColor =
    activeBook === "红楼梦" ? "#6b0010" : activeBook === "三国演义" ? "#1A3A1A" : activeBook === "水浒传" ? "#003d1f" : "#3A2A0A";

  return (
    <section className="space-y-4" id="section-classics">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">四大名著聚合</h2>
        <Link href="/classics" className="text-sm text-[#57534E] hover:text-[#991B1B]">
          查看全部 →
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {books.map((book) => (
          <button
            key={book}
            type="button"
            onClick={() => setActiveBook(book)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              activeBook === book
                ? "bg-[#991B1B] text-white"
                : "bg-white text-[#57534E] ring-1 ring-[#efeae7] hover:text-[#1C1917]"
            }`}
          >
            {book}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeBook}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-gradient-to-br from-[#faf7f4] to-[#f4eeea] p-4 shadow-sm ring-1"
          style={{ borderColor: accentColor }}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <article key={card.id} className="rounded-xl bg-white/90 p-4 shadow-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs ${typeColor[card.type]}`}>{card.type}</span>
                <h3 className="mt-2 text-sm font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {card.summary}
                </p>
                <Link
                  href={card.href}
                  className="mt-3 inline-block text-xs text-[#991B1B] hover:text-[#7F1D1D]"
                >
                  阅读正文 →
                </Link>
              </article>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
