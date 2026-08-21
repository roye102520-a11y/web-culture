import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";

const featuredArticle = {
  href: "/content/18",
  title: "《长安十二时辰》为什么让唐代长安“活起来了”？",
  titleEn: "How The Longest Day in Chang'an Brought Tang-Era Chang'an to Life",
  description: "它的历史感不只来自服饰和建筑，更来自坊市、宵禁、官署与市井生活共同组成的一座城市。",
};

export function TodayCultureCard() {
  return (
    <section aria-labelledby="today-culture-title" className="space-y-3">
      <div>
        <p className="text-xs font-medium text-[#991B1B]">UNDERSTAND CHINA TODAY</p>
        <h1 id="today-culture-title" className="mt-1 text-xl font-semibold text-[#1C1917] md:text-2xl">
          今日看懂一个中国文化点
        </h1>
      </div>

      <article className="grid overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#ebe6e2] md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <ContentCover
          theme="drama"
          title={featuredArticle.title}
          badge="影视对读"
          className="min-h-56 rounded-none md:min-h-80"
          imageSrc="/images/covers/tang-anshi-war.png"
        />

        <div className="flex flex-col justify-center p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C]">
            <span className="rounded-full bg-[#F7EEEE] px-2.5 py-1 font-medium text-[#991B1B]">唐代城市生活</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              约 8 分钟
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-9 text-[#1C1917]">{featuredArticle.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">{featuredArticle.titleEn}</p>
          <p className="mt-5 text-base leading-7 text-[#57534E]">{featuredArticle.description}</p>

          <Link
            href={featuredArticle.href}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[#991B1B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7F1D1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] focus-visible:ring-offset-2"
          >
            读懂这座长安
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </section>
  );
}
