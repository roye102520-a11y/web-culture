import Link from "next/link";
import { FlaskConical, MessageSquareText, Sparkles, WandSparkles } from "lucide-react";

const betaFeatures = [
  {
    title: "AI 历史讲解",
    desc: "输入题目、作答和标准答案关键词，生成知识点拆解、错因定位和复盘建议。",
    href: "/look/explain",
    icon: WandSparkles,
    status: "可体验",
  },
  {
    title: "DeepSeek 文史问答",
    desc: "围绕典籍、人物、制度和历史争议继续追问，适合做阅读前导学。",
    href: "/look/deepseek",
    icon: Sparkles,
    status: "可体验",
  },
  {
    title: "文化人排行榜",
    desc: "浏览达人贡献、粉丝和主页文章，发现更适合跟读的文史创作者。",
    href: "/ranking",
    icon: FlaskConical,
    status: "灰度中",
  },
];

const feedbackTypes = ["内容错误反馈", "AI 回答不准", "希望新增专题", "页面体验建议"];

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
              <p className="text-sm font-medium text-[#991B1B]">WenMai Lab</p>
              <h1 className="mt-1 text-2xl font-semibold md:text-3xl">公测专区</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#57534E]">
                新功能会先放在这里验证：能不能帮你更快看懂文史材料，能不能把考点、趣闻和出处讲清楚。
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {betaFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7] transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f1dd] text-[#7a5a00]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <h2 className="text-base font-semibold">{item.title}</h2>
                      <span className="shrink-0 rounded-full bg-[#f5f2ef] px-2 py-0.5 text-xs text-[#57534E]">{item.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#57534E]">{item.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-[#991B1B]" />
              <h2 className="text-base font-semibold">反馈入口</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#57534E]">
              公测阶段最有价值的是具体场景：哪道题、哪段解释、哪个入口让你卡住。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {feedbackTypes.map((item) => (
                <span key={item} className="rounded-full bg-[#faf7f5] px-3 py-1.5 text-sm text-[#57534E] ring-1 ring-[#efeae7]">
                  {item}
                </span>
              ))}
            </div>
            <Link href="/question/new" className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#991B1B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7F1D1D]">
              发布反馈 / 提问
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
