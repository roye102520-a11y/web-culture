"use client";

import { useState } from "react";

import { getAIErrorMessage } from "@/lib/client-ai";

export type DeepSeekMode = "chat" | "qa" | "summarize";

export interface ExploreCardData {
  summary: string;
  detail: string;
  citations: string[];
  followUps: string[];
  error?: string;
}

export interface ExploreMessage {
  id: string;
  query: string;
  card: ExploreCardData;
  createdAt: number;
}

interface RouteResponse {
  ok: boolean;
  query: string;
  ragHits: string[];
  result: {
    mode: DeepSeekMode;
    answer: string;
    rawText?: string;
    parsed?: Record<string, unknown> | null;
    error?: string;
  };
}

const RAG_FALLBACK = "暂未在典籍中查找到相关确切记载";

// 核心意图：根据用户问题生成默认延伸追问，保障弱网/兜底场景下交互连续性。
function buildFollowUps(query: string): string[] {
  return [
    `请从时间线角度梳理“${query}”的关键节点。`,
    `“${query}”与当时社会背景之间有什么联系？`,
    `关于“${query}”，有哪些值得延伸阅读的典籍线索？`,
  ];
}

// 核心意图：将后端返回统一整理为前端四段卡结构，并提供无 Key 场景的友好展示。
function toCardData(payload: RouteResponse): ExploreCardData {
  const { query, ragHits, result } = payload;
  const parsed = result.parsed ?? null;

  const parsedAnswer = parsed && typeof parsed.answer === "string" ? parsed.answer : undefined;
  const summary = parsedAnswer ?? result.answer;
  const detail = result.rawText || result.answer;

  const citations = ragHits.filter((item) => item && item !== RAG_FALLBACK);

  if (result.error === "missing_api_key") {
    return {
      summary: `当前处于本地演示模式：${query}`,
      detail:
        "尚未配置真实 DeepSeek API Key，已启用友好兜底展示。你可以先体验问答流程，后续在 .env.local 填入真实 Key 后即可切换到真实模型回答。",
      citations,
      followUps: buildFollowUps(query),
      error: result.error,
    };
  }

  return {
    summary,
    detail,
    citations,
    followUps: buildFollowUps(query),
    error: result.error,
  };
}

export function useDeepSeek() {
  const [messages, setMessages] = useState<ExploreMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 核心意图：封装前后端调用链路，统一处理超时、异常与成功态，避免页面组件耦合请求细节。
  const ask = async (query: string, mode: DeepSeekMode = "qa") => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("/api/ai/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed, mode }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let data: RouteResponse | null = null;
      try {
        data = (await response.json()) as RouteResponse;
      } catch {
        throw new Error("invalid_json_response");
      }

      if (!response.ok || !data) {
        throw new Error(getAIErrorMessage(data, "暂时不可用"));
      }

      const card = toCardData(data);
      const newMessage: ExploreMessage = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        query: trimmed,
        card,
        createdAt: Date.now(),
      };

      setMessages((prev) => [newMessage, ...prev]);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "暂时不可用");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    errorMessage,
    ask,
  };
}
