import { notFound } from "next/navigation";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { getContentById } from "@/data/content-adapters";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const content = getContentById(id);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4]">
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-[#efeae7]">
          <ContentCover theme={content.theme} title={content.title} badge={content.contentTypeCN} className="aspect-[16/7]" />
          <h1 className="text-2xl font-semibold text-[#1C1917]">{content.title}</h1>
          <div className="text-xs text-[#78716C]">
            分类：{content.category} · 标签：{content.tags} · 难度：{content.difficulty} · 来源：{content.source}
          </div>
          <p className="text-sm leading-7 text-[#57534E]">{content.content}</p>
          <Link href="/" className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
            返回首页 →
          </Link>
        </div>
      </main>
    </div>
  );
}
