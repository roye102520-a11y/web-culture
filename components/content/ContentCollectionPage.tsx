import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import type { ContentRecord } from "@/data/content-adapters";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: ContentRecord[];
};

export function ContentCollectionPage({ eyebrow, title, description, items }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="text-xs font-medium text-[#991B1B]">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
          <p className="mt-3 text-base leading-7 text-[#57534E]">{description}</p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#ebe6e2]">
              <ContentCover
                theme={item.theme}
                title={item.title}
                badge="图文"
                className="aspect-video rounded-none"
                imageSrc={item.image}
              />
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2 text-xs text-[#78716C]">
                  <span className="rounded-full bg-[#F7EEEE] px-2 py-1 text-[#991B1B]">{item.tags}</span>
                  <span className="py-1">{item.difficulty}级阅读</span>
                </div>
                <h2 className="text-lg font-semibold leading-7">{item.title}</h2>
                <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                  {item.content}
                </p>
                <Link
                  href={`/content/${item.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]"
                >
                  阅读正文
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
