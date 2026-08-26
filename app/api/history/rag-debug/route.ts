import { NextResponse } from "next/server";

import { searchHistoryContext } from "@/lib/history-rag";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{ query: string; topK: number }>;
  const query = body.query?.trim() ?? "";
  const topK = Math.min(Math.max(body.topK ?? 5, 1), 10);

  if (!query) {
    return NextResponse.json({ ok: false, message: "query 不能为空" }, { status: 400 });
  }

  const result = await searchHistoryContext(query, topK);

  return NextResponse.json({
    ok: true,
    query,
    topK,
    ...result,
  });
}

