"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { ContentCover, type ContentCoverTheme } from "@/components/ui/ContentCover";
import { getContentLinkByTitle } from "@/data/content-adapters";
import { EXTERNAL_LINK_PROPS, getContentExternalUrl } from "@/lib/external-links";

type FeedType = "视频" | "播客" | "长文";
type FeedTab = "全部" | "知识类" | "播客" | "长文";

type FeedItem = {
  id: string;
  title: string;
  summary: string;
  type: FeedType;
  likes: number;
  favorites: number;
  comments: number;
  coverImage: string;
  videoSrc?: string;
  linkUrl?: string;
};

const tabs: FeedTab[] = ["全部", "知识类", "播客", "长文"];
const feedTheme: Record<FeedType, ContentCoverTheme> = {
  视频: "drama",
  播客: "tea",
  长文: "scroll",
};

const feedData: FeedItem[] = [
  { id: "ff-1", title: "廉贞虎传导读：边地治理与军政平衡", summary: "梳理传记中的关键情节，理解边地行政、军事与民生之间的动态平衡。", type: "视频", likes: 126, favorites: 63, comments: 19, coverImage: "/images/placeholders/ink-landscape.svg", videoSrc: "/videos/lianzhenhu-guide.mov", linkUrl: "/videos/lianzhenhu-guide.mov" },
  { id: "ff-2", title: "孛亲丑传中的族群叙事如何演变", summary: "从不同版本文献对读，观察人物形象在历史书写中的变形路径。", type: "长文", likes: 94, favorites: 58, comments: 14, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-3", title: "天津传播客：港埠文化与商贸网络", summary: "从漕运、盐政与近代通商口岸切入，连接城市记忆与经济结构。", type: "播客", likes: 153, favorites: 71, comments: 21, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-4", title: "地方志里的人物志该怎么读", summary: "提供一个高效阅读方法，帮助快速找到人物条目中的史料价值。", type: "视频", likes: 88, favorites: 45, comments: 12, coverImage: "/images/placeholders/ink-landscape.svg", videoSrc: "/videos/difangzhi.mov", linkUrl: "/videos/difangzhi.mov" },
  { id: "ff-5", title: "《竹书纪年》争议条目逐条辨析", summary: "聚焦商周纪年争议，拆解不同史书采用的证据链和推理方式。", type: "长文", likes: 211, favorites: 109, comments: 37, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-6", title: "里耶秦简与县治建构：一线史料观察", summary: "回到简牍文字本身，理解县级治理术语与制度实践的关系。", type: "视频", likes: 132, favorites: 66, comments: 20, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-7", title: "诗经系年问题：谁在什么时候说了什么", summary: "用语料先后关系重排《诗经》片段，构建更清晰的时间框架。", type: "播客", likes: 117, favorites: 62, comments: 16, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-8", title: "《四书集注》与阳明后学争论面面观", summary: "聚焦关键注释差异，帮助理解宋明理学内部的学术分歧。", type: "长文", likes: 140, favorites: 83, comments: 23, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-9", title: "河间府志中的士人网络结构图", summary: "从人物互引和科举同榜关系，重建区域知识共同体形态。", type: "视频", likes: 76, favorites: 38, comments: 9, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-10", title: "永平府志里的边防与交通线索", summary: "将地理节点和军事部署叠加阅读，看到北方防线运行逻辑。", type: "播客", likes: 89, favorites: 47, comments: 11, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-11", title: "蓟州传：关口叙事的历史记忆形成", summary: "解释关口地带为何成为地方史中高频出现的叙事中心。", type: "长文", likes: 102, favorites: 54, comments: 15, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-12", title: "从《汉书·艺文志》看知识分类体系", summary: "讨论目录学分野如何影响后世对典籍价值的判断。", type: "视频", likes: 128, favorites: 67, comments: 18, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-13", title: "宋代新词汇如何进入民间日常", summary: "分析文人语汇与市井语言交互，观察词义扩散过程。", type: "播客", likes: 97, favorites: 52, comments: 13, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-14", title: "明清话本中的历史知识普及策略", summary: "话本如何在娱乐叙事中嵌入可记忆的历史知识单元。", type: "长文", likes: 165, favorites: 89, comments: 27, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-15", title: "史记与通鉴的叙事节奏差异导读", summary: "同一事件在不同史书中的节奏组织，如何影响读者理解。", type: "视频", likes: 156, favorites: 80, comments: 24, coverImage: "/images/placeholders/ink-landscape.svg" },
  { id: "ff-16", title: "文史播客：地方志中的城市气质形成", summary: "用声音化讲述串联地方志里的空间记忆与社会情感。", type: "播客", likes: 111, favorites: 59, comments: 17, coverImage: "/images/placeholders/ink-landscape.svg" },
];

const typeBadge: Record<FeedType, string> = {
  视频: "bg-red-50 text-red-700",
  播客: "bg-amber-50 text-amber-700",
  长文: "bg-stone-100 text-stone-700",
};

const PAGE_SIZE = 8;

export function FeaturedFeedSection() {
  const [activeTab, setActiveTab] = useState<FeedTab>("全部");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const filtered = useMemo(() => {
    if (activeTab === "全部") return feedData;
    if (activeTab === "知识类") return feedData.filter((item) => item.type === "视频");
    return feedData.filter((item) => item.type === activeTab);
  }, [activeTab]);

  const visibleItems = filtered.slice(0, visibleCount);

  const onTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  };

  const askGuide = async (item: FeedItem) => {
    setLoadingMap((prev) => ({ ...prev, [item.id]: true }));
    setErrorMap((prev) => ({ ...prev, [item.id]: null }));

    try {
      const res = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: item.title, mode: 'video_guide' }),
      });
      const data = (await res.json()) as { ok: boolean; result?: { answer?: string; error?: string } };

      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(data.result?.error || 'request_failed');
      }

      setAnswers((prev) => ({ ...prev, [item.id]: data.result?.answer ?? '' }));
    } catch {
      setErrorMap((prev) => ({ ...prev, [item.id]: '导读生成失败，请稍后重试。' }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <section id="section-featured-feed" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">看看精选</h2>
        <Link href="/look/explain" className="text-sm text-[#57534E] hover:text-[#991B1B]">
          AI历史讲解 →
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              activeTab === tab
                ? 'bg-[#991B1B] text-white'
                : 'bg-white text-[#57534E] ring-1 ring-[#e7e5e4] hover:text-[#1C1917]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative md:w-[40%]">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f3efeb]">
                  <ContentCover
                    theme={feedTheme[item.type]}
                    title={item.title}
                    badge={item.type}
                    className="h-full w-full"
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 px-1">
                <div className="space-y-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${typeBadge[item.type]}`}>{item.type}</span>
                  <h3 className="text-base font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {item.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C]">
                    <span>👍 {item.likes}</span>
                    <span>🔖 {item.favorites}</span>
                    <span>💬 {item.comments}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={getContentLinkByTitle(item.title)}
                      className="inline-flex h-8 items-center rounded-md border border-[#e7e5e4] bg-white px-3 text-sm text-[#57534E] hover:text-[#1C1917]"
                    >
                      阅读文章
                    </Link>
                    <Button
                      size="sm"
                      className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                      onClick={() => void askGuide(item)}
                      disabled={loadingMap[item.id]}
                    >
                      DeepSeek导读
                    </Button>
                    <a
                      href={item.linkUrl ?? getContentExternalUrl(item.type, item.title)}
                      {...EXTERNAL_LINK_PROPS}
                      className="inline-flex items-center text-sm text-[#57534E] hover:text-[#991B1B]"
                    >
                      外部素材 →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {loadingMap[item.id] && (
              <div className="mt-3 rounded-lg bg-[#f8f4f2] px-3 py-2 text-sm text-[#991B1B] animate-pulse">
                正在生成导读内容...
              </div>
            )}

            {errorMap[item.id] && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMap[item.id]}</div>
            )}

            {answers[item.id] && !loadingMap[item.id] && (
              <div className="prose prose-sm mt-3 max-w-none rounded-lg bg-stone-50 px-3 py-3 text-[#57534E] prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
                <ReactMarkdown>{answers[item.id]}</ReactMarkdown>
              </div>
            )}
          </article>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
            加载更多
          </Button>
        </div>
      )}
    </section>
  );
}
