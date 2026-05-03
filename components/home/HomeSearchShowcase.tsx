import Link from "next/link";
import { Search } from "lucide-react";

export function HomeSearchShowcase() {
  return (
    <section className="space-y-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
        <input
          type="text"
          placeholder="搜索朝代、历史人物或考点..."
          className="h-12 w-full rounded-2xl bg-white pl-11 pr-4 text-sm text-[#1C1917] shadow-sm outline-none ring-1 ring-transparent transition focus:ring-[#991B1B]/45"
        />
      </label>

      <Link
        href="/look"
        className="block rounded-2xl bg-red-50 px-4 py-3 text-sm text-[#991B1B] shadow-sm transition hover:bg-red-100"
      >
        ✨ 全新功能体验：看看功能已上线，点击围观文化人排行榜 ➔
      </Link>
    </section>
  );
}
