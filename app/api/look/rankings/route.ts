import { NextResponse } from "next/server";

import {
  queryRankings,
  type RankingBoard,
  type RankingDynasty,
  type RankingItem,
  type RankingTopic,
} from "@/lib/look-rankings";

interface RankingApiResponse {
  ok: boolean;
  board: RankingBoard;
  topic: RankingTopic;
  dynasty: RankingDynasty;
  total: number;
  items: RankingItem[];
  error?: string;
}

function parseBoard(raw: string | null): RankingBoard {
  return raw === "paid" ? "paid" : "free";
}

function parseTopic(raw: string | null): RankingTopic {
  if (raw === "history" || raw === "poetry" || raw === "idiom") return raw;
  return "all";
}

function parseDynasty(raw: string | null): RankingDynasty {
  if (raw === "tang" || raw === "song" || raw === "ming-qing") return raw;
  return "all";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const board = parseBoard(searchParams.get("board"));
    const topic = parseTopic(searchParams.get("topic"));
    const dynasty = parseDynasty(searchParams.get("dynasty"));
    const limitRaw = Number(searchParams.get("limit") ?? "10");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

    const { items, total } = queryRankings({ board, topic, dynasty, limit });

    return NextResponse.json({ ok: true, board, topic, dynasty, total, items } satisfies RankingApiResponse);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        board: "free",
        topic: "all",
        dynasty: "all",
        total: 0,
        items: [],
        error: error instanceof Error ? error.message : "internal_error",
      } satisfies RankingApiResponse,
      { status: 500 },
    );
  }
}
