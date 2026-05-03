import { NextResponse } from "next/server";

import { withAIErrorHandling, AIHandlerError } from "@/lib/api-utils";
import { callDeepSeek, type DeepSeekResponse } from "@/lib/deepseek";
import { searchHistoryContext } from "@/lib/history-rag";

interface DeepSeekRouteRequest {
  query: string;
  mode?: "chat" | "qa" | "summarize" | "community_q" | "video_guide" | "free" | "mcq";
}

interface DeepSeekRouteResponse {
  ok: boolean;
  query: string;
  ragHits: string[];
  result: DeepSeekResponse;
}

export const POST = withAIErrorHandling(async (request: Request) => {
  const body = (await request.json()) as Partial<DeepSeekRouteRequest>;
  const query = body.query?.trim() ?? "";
  const mode = body.mode ?? "qa";

  if (!query) {
    throw new AIHandlerError("INVALID_REQUEST", "query 不能为空", 400);
  }

  const { ragHits } = searchHistoryContext(query);

  const result = await callDeepSeek({
    mode,
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
