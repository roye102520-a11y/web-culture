"use client";

import { motion } from "framer-motion";

interface RankingCardBaseProps {
  rank: number;
  name: string;
  badge: string;
  score: number;
  compact?: boolean;
  avatarText?: string;
  replyRate?: number;
  averageReplyHours?: number;
  className?: string;
}

export function RankingCardBase({
  rank,
  name,
  badge,
  score,
  compact = false,
  avatarText,
  replyRate,
  averageReplyHours,
  className = "",
}: RankingCardBaseProps) {
  const top3 = rank <= 3;

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl bg-white/90 px-5 py-4 shadow-sm ring-1 ring-[#991B1B]/6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={
            top3
              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#991B1B]/18 text-lg font-bold text-[#991B1B] ring-1 ring-[#991B1B]/25"
              : "flex h-11 w-11 shrink-0 items-center justify-center text-lg font-medium text-[#a8a29e]"
          }
        >
          {rank}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f0ee] text-xs font-semibold text-[#7F1D1D]">
              {(avatarText || name).slice(0, 1)}
            </div>
            <h3 className="truncate text-base font-semibold text-[#1C1917]">{name}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#991B1B]/12 px-2.5 py-0.5 text-xs font-medium text-[#991B1B]">{badge}</span>
            <span className="ml-auto text-sm font-semibold text-[#991B1B]">{score.toFixed(1)} 分</span>
          </div>

          {!compact && replyRate !== undefined && averageReplyHours !== undefined && (
            <p className="text-sm text-[#57534E]">
              回复率 {replyRate}% · 平均 {averageReplyHours.toFixed(1)}h
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
