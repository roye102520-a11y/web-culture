import Image from "next/image";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { allContentRecords } from "@/data/content-adapters";

interface Props {
  params: Promise<{ id: string }>;
}

const experts = [
  { id: "e-01", name: "李明", title: "文化点达人", focus: "唐宋制度史 / 科举考点", points: 9820, fans: 12890, articles: 126 },
  { id: "e-02", name: "王芳", title: "文化点达人", focus: "古典小说 / 女性人物", points: 9560, fans: 11420, articles: 103 },
  { id: "e-03", name: "Dr.Chen", title: "文化点达人", focus: "史学方法 / 文献辨析", points: 9320, fans: 10980, articles: 97 },
  { id: "e-04", name: "赵雷", title: "文化研究者", focus: "明清政治 / 影视考据", points: 9010, fans: 9840, articles: 88 },
  { id: "e-05", name: "钱玄", title: "文化研究者", focus: "先秦两汉 / 典籍源流", points: 8890, fans: 9250, articles: 79 },
  { id: "e-06", name: "孙月", title: "文化讲解官", focus: "诗词赏析 / 日常生活史", points: 8620, fans: 8520, articles: 72 },
  { id: "e-07", name: "周宁", title: "文化讲解官", focus: "地方志 / 城市记忆", points: 8430, fans: 8010, articles: 68 },
  { id: "e-08", name: "吴清", title: "文化点达人", focus: "红楼梦 / 叙事结构", points: 8210, fans: 7690, articles: 61 },
  { id: "e-09", name: "郑嘉", title: "文化研究者", focus: "军事史 / 三国人物", points: 8030, fans: 7350, articles: 56 },
  { id: "e-10", name: "林岳", title: "文化讲解官", focus: "成语典故 / 考试复盘", points: 7860, fans: 7020, articles: 51 },
];

function formatNum(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  return `${value}`;
}

function getDiceBearAvatar(name: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
}

export default async function ExpertPage({ params }: Props) {
  const { id } = await params;
  const expert = experts.find((item) => item.id === id) ?? experts[0];
  const picks = allContentRecords.slice(0, 4).map((item, index) => allContentRecords[(index * 5 + expert.id.length) % allContentRecords.length] ?? item);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="h-fit rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] lg:sticky lg:top-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-[#f3f0ed] ring-1 ring-[#e8e2dd]">
                <Image src={getDiceBearAvatar(expert.name)} alt={`${expert.name} avatar`} fill unoptimized className="object-cover" sizes="64px" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{expert.name}</h1>
                <p className="mt-1 text-sm text-[#991B1B]">{expert.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#57534E]">
              关注方向：{expert.focus}。擅长把复杂文献问题拆成可追问、可复盘的阅读路径。
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[#faf7f5] px-2 py-3">
                <p className="text-xs text-[#78716C]">文化点</p>
                <p className="mt-1 text-base font-semibold text-[#991B1B]">{expert.points}</p>
              </div>
              <div className="rounded-xl bg-[#faf7f5] px-2 py-3">
                <p className="text-xs text-[#78716C]">粉丝</p>
                <p className="mt-1 text-base font-semibold text-[#991B1B]">{formatNum(expert.fans)}</p>
              </div>
              <div className="rounded-xl bg-[#faf7f5] px-2 py-3">
                <p className="text-xs text-[#78716C]">文章</p>
                <p className="mt-1 text-base font-semibold text-[#991B1B]">{expert.articles}</p>
              </div>
            </div>
            <Link href="/question/new" className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#991B1B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7F1D1D]">
              向达人提问
            </Link>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
              <h2 className="text-lg font-semibold">主页精选</h2>
              <p className="mt-2 text-sm leading-6 text-[#57534E]">根据达人方向推荐的公开内容，适合先读一篇再提更具体的问题。</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {picks.map((item) => (
                <Link key={item.id} href={`/content/${item.id}`} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9] hover:shadow-md">
                  <ContentCover theme={item.theme} title={item.title} badge={item.category} className="aspect-video" />
                  <div className="px-1 pt-3">
                    <div className="flex flex-wrap gap-2 text-xs text-[#78716C]">
                      <span>{item.contentTypeCN}</span>
                      <span>{item.tags}</span>
                      <span>难度 {item.difficulty}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-6">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#57534E]">{item.content}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
