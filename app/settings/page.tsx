"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clipboard, KeyRound, Server, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEEPSEEK_API_KEY_STORAGE_KEY } from "@/lib/api-key";
import { getAIErrorMessage } from "@/lib/client-ai";

type Health = {
  status: "ok";
  aiKeyConfigured: boolean;
  apiKeySource: "browser_settings" | "server_env" | "missing";
  ragLoaded: boolean;
  timestamp: string;
};

type TestState = {
  health?: Health;
  aiOk?: boolean;
  message?: string;
};

function maskKey(key: string) {
  if (key.length <= 12) return "已保存";
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState(() =>
    typeof window === "undefined" ? "" : (window.localStorage.getItem(DEEPSEEK_API_KEY_STORAGE_KEY) ?? ""),
  );
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));
  const [testing, setTesting] = useState(false);
  const [testState, setTestState] = useState<TestState | null>(null);

  const endpoints = useMemo(
    () => [
      { label: "后端健康检查", path: "/api/history/health", method: "GET" },
      { label: "题库读取接口", path: "/api/history/questions", method: "GET" },
      { label: "知识节点接口", path: "/api/history/knowledge-nodes", method: "GET" },
      { label: "DeepSeek 统一入口", path: "/api/ai/deepseek", method: "POST" },
      { label: "历史讲解接口", path: "/api/history/explain", method: "POST" },
      { label: "排行榜接口", path: "/api/look/rankings", method: "GET" },
      { label: "封面图接口", path: "/api/content/cover", method: "GET" },
      { label: "连通性接口", path: "/api/ping", method: "GET" },
    ],
    [],
  );

  const saveKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    window.localStorage.setItem(DEEPSEEK_API_KEY_STORAGE_KEY, trimmed);
    setSavedKey(trimmed);
    setApiKey("");
    setTestState({ message: "DeepSeek API Key 已保存到当前浏览器。" });
  };

  const clearKey = () => {
    window.localStorage.removeItem(DEEPSEEK_API_KEY_STORAGE_KEY);
    setSavedKey("");
    setTestState({ message: "已清除当前浏览器保存的 API Key。" });
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setTestState({ message: "链接已复制。" });
  };

  const testBackend = async () => {
    setTesting(true);
    setTestState(null);

    try {
      const healthRes = await fetch("/api/history/health");
      const health = (await healthRes.json()) as Health;

      const aiRes = await fetch("/api/ai/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "用一句话回答：文脉平台后端是否已经连通？", mode: "free" }),
      });
      const aiData = (await aiRes.json()) as { ok?: boolean; message?: string; errorCode?: string };

      if (!healthRes.ok) throw new Error("健康检查失败");
      if (!aiRes.ok || !aiData.ok) throw new Error(getAIErrorMessage(aiData, "DeepSeek 测试失败"));

      setTestState({ health, aiOk: true, message: "后端接口与 DeepSeek 已连通。" });
    } catch (error) {
      setTestState({
        aiOk: false,
        message: error instanceof Error ? error.message : "测试失败",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5">
          <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f1dd] text-[#7a5a00]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">设置</h1>
                <p className="mt-2 text-sm leading-6 text-[#57534E]">
                  在这里配置 DeepSeek API Key，并查看当前前端可调用的后端 API 链接。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <section className="space-y-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
              <h2 className="text-lg font-semibold">DeepSeek API Key</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="deepseek-key">
                  输入 Key
                </label>
                <Input
                  id="deepseek-key"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  type="password"
                  placeholder="sk-..."
                  className="h-11 rounded-xl bg-white"
                />
                <p className="text-xs leading-5 text-[#78716C]">
                  本地测试时 Key 会保存在当前浏览器 localStorage，并随站内 `/api/*` 请求发送到 Next 后端。生产环境建议改用服务端环境变量。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={saveKey} disabled={!apiKey.trim()} className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">
                  保存 Key
                </Button>
                <Button variant="outline" onClick={clearKey} disabled={!savedKey} className="bg-white text-[#57534E]">
                  <Trash2 className="mr-2 h-4 w-4" />
                  清除
                </Button>
                <Button variant="outline" onClick={testBackend} disabled={testing} className="bg-white text-[#57534E]">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {testing ? "测试中" : "测试连接"}
                </Button>
              </div>

              <div className="rounded-xl bg-[#faf7f5] px-4 py-3 text-sm text-[#57534E]">
                当前 Key：{savedKey ? maskKey(savedKey) : "未保存"}
              </div>

              {testState?.message ? (
                <div className={`rounded-xl px-4 py-3 text-sm ${testState.aiOk === false ? "bg-red-50 text-red-700" : "bg-[#f8f4f2] text-[#57534E]"}`}>
                  {testState.message}
                </div>
              ) : null}
            </section>

            <section className="space-y-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7]">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-[#991B1B]" />
                <h2 className="text-lg font-semibold">后端链接</h2>
              </div>
              <div className="rounded-xl bg-[#1C1917] px-4 py-3 text-sm text-white">
                {origin || "http://localhost:3000"}
              </div>
              <div className="space-y-2">
                {endpoints.map((item) => {
                  const url = `${origin || "http://localhost:3000"}${item.path}`;
                  return (
                    <div key={item.path} className="rounded-xl bg-[#faf7f5] p-3 ring-1 ring-[#efeae7]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="mt-1 break-all text-xs text-[#57534E]">
                            {item.method} {url}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`复制${item.label}`}
                          onClick={() => void copyText(url)}
                          className="rounded-lg bg-white p-2 text-[#57534E] ring-1 ring-[#e7e5e4] hover:text-[#1C1917]"
                        >
                          <Clipboard className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
