import { NextResponse } from "next/server";

import { allContentRecords, examQuestionsFromCsv } from "@/data/content-adapters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const examNodes = new Map<string, { id: string; title: string; type: string; count: number; examples: string[] }>();
  for (const item of examQuestionsFromCsv) {
    const key = item.knowledgePoint || item.dynasty;
    const existing = examNodes.get(key) ?? {
      id: `exam-${examNodes.size + 1}`,
      title: key,
      type: "exam_knowledge",
      count: 0,
      examples: [],
    };
    existing.count += 1;
    if (existing.examples.length < 3) existing.examples.push(item.text);
    examNodes.set(key, existing);
  }

  const contentNodes = allContentRecords.slice(0, 80).map((item) => ({
    id: `content-${item.id}`,
    title: item.title,
    type: "content_topic",
    count: 1,
    examples: [item.content],
  }));

  const nodes = [...examNodes.values(), ...contentNodes].filter((node) => {
    if (!keyword) return true;
    const haystack = `${node.title} ${node.type} ${node.examples.join(" ")}`.toLowerCase();
    return haystack.includes(keyword);
  });

  return NextResponse.json({
    ok: true,
    total: nodes.length,
    nodes: nodes.slice(0, 120),
  });
}
