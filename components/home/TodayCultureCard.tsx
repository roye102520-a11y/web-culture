"use client";

import { RefreshCcw, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const quotes = [
  { text: "大漠孤烟直，长河落日圆。", tone: "from-[#fffdfb] via-[#f5efea] to-[#f1e6df]" },
  { text: "江流天地外，山色有无中。", tone: "from-[#fffefc] via-[#f7f3ee] to-[#efe8e1]" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", tone: "from-[#fffdfc] via-[#f5f1ec] to-[#ece6df]" },
];

export function TodayCultureCard() {
  const [index, setIndex] = useState(0);

  const current = useMemo(() => quotes[index], [index]);

  const refresh = () => {
    setIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <section className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-2xl bg-gradient-to-br ${current.tone} px-6 py-10 text-center md:px-8 md:py-12`}
          >
            <p className="text-xs tracking-[0.18em] text-[#78716C]">文化今日点亮</p>
            <p className="mx-auto mt-4 max-w-2xl text-2xl font-semibold tracking-wide text-[#1C1917] md:text-3xl">
              {current.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={refresh}
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#991B1B] shadow-sm transition hover:bg-white"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
        <input
          type="text"
          placeholder="搜索你想了解的文史奥秘..."
          className="h-12 w-full rounded-2xl bg-white pl-11 pr-4 text-sm text-[#1C1917] shadow-sm ring-1 ring-transparent outline-none transition focus:ring-[#991B1B]/45"
        />
      </label>
    </section>
  );
}
