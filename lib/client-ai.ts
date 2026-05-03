interface AIErrorPayload {
  errorCode?: string;
  message?: string;
  details?: string;
  result?: { error?: string };
}

export function getAIErrorMessage(payload: unknown, fallback = "暂时不可用") {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as AIErrorPayload;

  if (data.errorCode === "AI_KEY_MISSING") return "AI功能配置中，请稍后";
  if (data.errorCode === "AI_TIMEOUT") return "网络较慢，请重试";

  const base = data.message || data.result?.error || fallback;
  if (process.env.NODE_ENV !== "production" && data.details) {
    return `${base} (${data.details})`;
  }
  return base;
}
