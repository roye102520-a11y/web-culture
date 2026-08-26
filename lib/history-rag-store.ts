import historyDocuments from "@/data/rag/history-documents.json";
import vectorStore from "@/data/rag/history-vector-store.json";
import { chunkHistoryDocuments } from "@/lib/history-rag-chunking";
import { createLocalEmbedding } from "@/lib/history-rag-embedding";
import type { HistoryDocument, HistoryVectorRecord } from "@/lib/history-rag-types";

export function buildHistoryVectorStore(documents: HistoryDocument[]) {
  return chunkHistoryDocuments(documents).map((chunk) => ({
    ...chunk,
    embedding: createLocalEmbedding(
      `${chunk.title} ${chunk.metadata.dynasty} ${chunk.metadata.people.join(" ")} ${chunk.metadata.topics.join(" ")} ${chunk.content}`,
    ),
  }));
}

export function getHistoryDocuments() {
  return historyDocuments as HistoryDocument[];
}

export function getHistoryVectorStore() {
  const store = vectorStore as HistoryVectorRecord[];

  if (store.length > 0) {
    return store;
  }

  return buildHistoryVectorStore(getHistoryDocuments());
}

