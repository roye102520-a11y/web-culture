"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ContentCover, type ContentCoverTheme } from "@/components/ui/ContentCover";
import { CLASSICS_CONTENT } from "@/data/verified-links";
import { EXTERNAL_LINK_PROPS } from "@/lib/external-links";

type ClassicBook = "红楼梦" | "三国演义" | "水浒传" | "西游记";
type FeedType = "视频" | "播客" | "长文";

const books: ClassicBook[] = ["红楼梦", "三国演义", "水浒传", "西游记"];

const typeStyle: Record<FeedType, string> = { 视频: "bg-red-50 text-red-700", 播客: "bg-amber-50 text-amber-700", 长文: "bg-stone-100 text-stone-700" };
const bookCoverImages: Record<ClassicBook, string> = {
  红楼梦: "/images/covers/imperial-court-military.png",
  三国演义: "/images/covers/tang-anshi-war.png",
  水浒传: "/images/covers/yuan-military-routes.png",
  西游记: "/images/covers/ming-14-wang-yangming.png",
};

export default function ClassicsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBook = (searchParams.get("book") as ClassicBook) || "红楼梦";
  const activeBook = books.includes(currentBook) ? currentBook : "红楼梦";

  const bookData = CLASSICS_CONTENT[activeBook];
  const feed = useMemo(
    () =>
      (bookData.items as Array<{ id: string; type: FeedType; title: string; desc?: string; url: string; theme: ContentCoverTheme }>).map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        summary: item.desc ?? "",
        url: item.url,
        theme: item.theme,
      })),
    [bookData],
  );

  const switchBook = (book: ClassicBook) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("book", book);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {books.map((book) => (
              <button
                key={book}
                type="button"
                onClick={() => switchBook(book)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeBook === book
                    ? "bg-[#991B1B] text-white"
                    : "bg-white text-[#57534E] ring-1 ring-[#e7e5e4] hover:text-[#1C1917]"
                }`}
              >
                {book}
              </button>
            ))}
          </div>

          <article className="grid gap-4 rounded-2xl bg-[#faf7f5] p-4 ring-1 ring-[#efeae7] md:grid-cols-[220px_1fr]">
            <div className="relative overflow-hidden rounded-xl">
              <ContentCover
                theme={bookData.theme}
                title={activeBook}
                badge="名著"
                className="aspect-[3/4]"
                imageSrc={bookCoverImages[activeBook]}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{activeBook}</h1>
              <p className="pt-1 text-sm leading-7 text-[#57534E]">{bookData.intro}</p>
            </div>
          </article>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">相关内容</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {feed.map((item) => (
                <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#f0ece9]">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${typeStyle[item.type]}`}>{item.type}</span>
                  <h3 className="mt-2 text-base font-semibold leading-6 text-[#1C1917]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#57534E]">{item.summary}</p>
                  <a href={item.url} {...EXTERNAL_LINK_PROPS} className="mt-2 inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                    播放 / 查看详情 →
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-[#f8f4f2] px-4 py-4">
            <p className="text-sm text-[#57534E]">经典情节快速问答入口</p>
            <Link
              href={`/look/deepseek?q=${encodeURIComponent(`请解析《${activeBook}》中最关键的三段情节及其历史文化意义`)}`}
              className="mt-2 inline-block text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]"
            >
              前往 DeepSeek 提问 →
            </Link>
          </section>
        </section>
      </main>
    </div>
  );
}
