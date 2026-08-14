"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAIErrorMessage } from "@/lib/client-ai";
import { getContentLinkByTitle } from "@/data/content-adapters";

type Channel = "推荐" | "名著探幽" | "考点解析" | "史海八卦";

interface FeedItem {
  id: string;
  channel: Channel;
  title: string;
  summary: string;
  views: number;
  tag: string;
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

const channels: Channel[] = ["推荐", "名著探幽", "考点解析", "史海八卦"];

const feedItems: FeedItem[] = [
  {
    id: "f-1",
    channel: "推荐",
    title: "科举制度如何重塑唐宋社会流动",
    summary: "从门第到考试，梳理制度如何改变士人上升路径与地方治理结构。",
    views: 12580,
    tag: "科举",
  },
  {
    id: "f-2",
    channel: "名著探幽",
    title: "《红楼梦》中的家族秩序与情感伦理",
    summary: "以贾府人物关系为线索，理解清代礼法与个体情感之间的张力。",
    views: 9680,
    tag: "红楼梦",
  },
  {
    id: "f-3",
    channel: "考点解析",
    title: "安史之乱常考点：时间线与影响链路",
    summary: "提炼考试高频考点，包含事件起因、关键节点与文化后果。",
    views: 15420,
    tag: "唐代",
  },
  {
    id: "f-4",
    channel: "史海八卦",
    title: "为什么苏东坡总能在逆境中写出名篇",
    summary: "从政治经历与人格气质切入，看北宋文人的生存智慧。",
    views: 8420,
    tag: "苏轼",
  },
  {
    id: "f-5",
    channel: "推荐",
    title: "从《资治通鉴》看决策失误的历史代价",
    summary: "选取关键片段，理解“短期正确”与“长期后果”的治理悖论。",
    views: 7310,
    tag: "资治通鉴",
  },
];

function formatViews(views: number) {
  if (views >= 10000) return `${(views / 10000).toFixed(1)}w`;
  return `${views}`;
}

export default function ExplorePage() {
  const [activeChannel, setActiveChannel] = useState<Channel>("推荐");
  const [activeItem, setActiveItem] = useState<FeedItem | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const visibleItems = useMemo(() => {
    if (activeChannel === "推荐") return feedItems;
    return feedItems.filter((item) => item.channel === activeChannel);
  }, [activeChannel]);

  const openAsk = (item: FeedItem) => {
    setActiveItem(item);
    setChat([
      {
        id: `a-${item.id}`,
        role: "assistant",
        text: `我已准备好从“${item.title}”切入，帮你做结构化历史解析。你想先看时间线、人物关系，还是考点总结？`,
      },
    ]);
    setChatInput("");
    setChatError(null);
    setIsAnswering(false);
  };

  const sendMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isAnswering) return;

    const item = activeItem;
    const query = item
      ? `请围绕《${item.title}》回答：${trimmed}\n\n内容摘要：${item.summary}`
      : trimmed;

    setChat((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    setChatInput("");
    setChatError(null);
    setIsAnswering(true);

    try {
      const res = await fetch("/api/ai/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode: "free" }),
      });
      const data = (await res.json()) as AIRequestPayload;
      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }
      setChat((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, role: "assistant", text: data.result?.answer ?? "" },
      ]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "暂时不可用");
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl bg-white p-3 shadow-sm md:p-4">
            <div className="flex gap-1 overflow-x-auto md:flex-col md:gap-2">
              {channels.map((channel) => {
                const active = activeChannel === channel;
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setActiveChannel(channel)}
                    className={`relative shrink-0 rounded-lg px-3 py-2 text-left text-sm transition ${
                      active ? "font-semibold text-[#991B1B]" : "text-[#57534E] hover:text-[#1C1917]"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#991B1B] md:bottom-2 md:left-0 md:right-auto md:top-2 md:h-auto md:w-0.5" />
                    )}
                    <span className="relative z-10">{channel}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-4">
            {visibleItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#991B1B]/10 px-2.5 py-0.5 text-xs text-[#991B1B]">{item.tag}</span>
                    <span className="text-xs text-[#78716C]">{item.channel}</span>
                  </div>

                  <h2 className="text-xl font-semibold leading-8 text-[#1C1917]">{item.title}</h2>
                  <p className="text-sm leading-7 text-[#57534E]">{item.summary}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-[#78716C]">阅读量 {formatViews(item.views)}</span>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={getContentLinkByTitle(item.title)}
                        className="inline-flex h-9 items-center rounded-lg border border-[#e7e5e4] bg-white px-3 text-sm text-[#57534E] hover:text-[#1C1917]"
                      >
                        阅读文章 →
                      </Link>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[#991B1B]/20 bg-[#991B1B]/5 text-[#991B1B] hover:bg-[#991B1B]/10"
                          onClick={() => openAsk(item)}
                        >
                          ✨ 问问 DeepSeek
                        </Button>
                      </SheetTrigger>

                      <SheetContent
                        side={isMobile ? "bottom" : "right"}
                        className={isMobile ? "h-[72vh] rounded-t-2xl" : "w-full sm:max-w-lg"}
                      >
                        <SheetHeader>
                          <SheetTitle>AI 深度解析</SheetTitle>
                          <SheetDescription>
                            正在向 DeepSeek 提问关于《{activeItem?.title ?? item.title}》的内容...
                          </SheetDescription>
                        </SheetHeader>

                        <div className="mt-4 flex h-[calc(100%-5.5rem)] flex-col">
                          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-stone-50 p-3">
                            {chat.map((message) => (
                              <div
                                key={message.id}
                                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-6 ${
                                  message.role === "assistant"
                                    ? "bg-white text-[#57534E]"
                                    : "ml-auto bg-[#991B1B] text-white"
                                }`}
                              >
                                {message.text}
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 flex gap-2">
                            <Input
                              value={chatInput}
                              onChange={(event) => setChatInput(event.target.value)}
                              placeholder="输入你想继续追问的问题..."
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void sendMessage();
                                }
                              }}
                            />
                            <Button onClick={() => void sendMessage()} disabled={isAnswering} className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">
                              {isAnswering ? "生成中" : "发送"}
                            </Button>
                          </div>
                          {chatError ? <p className="mt-2 text-sm text-red-700">{chatError}</p> : null}
                        </div>
                      </SheetContent>
                    </Sheet>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
