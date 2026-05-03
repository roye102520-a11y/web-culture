"use client";

import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { examQuestionsFromCsv } from "@/data/content-adapters";
import { getAIErrorMessage } from "@/lib/client-ai";

type Dynasty = "全部" | "唐" | "宋" | "元" | "明" | "清";
type Difficulty = "简单" | "中等" | "困难";

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

type Question = {
  id: string;
  dynasty: Exclude<Dynasty, "全部">;
  difficulty: Difficulty;
  text: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct: "A" | "B" | "C" | "D";
  analysis: string;
};

const dynastyOptions: Dynasty[] = ["全部", "唐", "宋", "元", "明", "清"];
const difficultyOptions: Difficulty[] = ["简单", "中等", "困难"];

const questions: Question[] = examQuestionsFromCsv;

export default function ExamPage() {
  const [dynasty, setDynasty] = useState<Dynasty>("全部");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [openAnalysis, setOpenAnalysis] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string | null>>({});
  const [aiExplain, setAiExplain] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      questions.filter((q) => (dynasty === "全部" || q.dynasty === dynasty) && (!difficulty || q.difficulty === difficulty)),
    [dynasty, difficulty],
  );

  const doneCount = useMemo(
    () => filtered.filter((q) => answers[q.id] !== undefined).length,
    [filtered, answers],
  );

  const askAi = async (q: Question) => {
    const selected = answers[q.id];
    const selectedText = selected
      ? q.options.find((op) => op.key === selected)?.text ?? ""
      : "未作答";

    setAiLoading((prev) => ({ ...prev, [q.id]: true }));
    setAiError((prev) => ({ ...prev, [q.id]: null }));

    try {
      const query = `题目：${q.text}
选项：${q.options.map((op) => `${op.key}.${op.text}`).join("；")}
我的答案：${selected} ${selectedText}
正确答案：${q.correct}`;
      const res = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode: 'mcq' }),
      });
      const data = (await res.json()) as AIRequestPayload;
      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }
      setAiExplain((prev) => ({ ...prev, [q.id]: data.result?.answer ?? '' }));
    } catch (e) {
      setAiError((prev) => ({ ...prev, [q.id]: e instanceof Error ? e.message : '暂时不可用' }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efeae7]">
              <h1 className="text-2xl font-semibold">考试专区</h1>
              <p className="mt-1 text-sm text-[#57534E]">时间线 × 难题 × 刷题</p>
            </section>

            <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-[#78716C]">朝代筛选</p>
                <div className="flex flex-wrap gap-2">
                  {dynastyOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDynasty(item)}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        dynasty === item ? 'bg-[#991B1B] text-white' : 'bg-white text-[#57534E] ring-1 ring-[#e7e5e4]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-[#78716C]">难度筛选</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDifficulty(null)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      difficulty === null ? 'bg-[#991B1B] text-white' : 'bg-white text-[#57534E] ring-1 ring-[#e7e5e4]'
                    }`}
                  >
                    全部
                  </button>
                  {difficultyOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDifficulty(item)}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        difficulty === item ? 'bg-[#991B1B] text-white' : 'bg-white text-[#57534E] ring-1 ring-[#e7e5e4]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              {filtered.map((q, idx) => (
                <article id={`exam-${q.id}`} key={q.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-7 text-[#1C1917]">
                      {idx + 1}. {q.text}
                    </p>
                    <span className="shrink-0 rounded-full bg-[#f5f2ef] px-2 py-0.5 text-xs text-[#57534E]">
                      {q.dynasty} · {q.difficulty}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((op) => {
                      const selected = answers[q.id] === op.key;
                      return (
                        <button
                          key={op.key}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: op.key }))}
                          className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                            selected
                              ? 'bg-[#991B1B]/12 text-[#7F1D1D] ring-1 ring-[#991B1B]/30'
                              : 'bg-[#faf9f8] text-[#57534E] ring-1 ring-[#ece9e6]'
                          }`}
                        >
                          {op.key}. {op.text}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-[#57534E]"
                      onClick={() => setOpenAnalysis((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                    >
                      查看解析
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                      onClick={() => void askAi(q)}
                      disabled={aiLoading[q.id]}
                    >
                      AI帮我讲解
                    </Button>
                  </div>

                  {openAnalysis[q.id] && (
                    <div className="mt-3 rounded-lg bg-stone-50 px-3 py-3 text-sm leading-6 text-[#57534E]">
                      {q.analysis}
                    </div>
                  )}

                  {aiLoading[q.id] && (
                    <div className="mt-3 rounded-lg bg-[#f8f4f2] px-3 py-2 text-sm text-[#991B1B] animate-pulse">
                      AI 正在拆解这道题的选项逻辑...
                    </div>
                  )}

                  {aiError[q.id] && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{aiError[q.id]}</div>}

                  {aiExplain[q.id] && !aiLoading[q.id] && (
                    <div className="prose prose-sm mt-3 max-w-none rounded-lg bg-stone-50 px-3 py-3 text-[#57534E] prose-p:my-1 prose-ul:my-1">
                      <ReactMarkdown>{aiExplain[q.id]}</ReactMarkdown>
                    </div>
                  )}
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7] lg:sticky lg:top-6">
            <h2 className="text-base font-semibold">做题进度</h2>
            <p className="text-sm text-[#57534E]">
              已完成 <span className="font-semibold text-[#991B1B]">{doneCount}</span> / 共 {filtered.length} 题
            </p>

            <button type="button" className="w-full rounded-lg bg-[#f8f4f2] px-3 py-2 text-left text-sm text-[#991B1B]">
              错题收藏入口 →
            </button>

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-[#78716C]">快速跳题</p>
              <div className="flex flex-wrap gap-2">
                {filtered.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(`exam-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`h-8 min-w-8 rounded-md px-2 text-sm ${
                      answers[q.id] ? 'bg-[#991B1B] text-white' : 'bg-[#f5f2ef] text-[#57534E]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
