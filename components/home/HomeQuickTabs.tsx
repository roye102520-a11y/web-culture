"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface HomeQuickTabItem {
  id: string;
  label: string;
  targetId: string;
}

interface HomeQuickTabsProps {
  items: HomeQuickTabItem[];
}

export function HomeQuickTabs({ items }: HomeQuickTabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const onTabClick = (item: HomeQuickTabItem) => {
    setActiveId(item.id);
    const target = document.getElementById(item.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="overflow-x-auto border-b border-[#e7e1dc] bg-[#f4efea] px-1 py-2">
      <div className="flex min-w-max items-center gap-2 whitespace-nowrap px-2">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabClick(item)}
              className={`relative px-3 py-2 text-sm transition ${
                active ? "text-[#1C1917]" : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              {item.label}
              {active && (
                <motion.span
                  layoutId="home-quick-tabs-underline"
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
