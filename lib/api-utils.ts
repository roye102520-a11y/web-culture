import { NextResponse } from "next/server";

export class AIHandlerError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const TIMEOUT_MS = 10000;

function normalizeError(error: unknown) {
  if (error instanceof AIHandlerError) return error;

  if (error instanceof Error && error.message === "AI_TIMEOUT") {
    return new AIHandlerError("AI_TIMEOUT", "网络较慢，请重试", 504);
  }

  return new AIHandlerError("AI_UNKNOWN", "暂时不可用", 500);
}

// 核心意图：统一 AI 接口错误返回，避免每个路由重复写超时与异常兜底逻辑。
export function withAIErrorHandling<T extends Request>(
  handler: (request: T) => Promise<Response>,
) {
  return async (request: T) => {
    try {
      const response = await Promise.race([
        handler(request),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("AI_TIMEOUT")), TIMEOUT_MS);
        }),
      ]);

      return response;
    } catch (error) {
      const normalized = normalizeError(error);

      return NextResponse.json(
        {
          ok: false,
          errorCode: normalized.code,
          message: normalized.message,
          ...(process.env.NODE_ENV !== "production" && {
            details: error instanceof Error ? error.message : String(error),
          }),
        },
        { status: normalized.status },
      );
    }
  };
}
