"use client";

import { useEffect, useState } from "react";

type Health = {
  status: "ok";
  aiKeyConfigured: boolean;
  ragLoaded: boolean;
  timestamp: string;
};

export default function AdminHealthPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [deepSeekReachable, setDeepSeekReachable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/history/health");
        const data = (await res.json()) as Health;
        setHealth(data);

        const pingRes = await fetch("/api/ai/deepseek", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "health ping", mode: "free" }),
        });

        if (!pingRes.ok) {
          setDeepSeekReachable(false);
          return;
        }

        const pingData = (await pingRes.json()) as { ok?: boolean };
        setDeepSeekReachable(Boolean(pingData.ok));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    };

    void run();
  }, []);

  const mark = (v: boolean | null) => (v == null ? "⏳" : v ? "✅" : "❌");

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
        <section className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-[#efeae7]">
          <h1 className="text-2xl font-semibold">健康状态面板</h1>
          <p className="text-sm text-[#57534E]">接口：/api/history/health 与 DeepSeek 连通性检测</p>

          <div className="space-y-2 text-sm">
            <p>AI Key 是否配置 {mark(health?.aiKeyConfigured ?? null)}</p>
            <p>RAG 语料是否加载 {mark(health?.ragLoaded ?? null)}</p>
            <p>DeepSeek API 可达性 {mark(deepSeekReachable)}</p>
          </div>

          {health && <p className="text-xs text-[#78716C]">最后更新时间：{health.timestamp}</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
        </section>
      </main>
    </div>
  );
}
