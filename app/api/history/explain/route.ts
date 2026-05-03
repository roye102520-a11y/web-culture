import { NextResponse } from "next/server";

import { AIHandlerError, withAIErrorHandling } from "@/lib/api-utils";

interface ExplainRequestBody {
  question: string;
  student_answer?: string;
  correct_answer?: string;
}

interface ExplainResponseBody {
  error_reason: string;
  logic_reasoning: string;
  historical_background: string;
  extension: string;
  score?: number;
}

function buildScore(studentAnswer: string, correctAnswer: string): number | undefined {
  const student = studentAnswer.trim();
  const correct = correctAnswer.trim();
  if (!student || !correct) return undefined;

  if (student === correct) return 95;
  const overlap = student
    .split(/\s+/)
    .filter((token) => token.length > 1 && correct.includes(token)).length;

  const score = Math.max(40, Math.min(92, 55 + overlap * 8));
  return score;
}

export const POST = withAIErrorHandling(async (request: Request) => {
  const body = (await request.json()) as Partial<ExplainRequestBody>;
  const question = body.question?.trim() ?? "";
  const studentAnswer = body.student_answer?.trim() ?? "";
  const correctAnswer = body.correct_answer?.trim() ?? "";

  if (!question) {
    throw new AIHandlerError("INVALID_REQUEST", "question_required", 400);
  }

  const response: ExplainResponseBody = {
    error_reason: studentAnswer
      ? `你的回答围绕“${question.slice(0, 24)}”已有方向，但对关键史实与时间锚点描述不够完整。建议补足主体人物、时间节点与事件结果三部分。`
      : `当前未填写“我的回答”，无法精确定位个人错因。建议先尝试作答，再使用讲解功能获得更精准纠偏。`,
    logic_reasoning:
      "推荐采用“先定义概念 → 再给时间线 → 最后给影响”的三步推理。这样可以避免只记结论、不知因果的常见失分问题。",
    historical_background:
      "该题通常处在“制度演变与社会影响”的考查范围。作答时可补充当时政治结构、社会群体变化与文化表达方式，提升答案完整度。",
    extension:
      "延伸建议：将该题与同朝代的两道关联题并列复盘，形成“事件—制度—影响”的对照表，能显著提升迁移能力与应试稳定性。",
    score: buildScore(studentAnswer, correctAnswer),
  };

  return NextResponse.json(response);
});
