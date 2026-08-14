import { NextResponse } from "next/server";

import { DEEPSEEK_API_KEY_HEADER } from "@/lib/api-key";
import { searchHistoryContext } from "@/lib/history-rag";

export async function GET(request: Request) {
  const requestApiKey = request.headers.get(DEEPSEEK_API_KEY_HEADER)?.trim();
  const aiKeyConfigured = Boolean(
    requestApiKey || (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== "your_api_key_here"),
  );
  const ragLoaded = searchHistoryContext("唐代").ragHits.length > 0;

  return NextResponse.json({
    ok: true,
    status: "ok",
    aiKeyConfigured,
    apiKeySource: requestApiKey ? "browser_settings" : aiKeyConfigured ? "server_env" : "missing",
    ragLoaded,
    rag_docs: ragLoaded ? 4 : 0,
    message: ragLoaded ? "RAG 语料已加载，AI Key 状态见 aiKeyConfigured。" : "RAG 语料未加载。",
    timestamp: new Date().toISOString(),
  });
}
