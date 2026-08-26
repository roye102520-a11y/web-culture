import { cosineSimilarity, createLocalEmbedding } from "@/lib/history-rag-embedding";
import { getHistoryVectorStore } from "@/lib/history-rag-store";
import type { HistoryCitation, HistoryRagResult } from "@/lib/history-rag-types";

const FALLBACK_CONTEXT = "暂未在知识库中查找到相关确切资料";
const DEFAULT_TOP_K = 5;

function buildRetrievalText(query: string) {
  return query.trim().toLowerCase();
}

export async function searchHistoryContext(query: string, topK = DEFAULT_TOP_K): Promise<HistoryRagResult> {
  const normalizedQuery = buildRetrievalText(query);

  if (!normalizedQuery) {
    return { ragHits: [FALLBACK_CONTEXT], citations: [] };
  }

  const queryEmbedding = createLocalEmbedding(normalizedQuery);
  const vectorStore = getHistoryVectorStore();

  const matches = vectorStore
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);

  if (matches.length === 0) {
    return { ragHits: [FALLBACK_CONTEXT], citations: [] };
  }

  const citations: HistoryCitation[] = matches.map(({ chunk, score }) => ({
    title: chunk.title,
    docId: chunk.docId,
    chunkId: chunk.id,
    sourcePath: chunk.metadata.sourcePath,
    score: Number(score.toFixed(4)),
    metadata: chunk.metadata,
  }));

  return {
    ragHits: matches.map(({ chunk, score }, index) => {
      const citationNo = index + 1;
      const topics = chunk.metadata.topics.length ? `主题：${chunk.metadata.topics.join("、")}` : "";
      return `【资料${citationNo}｜${chunk.title}｜相似度 ${score.toFixed(4)}】${topics}\n${chunk.content}`;
    }),
    citations,
  };
}
