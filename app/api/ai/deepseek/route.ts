import { NextResponse } from "next/server";

import { withAIErrorHandling, AIHandlerError } from "@/lib/api-utils";
import { DEEPSEEK_API_KEY_HEADER } from "@/lib/api-key";
import { callDeepSeek, type DeepSeekResponse } from "@/lib/deepseek";
import { searchHistoryContext } from "@/lib/history-rag";

interface DeepSeekRouteRequest {
  query: string;
  mode?: "chat" | "qa" | "summarize" | "community_q" | "video_guide" | "free" | "mcq" | "exam_help" | "history_explain";
}

interface DeepSeekRouteResponse {
  ok: boolean;
  query: string;
  ragHits: string[];
  result: DeepSeekResponse;
}

/** Vercel Serverless：允许上游 DeepSeek 较慢时仍完成请求（Hobby 套餐上限 10s，Pro 可更高） */
export const maxDuration = 60;

export const POST = withAIErrorHandling(async (request: Request) => {
  const body = (await request.json()) as Partial<DeepSeekRouteRequest>;
  const query = body.query?.trim() ?? "";
  const mode = body.mode ?? "qa";

  if (!query) {
    throw new AIHandlerError("INVALID_REQUEST", "query 不能为空", 400);
  }

  const { ragHits } = searchHistoryContext(query);
  const apiKey = request.headers.get(DEEPSEEK_API_KEY_HEADER) ?? undefined;

  const result = await callDeepSeek({
    mode,
    apiKey,
    payload: {
      query,
      context: ragHits,
    },
  });

  if (result.error === "missing_api_key") {
    throw new AIHandlerError("AI_KEY_MISSING", "AI功能配置中，请稍后", 503);
  }

  if (result.error) {
    throw new AIHandlerError("AI_UPSTREAM_ERROR", "暂时不可用", 502);
  }

  return NextResponse.json({
    ok: true,
    query,
    ragHits,
    result,
  } satisfies DeepSeekRouteResponse);
});
