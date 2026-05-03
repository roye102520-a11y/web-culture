"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface QuickNavTabItem {
  id: string;
  label: string;
  targetId: string;
}

interface QuickNavTabsProps {
  items: QuickNavTabItem[];
}

// 核心意图：提供首页快捷浏览入口，支持移动端横向滑动与平滑定位到对应内容区。
export function QuickNavTabs({ items }: QuickNavTabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const onTabClick = (item: QuickNavTabItem) => {
    setActiveId(item.id);
    const target = document.getElementById(item.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-[#efebe8]">
      <div className="flex gap-1 overflow-x-auto whitespace-nowrap pb-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabClick(item)}
              className={`relative rounded-xl px-3 py-2 text-sm transition ${
                active ? "text-[#1C1917]" : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              {item.label}
              {active && (
                <motion.span
                  layoutId="quick-nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#D4A017]"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
