import Link from "next/link";
import { BookOpenCheck, Bookmark, CircleUserRound, PenLine } from "lucide-react";

import { ContentCover } from "@/components/ui/ContentCover";
import { latestContentFromCsv } from "@/data/content-adapters";

const stats = [
  { label: "学习时长", value: "32h" },
  { label: "收藏内容", value: "8" },
  { label: "提问次数", value: "15" },
  { label: "连续打卡", value: "6天" },
];

const actions = [
  { title: "继续刷题", desc: "从错题和中等难度题开始复盘", href: "/exam", icon: BookOpenCheck },
  { title: "查看收藏", desc: "回到最近保存的典籍、人物和制度笔记", href: "/mine", icon: Bookmark },
  { title: "发布提问", desc: "把没讲透的问题交给达人或 AI 继续拆解", href: "/question/new", icon: PenLine },
];

export default function ProfilePage() {
  const recent = latestContentFromCsv.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5">
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5efe1] text-[#991B1B]">
                  <CircleUserRound className="h-9 w-9" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">文脉探索者</h1>
                  <p className="mt-1 text-sm text-[#57534E]">文化初学者 · 偏好：唐宋史、名著导读、制度考点</p>
                </div>
              </div>
              <Link href="/mine" className="rounded-xl border border-[#e7e5e4] bg-white px-4 py-2 text-sm text-[#57534E] hover:text-[#1C1917]">
                查看完整个人中心
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-xl bg-[#faf7f5] px-4 py-3">
                  <p className="text-xs text-[#78716C]">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#991B1B]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              {actions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7] hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f1dd] text-[#7a5a00]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[#57534E]">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <section className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">最近推荐</h2>
                <Link href="/" className="text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                  回首页 →
                </Link>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {recent.map((item) => (
                  <Link key={item.id} href={item.url} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
                    <ContentCover theme={item.theme} title={item.title} badge={item.type} className="aspect-video" />
                    <h3 className="mt-3 text-sm font-semibold leading-6">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#57534E]">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
