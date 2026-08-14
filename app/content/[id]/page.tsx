import { notFound } from "next/navigation";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { getContentById } from "@/data/content-adapters";
import { getContentBodyByTitle } from "@/data/content-bodies";

interface Props {
  params: Promise<{ id: string }>;
}

function buildArticleBody(content: NonNullable<ReturnType<typeof getContentById>>) {
  const categoryGuide =
    content.category === "剧说古今"
      ? "这类内容适合把影视叙事和历史材料分开看：作品负责制造人物弧光和情绪张力，历史材料则帮助我们判断哪些是时代背景，哪些是戏剧改写。"
      : content.category === "八卦来了"
        ? "趣闻并不等于随口一说。越是流传广的说法，越需要回到人物处境、材料来源和后世想象里辨认，才不会只停留在猎奇结论。"
        : content.category === "典籍探疑"
          ? "典籍类问题的重点不是抢一个唯一答案，而是把原文、注疏、后人解释和暂时不能断定的部分分层放好。"
          : ["红楼梦", "三国演义", "水浒传", "西游记"].includes(content.category)
            ? `读《${content.category}》不能只看情节热闹，还要把人物放回作品里的社会秩序、关系压力和价值冲突中。`
            : "历史内容不宜只背结论。更好的读法，是把事件放进制度、地理、财政、社会关系和人物处境里，看它为什么发生，又怎样影响后来的人。";

  return [
    content.content,
    `围绕“${content.title}”，可以先抓住标题中的关键词：${content.tags}。这些词提示我们，这篇内容不是孤立知识点，而是一个可以继续展开的历史与文化入口。`,
    categoryGuide,
    "读这篇内容时，可以先看主线：人物或事件处在什么局面里；再看矛盾：他们真正被什么制度、关系或时代压力推着走；最后看余波：这些选择为什么会被后人反复讲述。",
    "所以这个链接打开后，重点不是给出一句标准答案，而是帮助你形成可以继续追问的正文线索。后续如果要扩写成正式长文，也可以继续补充史料来源、人物细节、争议观点和延伸阅读。",
  ].filter(Boolean);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const content = getContentById(id);

  if (!content) {
    notFound();
  }

  const articleBody = getContentBodyByTitle(content.title) ?? buildArticleBody(content);

  return (
    <div className="min-h-screen bg-[#F5F5F4]">
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-[#efeae7]">
          <ContentCover theme={content.theme} title={content.title} badge={content.contentTypeCN} className="aspect-[16/7]" />
          <h1 className="text-2xl font-semibold text-[#1C1917]">{content.title}</h1>
          <div className="text-xs text-[#78716C]">
            分类：{content.category} · 标签：{content.tags} · 难度：{content.difficulty} · 来源：{content.source}
          </div>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#1C1917]">正文导读</h2>
            {articleBody.map((paragraph, index) => (
              <p key={`${content.id}-paragraph-${index}`} className="text-sm leading-7 text-[#57534E]">
                {paragraph}
              </p>
            ))}
          </section>
          <Link href="/" className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
            返回首页 →
          </Link>
        </div>
      </main>
    </div>
  );
}
