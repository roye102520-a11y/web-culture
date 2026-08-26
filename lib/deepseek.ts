type DeepSeekMode = "chat" | "qa" | "summarize" | "community_q" | "video_guide" | "free" | "mcq";

export interface DeepSeekPayload {
  query: string;
  context?: string[];
  extra?: Record<string, unknown>;
}

export interface DeepSeekRequest {
  mode: DeepSeekMode;
  payload: DeepSeekPayload;
}

export interface DeepSeekResponse {
  mode: DeepSeekMode;
  answer: string;
  rawText?: string;
  parsed?: Record<string, unknown> | null;
  error?: string;
}

interface DeepSeekApiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekApiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

const MODE_SYSTEM_PROMPTS: Record<DeepSeekMode, string> = {
  chat: "你是文脉平台的文化向导助手，请保持表达准确、清晰、友好。",
  qa: "你是一位严谨的历史学者，请优先基于给定检索资料回答，并标注不确定性。资料不足时要明确说明，不要编造史实。",
  summarize: "你是一位擅长归纳的文史编辑，请提炼核心信息并给出结构化摘要。",
  community_q: "你是文脉社区的文史答疑助手，请先给简明结论，再给出处线索与延伸阅读建议。出处线索只能来自检索上下文。",
  video_guide: "你是文脉平台的导读助手，请给出结构化提纲、阅读重点和问题引导。",
  free: "你是文脉平台的自由问答助手，回答要准确、清晰，并优先依据检索上下文给出资料来源线索。",
  mcq: "你是文脉考试讲解助手，请按考试思路解释选项逻辑，先给结论再给推理与记忆法。",
};

// 核心意图：构建统一的 DeepSeek 消息格式，确保不同模式有固定系统提示词。
function buildMessages(mode: DeepSeekMode, payload: DeepSeekPayload): DeepSeekApiMessage[] {
  const contextText = payload.context?.length
    ? `【检索上下文】\n${payload.context.join("\n")}`
    : "【检索上下文】\n暂未在典籍中查找到相关确切记载";

  const userText = `【用户问题】\n${payload.query}\n\n${contextText}\n\n回答要求：\n1. 优先依据检索上下文回答。\n2. 如果检索上下文不足以确认，请明确说“现有资料不足以确认”。\n3. 涉及历史人物动机时，请区分史实、合理推测和文学解释。\n4. citations 字段请列出你实际使用的资料编号或标题。\n\n请返回 JSON 对象，包含字段：answer, confidence, citations。`;

  return [
    { role: "system", content: MODE_SYSTEM_PROMPTS[mode] },
    { role: "user", content: userText },
  ];
}

// 核心意图：解析模型文本为 JSON；若失败，进行有限重试并输出兜底结构。
function parseJsonWithRetry(text: string, maxRetries = 1): Record<string, unknown> | null {
  let attempt = 0;
  let candidate = text.trim();

  while (attempt <= maxRetries) {
    try {
      return JSON.parse(candidate) as Record<string, unknown>;
    } catch {
      const start = candidate.indexOf("{");
      const end = candidate.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        candidate = candidate.slice(start, end + 1);
      }
      attempt += 1;
    }
  }

  return null;
}

// 核心意图：统一 DeepSeek 调用入口，处理网络异常与 JSON 兜底逻辑。
export async function callDeepSeek({ mode, payload }: DeepSeekRequest): Promise<DeepSeekResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return {
      mode,
      answer: "当前未配置有效的 DeepSeek API Key，请在 .env.local 中补充。",
      error: "missing_api_key",
    };
  }

  try {
    const res = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: buildMessages(mode, payload),
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const fallbackText = await res.text().catch(() => "");
      return {
        mode,
        answer: "模型服务暂时不可用，请稍后重试。",
        error: `http_${res.status}:${fallbackText || "request_failed"}`,
      };
    }

    const data = (await res.json()) as DeepSeekApiResponse;
    const rawText = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!rawText) {
      return {
        mode,
        answer: "模型未返回有效内容，请稍后再试。",
        error: "empty_response",
      };
    }

    const parsed = parseJsonWithRetry(rawText, 1);

    if (!parsed) {
      return {
        mode,
        answer: rawText,
        rawText,
        parsed: null,
        error: "json_parse_failed",
      };
    }

    const answer = typeof parsed.answer === "string" ? parsed.answer : rawText;

    return {
      mode,
      answer,
      rawText,
      parsed,
    };
  } catch (error) {
    return {
      mode,
      answer: "调用 DeepSeek 时发生网络异常，请稍后重试。",
      error: error instanceof Error ? error.message : "network_error",
    };
  }
}
