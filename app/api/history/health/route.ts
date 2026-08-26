import { NextResponse } from "next/server";

import { searchHistoryContext } from "@/lib/history-rag";

export async function GET() {
  const aiKeyConfigured = Boolean(
    process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== "your_api_key_here",
  );
  const ragResult = await searchHistoryContext("唐代");
  const ragLoaded = ragResult.citations.length > 0;

  return NextResponse.json({
    status: "ok",
    aiKeyConfigured,
    ragLoaded,
    ragDocs: ragResult.citations.length,
    timestamp: new Date().toISOString(),
  });
}
