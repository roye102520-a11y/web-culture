"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { HistoryCitation } from "@/lib/history-rag-types";

interface RagDebugResponse {
  ok: boolean;
  query: string;
  topK: number;
  ragHits: string[];
  citations: HistoryCitation[];
  message?: string;
}

const sampleQuestions = [
  "李白为什么一直想进入政治中心？",
  "安史之乱如何影响杜甫诗歌？",
  "唐宋科举制度在选官逻辑上有什么变化？",
  "梁山招安为什么是水浒的关键转折？",
];

function parseRagHit(hit: string) {
  const match = hit.match(/^【(.+?)】([\s\S]*)$/);
  if (!match) return { heading: "检索片段", content: hit };
  return { heading: match[1], content: match[2].trim() };
}

export default function RagDebugPage() {
  const [query, setQuery] = useState(sampleQuestions[0]);
  const [topK, setTopK] = useState(5);
  const [result, setResult] = useState<RagDebugResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/history/rag-debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, topK }),
      });
      const data = (await response.json()) as RagDebugResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "检索失败");
      }

      setResult(data);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "检索失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F4] px-4 py-8 text-[#1C1917] md:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">RAG 检索调试</h1>
          <p className="text-sm text-[#57534E]">查看用户问题如何命中向量知识库片段。</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-32 w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#991B1B]/50"
            />

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[#57534E]">
                Top K
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={topK}
                  onChange={(event) => setTopK(Number(event.target.value))}
                  className="h-9 w-20 rounded-md border border-[#e7e5e4] bg-white px-2 outline-none focus:border-[#991B1B]/50"
                />
              </label>
              <Button onClick={runDebug} disabled={isLoading || !query.trim()} className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">
                {isLoading ? "检索中..." : "开始检索"}
              </Button>
            </div>

            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          </div>

          <aside className="space-y-2 rounded-lg bg-white p-3 shadow-sm ring-1 ring-[#efeae7]">
            <p className="text-sm font-semibold">示例问题</p>
            {sampleQuestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="block w-full rounded-md px-2 py-2 text-left text-sm text-[#57534E] transition hover:bg-[#F5F5F4] hover:text-[#1C1917]"
              >
                {item}
              </button>
            ))}
          </aside>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-[#efeae7]">
              <p className="font-medium">Query：{result.query}</p>
              <p className="mt-1 text-[#78716C]">返回 {result.citations.length} 个片段</p>
            </div>

            {result.ragHits.map((hit, index) => {
              const parsed = parseRagHit(hit);
              const citation = result.citations[index];

              return (
                <article key={`${parsed.heading}-${index}`} className="rounded-lg bg-white px-4 py-4 text-sm shadow-sm ring-1 ring-[#efeae7]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-[#1C1917]">{parsed.heading}</h2>
                    {citation && <span className="rounded-full bg-[#F5F5F4] px-2 py-1 text-xs text-[#57534E]">score {citation.score}</span>}
                  </div>
                  <p className="mt-2 leading-7 text-[#57534E]">{parsed.content}</p>
                  {citation && (
                    <p className="mt-2 text-xs text-[#78716C]">
                      {citation.docId} / chunk {citation.metadata.chunkIndex + 1} / {citation.metadata.dynasty}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
