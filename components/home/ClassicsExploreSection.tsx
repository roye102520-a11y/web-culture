"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { getAIErrorMessage } from "@/lib/client-ai";

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

type QuestionItem = {
  id: string;
  title: string;
  source: string;
};

const questions: QuestionItem[] = [
  {
    id: "cq-1",
    title: "《竹书纪年》与《史记》关于商系谱差异，应以哪本为准？",
    source: "竹书纪年",
  },
  {
    id: "cq-2",
    title: "里耶秦简“迁陵县”的文字写法，与汉地统治关系如何解读？",
    source: "里耶秦简",
  },
  {
    id: "cq-3",
    title: "《诗经》之“相如”于何时、何人语料最早可系年？",
    source: "诗经",
  },
  {
    id: "cq-4",
    title: "《四书集注》中与阳明后学批判朱子的对比核心是什么？",
    source: "四书集注",
  },
  {
    id: "cq-5",
    title: "《资治通鉴》与《通鉴纪事本末》在叙事目的上有何不同？",
    source: "资治通鉴",
  },
  {
    id: "cq-6",
    title: "《汉书·艺文志》为何成为后世目录学分流的关键节点？",
    source: "汉书",
  },
];

export function ClassicsExploreSection() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const hotQuestions = useMemo(() => questions.slice(0, 5), []);

  const runQuickAnswer = async (item: QuestionItem) => {
    setLoadingMap((prev) => ({ ...prev, [item.id]: true }));
    setErrorMap((prev) => ({ ...prev, [item.id]: null }));

    try {
      const res = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: item.title, mode: 'community_q' }),
      });
      const data = (await res.json()) as AIRequestPayload;

      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }

      setAnswers((prev) => ({ ...prev, [item.id]: data.result?.answer ?? '' }));
    } catch (e) {
      setErrorMap((prev) => ({ ...prev, [item.id]: e instanceof Error ? e.message : "暂时不可用" }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <section id="section-classics-ai" className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1C1917] md:text-xl">典籍探疑・AI替查</h2>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {questions.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#f0ece9]">
              <p className="text-sm font-medium leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                {item.title}
              </p>
              <div className="mt-2 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs text-[#57534E]">
                {item.source}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white text-[#57534E]">精读 →</Button>
                <Button
                  size="sm"
                  className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                  onClick={() => void runQuickAnswer(item)}
                  disabled={loadingMap[item.id]}
                >
                  DeepSeek快答 →
                </Button>
              </div>

              {loadingMap[item.id] && (
                <div className="mt-3 rounded-lg bg-[#f8f4f2] px-3 py-2 text-sm text-[#991B1B] animate-pulse">
                  DeepSeek 正在检索典籍并生成回答...
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

        <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#f0ece9]">
          <h3 className="text-base font-semibold text-[#1C1917]">🔥 热门问题</h3>
          <div className="mt-3 space-y-2">
            {hotQuestions.map((item) => (
              <div key={`hot-${item.id}`} className="rounded-lg bg-[#faf8f6] px-3 py-2">
                <p className="text-sm text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                  {item.title}
                </p>
                <button
                  type="button"
                  className="mt-1 text-xs text-[#991B1B] hover:text-[#7F1D1D]"
                  onClick={() => void runQuickAnswer(item)}
                >
                  DeepSeek快答 →
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
