import { NextResponse } from "next/server";

import { examQuestionsFromCsv, officialPublicExamSets, type ExamType } from "@/data/content-adapters";

const examTypes = ["高考", "考研", "GRE", "美国高考"] as const;
const difficulties = ["简单", "中等", "困难"] as const;
const dynasties = ["唐", "宋", "元", "明", "清"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const examType = searchParams.get("examType");
  const difficulty = searchParams.get("difficulty");
  const dynasty = searchParams.get("dynasty");
  const keyword = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));

  const filtered = examQuestionsFromCsv.filter((item) => {
    if (examType && examTypes.includes(examType as ExamType) && item.examType !== examType) return false;
    if (difficulty && difficulties.includes(difficulty as (typeof difficulties)[number]) && item.difficulty !== difficulty) return false;
    if (dynasty && dynasties.includes(dynasty as (typeof dynasties)[number]) && item.dynasty !== dynasty) return false;
    if (!keyword) return true;

    const haystack = `${item.text} ${item.analysis} ${item.knowledgePoint} ${item.examType} ${item.source}`.toLowerCase();
    return haystack.includes(keyword);
  });

  const start = (page - 1) * pageSize;

  return NextResponse.json({
    ok: true,
    total: filtered.length,
    page,
    pageSize,
    questions: filtered.slice(start, start + pageSize),
    facets: {
      examTypes,
      difficulties,
      dynasties,
      sources: Array.from(new Set(examQuestionsFromCsv.map((item) => item.source))).sort(),
      officialPublicExamSets,
    },
  });
}
