import { Search } from "lucide-react";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

type Props = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function normalizeQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value ?? "").trim().toLocaleLowerCase("zh-CN");
}

export default async function SearchPage({ searchParams }: Props) {
  const query = normalizeQuery((await searchParams).q);
  const results = query
    ? allContentRecords.filter((item) =>
        [item.title, item.content, item.category, item.tags, item.source].some((value) =>
          value.toLocaleLowerCase("zh-CN").includes(query),
        ),
      )
    : allContentRecords.slice(0, 9);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        <section>
          <p className="text-xs font-medium text-[#991B1B]">SEARCH WENMAI</p>
          <h1 className="mt-2 text-3xl font-semibold">搜索文脉内容</h1>
          <form action="/search" className="relative mt-5 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78716C]" />
            <input
              name="q"
              defaultValue={query}
              placeholder="搜索人物、朝代、典籍、影视作品"
              className="h-12 w-full rounded-lg bg-white pl-12 pr-28 text-sm outline-none ring-1 ring-[#e7e1dc] focus:ring-[#991B1B]"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 h-9 rounded-md bg-[#991B1B] px-4 text-sm font-medium text-white hover:bg-[#7F1D1D]">
              搜索
            </button>
          </form>
          <p className="mt-3 text-sm text-[#57534E]">
            {query ? `“${query}”共找到 ${results.length} 篇内容` : "先为你推荐 9 篇内容，也可以输入关键词继续查找。"}
          </p>
        </section>

        {results.length > 0 ? (
          <section className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#ebe6e2]">
                <ContentCover theme={item.theme} title={item.title} badge={item.category} className="aspect-video rounded-none" imageSrc={item.image} />
                <div className="space-y-3 p-4">
                  <h2 className="text-base font-semibold leading-6">{item.title}</h2>
                  <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {item.content}
                  </p>
                  <Link href={`/content/${item.id}`} className="text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]">
                    阅读正文 →
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="mt-7 rounded-xl bg-white px-5 py-10 text-center ring-1 ring-[#ebe6e2]">
            <p className="font-medium">暂时没有找到完全匹配的内容</p>
            <p className="mt-2 text-sm text-[#78716C]">可以尝试人物名、朝代名或作品名，例如“李白”“唐朝”“红楼梦”。</p>
          </div>
        )}
      </main>
    </div>
  );
}
