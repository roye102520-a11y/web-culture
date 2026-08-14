import Link from "next/link";

import { allContentRecords, type ContentRecord } from "@/data/content-adapters";

const preferredGroups = ["首页内容", "典籍探疑", "红楼梦", "三国演义", "水浒传", "西游记", "剧说古今", "八卦来了", "分类浏览"];

function groupedContent() {
  const groups = new Map<string, ContentRecord[]>();
  for (const item of allContentRecords) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }

  return Array.from(groups.entries()).sort(([a], [b]) => {
    const ai = preferredGroups.indexOf(a);
    const bi = preferredGroups.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "zh-CN");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default function ContentReviewPage() {
  const groups = groupedContent();

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-4 py-8 text-[#1C1917] md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f0ece9]">
          <p className="text-sm font-semibold text-[#991B1B]">文脉测试索引</p>
          <h1 className="mt-2 text-2xl font-black md:text-3xl">当前内容链接检查表</h1>
          <p className="mt-3 text-sm leading-7 text-[#57534E]">
            这里集中列出当前内容库中的全部文章、视频和播客入口。用于检查每个链接是否能打开、正文是否有内容、外部链接入口是否可继续跳转。
          </p>
          <div className="mt-3 text-sm text-[#78716C]">共 {allContentRecords.length} 条内容</div>
        </header>

        <div className="space-y-5">
          {groups.map(([category, items]) => (
            <section key={category} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f0ece9]">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-lg font-bold">{category}</h2>
                <span className="text-sm text-[#78716C]">{items.length} 条</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/content/${item.id}`}
                    className="rounded-xl border border-[#ece7e1] bg-[#fffdf8] p-4 transition hover:border-[#991B1B] hover:bg-[#fff8f6]"
                  >
                    <div className="flex flex-wrap gap-2 text-xs text-[#78716C]">
                      <span>{item.contentTypeCN}</span>
                      <span>难度：{item.difficulty}</span>
                      <span>ID：{item.id}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold leading-6 text-[#1C1917]">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#57534E]">{item.content}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
