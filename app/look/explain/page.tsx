"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getAIErrorMessage } from "@/lib/client-ai";

type ExplainRequestPayload = {
  message?: string;
  errorCode?: string;
  details?: string;
};

interface ExplainResult {
  error_reason: string;
  logic_reasoning: string;
  historical_background: string;
  extension: string;
  score?: number;
}

export default function ExplainPage() {
  const [question, setQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/history/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmedQuestion,
          student_answer: studentAnswer,
          correct_answer: correctAnswer,
        }),
      });

      const data = (await res.json()) as ExplainResult & ExplainRequestPayload;
      if (!res.ok) throw new Error(getAIErrorMessage(data, "暂时不可用"));
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "暂时不可用");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
          <h1 className="text-2xl font-semibold">AI历史讲解</h1>

          <div className="space-y-3">
            <label className="block text-sm font-medium">题目内容（必填）</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-28 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#991B1B]/50"
              placeholder="请输入历史题目..."
            />

            <label className="block text-sm font-medium">我的回答（选填）</label>
            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              className="min-h-24 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#991B1B]/50"
              placeholder="输入你的作答..."
            />

            <label className="block text-sm font-medium">标准答案（选填）</label>
            <input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 text-sm outline-none focus:border-[#991B1B]/50"
              placeholder="输入标准答案关键词..."
            />

            <Button onClick={onSubmit} disabled={isLoading || !question.trim()} className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">
              提交
            </Button>
          </div>

          {isLoading && (
            <div className="rounded-xl bg-[#f8f4f2] px-4 py-3 text-sm text-[#991B1B] animate-pulse">
              AI正在为你拆解这道题...
            </div>
          )}

          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {result && !isLoading && (
            <div className="space-y-3">
              {typeof result.score === "number" && (
                <div className="rounded-xl bg-[#f6f1ed] px-4 py-3 text-sm text-[#57534E]">
                  当前作答评分：<span className="font-semibold text-[#991B1B]">{result.score}</span>
                </div>
              )}

              <article className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#efeae7]">
                <h2 className="text-sm font-semibold text-[#991B1B]">🔴 错因分析</h2>
                <p className="mt-2 text-sm leading-7 text-[#57534E]">{result.error_reason}</p>
              </article>

              <article className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#efeae7]">
                <h2 className="text-sm font-semibold text-[#991B1B]">🧠 推理逻辑</h2>
                <p className="mt-2 text-sm leading-7 text-[#57534E]">{result.logic_reasoning}</p>
              </article>

              <article className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#efeae7]">
                <h2 className="text-sm font-semibold text-[#991B1B]">📜 历史背景</h2>
                <p className="mt-2 text-sm leading-7 text-[#57534E]">{result.historical_background}</p>
              </article>

              <article className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#efeae7]">
                <h2 className="text-sm font-semibold text-[#991B1B]">🌐 延伸知识</h2>
                <p className="mt-2 text-sm leading-7 text-[#57534E]">{result.extension}</p>
              </article>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
