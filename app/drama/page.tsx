import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

const dramaItems = allContentRecords.filter((item) => item.category === "剧说古今");

const focusNotes = [
  "看剧情：把关键桥段放回真实制度和时代处境里理解。",
  "辨史实：标注正史、野史、改编和影视戏剧化处理的边界。",
  "补背景：用人物关系、官制、地理和礼俗补齐观看盲区。",
];

export default function DramaPage() {
  const featured = dramaItems[0];
  const rest = dramaItems.slice(1);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-[#991B1B]">影视历史考据专栏</p>
                <h1 className="mt-1 text-2xl font-semibold md:text-3xl">剧说古今</h1>
              </div>
              <Link href="/look/deepseek" className="text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                用 AI 追问剧情史实 →
              </Link>
            </div>

            {featured ? (
              <article className="grid gap-4 rounded-2xl bg-[#faf7f5] p-4 ring-1 ring-[#efeae7] md:grid-cols-[42%_1fr]">
                <ContentCover theme={featured.theme} title={featured.title} badge="主打" className="aspect-video md:aspect-[4/3]" />
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 text-xs text-[#57534E]">
                    <span className="rounded-full bg-white px-2 py-1 ring-1 ring-[#e7e5e4]">{featured.tags}</span>
                    <span className="rounded-full bg-white px-2 py-1 ring-1 ring-[#e7e5e4]">难度 {featured.difficulty}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold leading-8">{featured.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#57534E]">{featured.content}</p>
                  <Link href={`/content/${featured.id}`} className="mt-4 text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]">
                    查看完整解析 →
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              {rest.map((item) => (
                <article key={item.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
                  <ContentCover theme={item.theme} title={item.title} badge={item.contentTypeCN} className="aspect-video" />
                  <div className="px-1 pt-3">
                    <div className="flex flex-wrap gap-2 text-xs text-[#78716C]">
                      <span>{item.tags}</span>
                      <span>难度 {item.difficulty}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-6">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#57534E]">{item.content}</p>
                    <Link href={`/content/${item.id}`} className="mt-2 inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                      阅读考据 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
              <h2 className="text-base font-semibold">本栏怎么读</h2>
              <div className="mt-3 space-y-3">
                {focusNotes.map((note, index) => (
                  <p key={note} className="rounded-xl bg-[#faf7f5] px-3 py-3 text-sm leading-6 text-[#57534E]">
                    <span className="mr-2 font-semibold text-[#991B1B]">0{index + 1}</span>
                    {note}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-[#1C1917] p-5 text-white shadow-sm">
              <h2 className="text-base font-semibold">今日追剧问题</h2>
              <p className="mt-3 text-sm leading-7 text-white/75">
                一段影视情节究竟是“历史真实”，还是“叙事需要”？带着这个问题读完一篇，观看体验会立刻不一样。
              </p>
              <Link href="/question/new" className="mt-4 inline-block text-sm font-medium text-[#F8D36B]">
                发起提问 →
              </Link>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
