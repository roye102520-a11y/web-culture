"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { examQuestionsFromCsv } from "@/data/content-adapters";
import { getAIErrorMessage } from "@/lib/client-ai";

type Section = "全部" | "Verbal Reasoning" | "Quantitative Reasoning";
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
  section: Exclude<Section, "全部">;
  topic: string;
  topicOrder: number;
  difficulty: Difficulty;
  text: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct: "A" | "B" | "C" | "D";
  analysis: string;
};

const sectionOptions: Section[] = ["全部", "Verbal Reasoning", "Quantitative Reasoning"];
const difficultyOptions: Difficulty[] = ["简单", "中等", "困难"];
const PAGE_SIZE = 20;

const questions: Question[] = examQuestionsFromCsv;

export default function ExamPage() {
  const [section, setSection] = useState<Section>("全部");
  const [topic, setTopic] = useState("全部考点");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [openAnalysis, setOpenAnalysis] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string | null>>({});
  const [aiExplain, setAiExplain] = useState<Record<string, string>>({});

  const topics = useMemo(
    () => Array.from(new Set(questions.filter((q) => section === "全部" || q.section === section).map((q) => q.topic))),
    [section],
  );

  const filtered = useMemo(() => questions.filter((q) =>
    (section === "全部" || q.section === section) &&
    (topic === "全部考点" || q.topic === topic) &&
    (!difficulty || q.difficulty === difficulty)), [section, topic, difficulty]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageQuestions = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

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
              <h1 className="text-2xl font-semibold">GRE 原创题库</h1>
              <p className="mt-1 text-sm text-[#57534E]">3,000 道原创专项练习 · 按 GRE 考点顺序排列 · 非 ETS 官方真题</p>
            </section>

            <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-[#78716C]">考试模块</p>
                <div className="flex flex-wrap gap-2">
                  {sectionOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setSection(item); setTopic("全部考点"); setPage(1); }}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        section === item ? 'bg-[#991B1B] text-white' : 'bg-white text-[#57534E] ring-1 ring-[#e7e5e4]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="gre-topic" className="text-xs font-medium tracking-wide text-[#78716C]">GRE 考点顺序</label>
                <select id="gre-topic" value={topic} onChange={(event) => { setTopic(event.target.value); setPage(1); }} className="h-11 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 text-sm text-[#57534E] outline-none focus:border-[#991B1B]/50">
                  <option>全部考点</option>
                  {topics.map((item, index) => <option key={item} value={item}>{index + 1}. {item}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-[#78716C]">难度筛选</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setDifficulty(null); setPage(1); }}
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
                      onClick={() => { setDifficulty(item); setPage(1); }}
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
              {pageQuestions.map((q, idx) => (
                <article id={`exam-${q.id}`} key={q.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-7 text-[#1C1917]">
                      {(page - 1) * PAGE_SIZE + idx + 1}. {q.text}
                    </p>
                    <span className="shrink-0 rounded-full bg-[#f5f2ef] px-2 py-0.5 text-xs text-[#57534E]">
                      {q.section} · {q.difficulty}
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

            <nav className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]" aria-label="题库分页">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>上一页</Button>
              <span className="text-sm text-[#57534E]">第 {page} / {pageCount} 页</span>
              <Button variant="outline" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>下一页</Button>
            </nav>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7] lg:sticky lg:top-6">
            <h2 className="text-base font-semibold">做题进度</h2>
            <p className="text-sm text-[#57534E]">
              已完成 <span className="font-semibold text-[#991B1B]">{doneCount}</span> / 共 {filtered.length} 题
            </p>

            <Link href="/mine" className="block w-full rounded-lg bg-[#f8f4f2] px-3 py-2 text-left text-sm text-[#991B1B]">
              错题收藏入口 →
            </Link>

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-[#78716C]">快速跳题</p>
              <div className="flex flex-wrap gap-2">
                {pageQuestions.map((q, idx) => (
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
                    {(page - 1) * PAGE_SIZE + idx + 1}
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
