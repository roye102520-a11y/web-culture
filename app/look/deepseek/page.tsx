"use client";

import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getAIErrorMessage } from "@/lib/client-ai";
import type { HistoryCitation } from "@/lib/history-rag-types";

interface DeepSeekResult {
  ok: boolean;
  query: string;
  ragHits: string[];
  citations?: HistoryCitation[];
  result: {
    answer: string;
    error?: string;
  };
}

type Category = "典籍比对" | "人物史" | "制度史";

type AIRequestPayload = {
  ok?: boolean;
  message?: string;
  errorCode?: string;
  details?: string;
  result?: { answer?: string; error?: string };
};

type RecommendItem = {
  id: string;
  category: Category;
  question: string;
};

const recommendQuestions: RecommendItem[] = [
  { id: "dq-1", category: "典籍比对", question: "《竹书纪年》与《史记》关于商系谱差异，应如何取证？" },
  { id: "dq-2", category: "典籍比对", question: "《汉书》与《后汉书》对同一事件叙事差异如何理解？" },
  { id: "dq-3", category: "人物史", question: "李白与杜甫在盛唐时期的社会角色有何本质差异？" },
  { id: "dq-4", category: "人物史", question: "王阳明学说为何在晚明士人中迅速传播？" },
  { id: "dq-5", category: "制度史", question: "唐宋科举制度在选官逻辑上发生了哪些结构性变化？" },
  { id: "dq-6", category: "制度史", question: "明清地方志编纂制度如何影响地方治理记忆？" },
];

function parseRagHit(hit: string) {
  const match = hit.match(/^【(.+?)】([\s\S]*)$/);
  if (!match) {
    return { source: "典籍片段", snippet: hit };
  }
  return { source: match[1], snippet: match[2]?.trim() || "" };
}

export default function DeepSeekPage() {
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState(() => searchParams.get("q") ?? "");
  const [result, setResult] = useState<DeepSeekResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const grouped = useMemo(() => {
    const map: Record<Category, RecommendItem[]> = {
      典籍比对: [],
      人物史: [],
      制度史: [],
    };
    for (const item of recommendQuestions) map[item.category].push(item);
    return map;
  }, []);

  const ask = async () => {
    const q = question.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, mode: 'free' }),
      });
      const data = (await res.json()) as DeepSeekResult & AIRequestPayload;
      if (!res.ok || !data.ok) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : '暂时不可用');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">典籍探疑・自由提问</h1>
            <p className="text-sm text-[#57534E]">点击任意典籍问题直接提问，AI智能参考书答与关联参考</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[65%_35%]">
            <div className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入你的文史问题..."
                className="min-h-36 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#991B1B]/50"
              />

              <p className="text-sm text-[#78716C]">支持提问类型：典籍比对 / 史料考证 / 人物关系 / 朝代对比</p>

              <Button onClick={ask} disabled={isLoading || !question.trim()} className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">
                自由提问 →
              </Button>

              {isLoading && (
                <div className="rounded-xl bg-[#f8f4f2] px-4 py-3 text-sm text-[#991B1B] animate-pulse">
                  AI正在为你检索典籍并组织回答...
                </div>
              )}

              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              {result && !isLoading && (
                <div className="space-y-3">
                  <article className="rounded-xl bg-stone-50 px-4 py-4 text-sm leading-7 text-[#57534E]">
                    <ReactMarkdown>{result.result.answer}</ReactMarkdown>
                  </article>

                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-[#991B1B]">参考来源</h2>
                    {result.ragHits.map((hit, idx) => {
                      const parsed = parseRagHit(hit);
                      const citation = result.citations?.[idx];
                      return (
                        <div key={`${parsed.source}-${idx}`} className="rounded-lg bg-white px-3 py-3 text-sm shadow-sm ring-1 ring-[#f0ece9]">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium text-[#1C1917]">{parsed.source}</p>
                            {citation && <span className="text-xs text-[#78716C]">score {citation.score}</span>}
                          </div>
                          <p className="mt-1 text-[#57534E]">{parsed.snippet || "暂无片段摘要"}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-3 rounded-xl bg-[#faf7f5] p-4 ring-1 ring-[#efeae7]">
              <h2 className="text-sm font-semibold text-[#1C1917]">推荐问题</h2>
              {(Object.keys(grouped) as Category[]).map((category) => (
                <div key={category} className="space-y-2">
                  <p className="text-xs font-medium tracking-wide text-[#78716C]">{category}</p>
                  {grouped[category].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQuestion(item.question)}
                      className="w-full rounded-lg bg-white px-3 py-2 text-left text-sm text-[#57534E] transition hover:text-[#1C1917]"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
