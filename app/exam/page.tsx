"use client";

import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  examQuestionsFromCsv,
  officialPublicExamSets,
  type ExamQuestionRecord,
  type ExamType,
} from "@/data/content-adapters";
import { getAIErrorMessage } from "@/lib/client-ai";

type Dynasty = "全部" | "唐" | "宋" | "元" | "明" | "清";
type Difficulty = "全部" | "简单" | "中等" | "困难";
type ExamTypeFilter = "全部" | ExamType;

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

const dynastyOptions: Dynasty[] = ["全部", "唐", "宋", "元", "明", "清"];
const difficultyOptions: Difficulty[] = ["全部", "简单", "中等", "困难"];
const examTypeOptions: ExamTypeFilter[] = ["全部", "高考", "考研", "GRE", "美国高考"];
const PAGE_SIZE = 20;

const questions: ExamQuestionRecord[] = examQuestionsFromCsv;
const knowledgeOptions = Array.from(new Set(questions.map((item) => item.knowledgePoint))).filter(Boolean).sort();

function difficultyClass(difficulty: string) {
  if (difficulty === "困难") return "bg-red-50 text-red-700";
  if (difficulty === "中等") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function ExamPage() {
  const [examType, setExamType] = useState<ExamTypeFilter>("全部");
  const [dynasty, setDynasty] = useState<Dynasty>("全部");
  const [difficulty, setDifficulty] = useState<Difficulty>("全部");
  const [knowledgePoint, setKnowledgePoint] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [openAnalysis, setOpenAnalysis] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string | null>>({});
  const [aiExplain, setAiExplain] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return questions.filter((item) => {
      if (examType !== "全部" && item.examType !== examType) return false;
      if (dynasty !== "全部" && item.dynasty !== dynasty) return false;
      if (difficulty !== "全部" && item.difficulty !== difficulty) return false;
      if (knowledgePoint !== "全部" && item.knowledgePoint !== knowledgePoint) return false;
      if (!q) return true;
      const haystack = `${item.text} ${item.analysis} ${item.knowledgePoint} ${item.examType} ${item.source} ${item.year}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [examType, dynasty, difficulty, knowledgePoint, keyword]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, maxPage);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const doneCount = filtered.filter((item) => answers[item.id] !== undefined).length;
  const correctCount = filtered.filter((item) => answers[item.id] === item.correct).length;
  const wrongCount = filtered.filter((item) => answers[item.id] !== undefined && answers[item.id] !== item.correct).length;
  const favoriteCount = Object.values(favorites).filter(Boolean).length;
  const officialSets = officialPublicExamSets.filter((item) => examType === "全部" || item.examType === examType);

  const setFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const askAi = async (item: ExamQuestionRecord) => {
    const selected = answers[item.id];
    const selectedText = selected ? item.options.find((op) => op.key === selected)?.text ?? "" : "未作答";

    setAiLoading((prev) => ({ ...prev, [item.id]: true }));
    setAiError((prev) => ({ ...prev, [item.id]: null }));

    try {
      const query = `考试类型：${item.examType}
题目来源：${item.source}（${item.year}）
知识点：${item.knowledgePoint}
题目：${item.text}
选项：${item.options.map((op) => `${op.key}.${op.text}`).join("；")}
我的答案：${selected ?? "未作答"} ${selectedText}
正确答案：${item.correct}
站内解析：${item.analysis}`;
      const res = await fetch("/api/ai/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode: "exam_help" }),
      });
      const data = (await res.json()) as AIRequestPayload;
      if (!res.ok || !data.ok || !data.result?.answer) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }
      setAiExplain((prev) => ({ ...prev, [item.id]: data.result?.answer ?? "" }));
    } catch (e) {
      setAiError((prev) => ({ ...prev, [item.id]: e instanceof Error ? e.message : "暂时不可用" }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efeae7]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">考试专区</h1>
                  <p className="mt-1 text-sm text-[#57534E]">
                    高考 / 考研 / GRE / 美国高考历史题库训练。当前题库 {questions.length} 题，含原创历史模拟题与导入题。
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center sm:w-[360px]">
                  <div className="rounded-xl bg-[#faf7f5] px-3 py-2">
                    <p className="text-xs text-[#78716C]">已做</p>
                    <p className="text-lg font-semibold text-[#991B1B]">{doneCount}</p>
                  </div>
                  <div className="rounded-xl bg-[#faf7f5] px-3 py-2">
                    <p className="text-xs text-[#78716C]">正确</p>
                    <p className="text-lg font-semibold text-emerald-700">{correctCount}</p>
                  </div>
                  <div className="rounded-xl bg-[#faf7f5] px-3 py-2">
                    <p className="text-xs text-[#78716C]">错题</p>
                    <p className="text-lg font-semibold text-red-700">{wrongCount}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
                <Input
                  value={keyword}
                  onChange={(event) => setFilter(() => setKeyword(event.target.value))}
                  placeholder="搜索题干、知识点、考试类型..."
                  className="h-11 rounded-xl bg-white pl-9"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <FilterGroup title="考试类型" options={examTypeOptions} value={examType} onChange={(value) => setFilter(() => setExamType(value as ExamTypeFilter))} />
                <FilterGroup title="朝代" options={dynastyOptions} value={dynasty} onChange={(value) => setFilter(() => setDynasty(value as Dynasty))} />
                <FilterGroup title="难度" options={difficultyOptions} value={difficulty} onChange={(value) => setFilter(() => setDifficulty(value as Difficulty))} />
                <label className="space-y-2">
                  <span className="block text-xs font-medium tracking-wide text-[#78716C]">知识点</span>
                  <select
                    value={knowledgePoint}
                    onChange={(event) => setFilter(() => setKnowledgePoint(event.target.value))}
                    className="h-10 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 text-sm text-[#57534E] outline-none focus:border-[#991B1B]/50"
                  >
                    <option value="全部">全部</option>
                    {knowledgeOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="space-y-3">
              {visible.map((item, index) => {
                const selected = answers[item.id];
                const answered = selected !== undefined;
                const isCorrect = selected === item.correct;

                return (
                  <article id={`exam-${item.id}`} key={item.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-[#57534E]">{item.examType}</span>
                          <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-[#57534E]">{item.dynasty}</span>
                          <span className={`rounded-full px-2 py-0.5 ${difficultyClass(item.difficulty)}`}>{item.difficulty}</span>
                          <span className="rounded-full bg-[#f5f2ef] px-2 py-0.5 text-[#57534E]">{item.source}</span>
                          {item.sourceUrl ? (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 hover:text-blue-900"
                            >
                              官方公开来源
                            </a>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#1C1917]">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}. {item.text}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="收藏题目"
                        onClick={() => setFavorites((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className={`shrink-0 rounded-lg p-2 ring-1 ring-[#e7e5e4] ${
                          favorites[item.id] ? "bg-[#f8f1dd] text-[#7a5a00]" : "bg-white text-[#78716C]"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {item.options.map((op) => {
                        const selectedOption = selected === op.key;
                        const correctOption = answered && item.correct === op.key;
                        const wrongSelected = answered && selectedOption && !correctOption;
                        return (
                          <button
                            key={op.key}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: op.key }))}
                            className={`min-h-11 rounded-xl px-3 py-2 text-left text-sm leading-6 transition ${
                              correctOption
                                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                                : wrongSelected
                                  ? "bg-red-50 text-red-800 ring-1 ring-red-200"
                                  : selectedOption
                                    ? "bg-[#991B1B]/12 text-[#7F1D1D] ring-1 ring-[#991B1B]/30"
                                    : "bg-[#faf9f8] text-[#57534E] ring-1 ring-[#ece9e6] hover:text-[#1C1917]"
                            }`}
                          >
                            <span className="font-semibold">{op.key}.</span> {op.text}
                          </button>
                        );
                      })}
                    </div>

                    {answered ? (
                      <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                        {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {isCorrect ? "回答正确" : `回答错误，正确答案是 ${item.correct}`}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-[#57534E]"
                        onClick={() => setOpenAnalysis((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      >
                        查看解析
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                        onClick={() => void askAi(item)}
                        disabled={aiLoading[item.id]}
                      >
                        {aiLoading[item.id] ? "生成中" : "AI 考试答疑"}
                      </Button>
                    </div>

                    {openAnalysis[item.id] && (
                      <div className="mt-3 rounded-lg bg-stone-50 px-3 py-3 text-sm leading-6 text-[#57534E]">
                        <p>{item.analysis}</p>
                        <p className="mt-2 text-xs text-[#78716C]">
                          知识点：{item.knowledgePoint} · 语言：{item.language} · {item.year}
                        </p>
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-xs text-[#991B1B] hover:text-[#7F1D1D]"
                          >
                            打开官方公开题目 / 说明 →
                          </a>
                        ) : null}
                      </div>
                    )}

                    {aiError[item.id] && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{aiError[item.id]}</div>}

                    {aiExplain[item.id] && !aiLoading[item.id] && (
                      <div className="prose prose-sm mt-3 max-w-none rounded-lg bg-stone-50 px-3 py-3 text-[#57534E] prose-p:my-1 prose-ul:my-1">
                        <ReactMarkdown>{aiExplain[item.id]}</ReactMarkdown>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-[#efeae7]">
              <span className="text-[#57534E]">
                第 {currentPage} / {maxPage} 页，共 {filtered.length} 题
              </span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                  上一页
                </Button>
                <Button variant="outline" disabled={currentPage >= maxPage} onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}>
                  下一页
                </Button>
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#efeae7] lg:sticky lg:top-6">
            <section>
              <h2 className="text-base font-semibold">题库概览</h2>
              <div className="mt-3 space-y-2 text-sm text-[#57534E]">
                <p>筛选结果：{filtered.length} 题</p>
                <p>收藏：{favoriteCount} 题</p>
                <p>正确率：{doneCount ? Math.round((correctCount / doneCount) * 100) : 0}%</p>
              </div>
            </section>

            <section className="rounded-xl bg-[#faf7f5] p-3">
              <p className="text-sm font-medium text-[#1C1917]">版权与来源</p>
              <p className="mt-2 text-xs leading-5 text-[#57534E]">
                题库主列表只展示历史相关题。GRE/SAT/AP 官方公开材料放在下方资源区，点击可进入官方原题或说明页面。
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold">官方公开题源</h2>
              <div className="space-y-2">
                {officialSets.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-[#faf7f5] p-3 ring-1 ring-[#efeae7] hover:bg-[#f7f1ee]"
                  >
                    <p className="text-sm font-medium text-[#1C1917]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#991B1B]">{item.provider} · {item.examType}</p>
                    <p className="mt-2 text-xs leading-5 text-[#57534E]">{item.description}</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-[#78716C]">快速跳题</p>
              <div className="grid max-h-[380px] grid-cols-5 gap-2 overflow-y-auto pr-1">
                {visible.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => document.getElementById(`exam-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className={`h-8 rounded-md px-2 text-sm ${
                      answers[item.id]
                        ? answers[item.id] === item.correct
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-[#f5f2ef] text-[#57534E]"
                    }`}
                  >
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-[#78716C]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              value === item ? "bg-[#991B1B] text-white" : "bg-white text-[#57534E] ring-1 ring-[#e7e5e4] hover:text-[#1C1917]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
