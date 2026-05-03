export type RankingBoard = "free" | "paid";
export type RankingTopic = "all" | "history" | "poetry" | "idiom";
export type RankingDynasty = "all" | "tang" | "song" | "ming-qing";

export interface RankingItem {
  id: string;
  name: string;
  badge: string;
  score: number;
  replyRate: number;
  averageReplyHours: number;
  board: RankingBoard;
  topic: Exclude<RankingTopic, "all">;
  dynasty: Exclude<RankingDynasty, "all">;
}

export interface RankingQuery {
  board: RankingBoard;
  topic: RankingTopic;
  dynasty: RankingDynasty;
  limit?: number;
}

export interface RankingResult {
  items: RankingItem[];
  total: number;
}

const RANKING_DATA: RankingItem[] = [
  { id: "free-1", name: "李明", badge: "文化点·大师", score: 9.8, replyRate: 98, averageReplyHours: 3.2, board: "free", topic: "history", dynasty: "tang" },
  { id: "free-2", name: "王芳", badge: "文化点·资深", score: 9.5, replyRate: 95, averageReplyHours: 4.1, board: "free", topic: "poetry", dynasty: "song" },
  { id: "free-3", name: "Dr.Chen", badge: "学历认证", score: 9.3, replyRate: 92, averageReplyHours: 5.0, board: "free", topic: "history", dynasty: "tang" },
  { id: "free-4", name: "赵雷", badge: "文化点·进阶", score: 9.0, replyRate: 90, averageReplyHours: 6.2, board: "free", topic: "idiom", dynasty: "ming-qing" },
  { id: "free-5", name: "钱玄", badge: "国学普及", score: 8.8, replyRate: 85, averageReplyHours: 8.5, board: "free", topic: "poetry", dynasty: "song" },
  { id: "paid-1", name: "苏清", badge: "文化点·大师", score: 9.9, replyRate: 99, averageReplyHours: 2.1, board: "paid", topic: "history", dynasty: "tang" },
  { id: "paid-2", name: "顾宁", badge: "学术委员会", score: 9.6, replyRate: 96, averageReplyHours: 3.4, board: "paid", topic: "poetry", dynasty: "song" },
  { id: "paid-3", name: "白洛", badge: "名家认证", score: 9.2, replyRate: 91, averageReplyHours: 4.8, board: "paid", topic: "idiom", dynasty: "ming-qing" },
];

export function queryRankings({ board, topic, dynasty, limit = 10 }: RankingQuery): RankingResult {
  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 20)) : 10;

  const items = RANKING_DATA.filter((item) => {
    const matchBoard = item.board === board;
    const matchTopic = topic === "all" || item.topic === topic;
    const matchDynasty = dynasty === "all" || item.dynasty === dynasty;
    return matchBoard && matchTopic && matchDynasty;
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, normalizedLimit);

  return { items, total: items.length };
}


export function getHomepageTopRankings(limit = 3): RankingItem[] {
  return RANKING_DATA.filter((item) => item.board === "free")
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(limit, 6)));
}
