export interface HistoryKnowledgeItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface HistoryRagResult {
  ragHits: string[];
}

const FALLBACK_CONTEXT = "暂未在典籍中查找到相关确切记载";

// 核心意图：构建基础文史知识 Mock 数据，为后续替换向量数据库预留接口。
const HISTORY_KNOWLEDGE_BASE: HistoryKnowledgeItem[] = [
  {
    id: "tang-001",
    title: "李白生平背景",
    content:
      "李白，字太白，唐代浪漫主义诗人，活动于盛唐时期，作品常体现豪放想象与个人精神追求。",
    keywords: ["李白", "太白", "盛唐", "浪漫主义", "诗人"],
  },
  {
    id: "tang-002",
    title: "杜甫历史定位",
    content:
      "杜甫被后世尊为诗圣，其诗作高度关注社会现实与民生疾苦，具有重要史料价值。",
    keywords: ["杜甫", "诗圣", "现实主义", "民生", "史料"],
  },
  {
    id: "tang-003",
    title: "王维山水诗特色",
    content:
      "王维兼具诗人与画家身份，山水田园诗强调空灵意境，常见禅意表达。",
    keywords: ["王维", "山水", "田园", "禅意", "诗画"],
  },
  {
    id: "tang-004",
    title: "安史之乱影响",
    content:
      "安史之乱是唐代由盛转衰的重要历史事件，持续多年并深刻影响政治、经济与文学创作。",
    keywords: ["安史之乱", "唐代", "由盛转衰", "历史事件", "文学"],
  },
];

// 核心意图：基于关键词匹配提供轻量检索能力，保障无向量库阶段也可联调。
export function searchHistoryContext(query: string): HistoryRagResult {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return { ragHits: [FALLBACK_CONTEXT] };
  }

  const ragHits = HISTORY_KNOWLEDGE_BASE.filter((item) =>
    item.keywords.some((keyword) => normalizedQuery.includes(keyword.toLowerCase())) ||
    item.content.toLowerCase().includes(normalizedQuery),
  ).map((item) => `【${item.title}】${item.content}`);

  return {
    ragHits: ragHits.length > 0 ? ragHits : [FALLBACK_CONTEXT],
  };
}
