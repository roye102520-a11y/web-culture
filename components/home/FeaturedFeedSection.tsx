import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

const dramaStories = allContentRecords.filter((item) => item.category === "剧说古今");

export function FeaturedFeedSection() {
  return (
    <section id="section-featured-feed" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#991B1B]">HISTORY THROUGH SCREEN</p>
          <h2 className="mt-1 text-lg font-semibold text-[#1C1917] md:text-xl">影视里的中国历史</h2>
          <p className="mt-1 text-sm text-[#78716C]">看懂哪些细节接近历史，哪些属于影视强化。</p>
        </div>
        <Link href="/drama" className="shrink-0 text-sm text-[#57534E] hover:text-[#991B1B]">
          查看全部
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dramaStories.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#f0ece9]">
            <ContentCover
              theme={item.theme}
              title={item.title}
              badge="影视对读"
              className="aspect-video rounded-none"
              imageSrc={item.image}
            />
            <div className="space-y-3 p-4">
              <div className="flex items-center gap-2 text-xs text-[#78716C]">
                <span className="rounded-full bg-[#F7EEEE] px-2 py-1 text-[#991B1B]">{item.tags}</span>
                <span>图文精读</span>
              </div>
              <h3 className="text-base font-semibold leading-6 text-[#1C1917]">{item.title}</h3>
              <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                {item.content}
              </p>
              <Link
                href={`/content/${item.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]"
              >
                阅读全文
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
