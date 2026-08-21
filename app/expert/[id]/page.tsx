import { BookOpen, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

const experts = [
  { id: "e-01", name: "李明", role: "城市史讲解人", focus: "唐宋城市与日常生活", intro: "从街道、市场和普通人的衣食住行进入制度史，让古代城市不再只是地图上的名字。" },
  { id: "e-02", name: "王芳", role: "典籍领读人", focus: "《史记》与古典叙事", intro: "擅长把古书里的称谓、人物关系和叙事次序讲清楚，保留原文质感，也照顾第一次阅读的人。" },
  { id: "e-03", name: "Dr.Chen", role: "跨文化研究者", focus: "中国文化英文解释", intro: "关注中国概念进入英语语境时容易发生的误读，为海外学习者补充必要的历史背景。" },
  { id: "e-04", name: "赵雷", role: "制度史作者", focus: "科举、官僚与地方治理", intro: "把制度放回官员、读书人和普通家庭的选择里，解释规则如何改变一个人的生活路径。" },
  { id: "e-05", name: "钱玄", role: "思想史作者", focus: "宋明理学与士人生活", intro: "不把思想史只讲成概念，重视读书、做官、交友和自我安顿之间的现实联系。" },
  { id: "e-06", name: "孙月", role: "文学讲解人", focus: "唐宋诗人与日常情绪", intro: "从旅途、酒席、仕途和友谊讲诗人，让作品回到真实的人生压力之中。" },
  { id: "e-07", name: "周宁", role: "影视历史顾问", focus: "古装剧与史实对读", intro: "区分影视效果、历史背景和制度实况，既保留观看乐趣，也避免把剧情当成史书。" },
  { id: "e-08", name: "吴清", role: "名著领读人", focus: "明清小说与社会生活", intro: "从空间、家族、钱财与人情理解名著人物，减少空泛的性格标签和标准答案。" },
  { id: "e-09", name: "郑嘉", role: "简牍研究者", focus: "秦汉基层文书", intro: "通过简牍、县廷档案和日常行政记录，观察帝国制度怎样真正落到地方。" },
  { id: "e-10", name: "林岳", role: "地方文化作者", focus: "地方志与城市记忆", intro: "把港口、交通、物产和人物网络串联起来，理解一座城市长期形成的性格。" },
] as const;

export function generateStaticParams() {
  return experts.map((expert) => ({ id: expert.id }));
}

export default async function ExpertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expert = experts.find((item) => item.id === id);
  if (!expert) notFound();

  const start = experts.findIndex((item) => item.id === id) * 3;
  const recommendations = Array.from({ length: 3 }, (_, index) => allContentRecords[(start + index) % allContentRecords.length]);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
        <header className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#ebe6e2] md:p-8">
          <p className="text-xs font-medium text-[#991B1B]">WENMAI CONTRIBUTOR</p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8E5] text-2xl font-semibold text-[#991B1B]">
              {expert.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold">{expert.name}</h1>
              <p className="mt-1 text-sm text-[#78716C]">{expert.role} · {expert.focus}</p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#57534E]">{expert.intro}</p>
            </div>
            <div className="flex gap-4 text-sm text-[#57534E]">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" /> 3 篇推荐</span>
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> 文脉作者</span>
            </div>
          </div>
        </header>

        <section className="mt-7">
          <h2 className="text-xl font-semibold">推荐阅读</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl bg-white ring-1 ring-[#ebe6e2]">
                <ContentCover theme={item.theme} title={item.title} badge={item.category} className="aspect-video rounded-none" imageSrc={item.image} />
                <div className="space-y-3 p-4">
                  <h3 className="font-semibold leading-6">{item.title}</h3>
                  <Link href={`/content/${item.id}`} className="text-sm font-medium text-[#991B1B] hover:text-[#7F1D1D]">阅读正文 →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
