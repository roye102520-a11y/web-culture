import type { HistoryChunk, HistoryDocument } from "@/lib/history-rag-types";

const DEFAULT_CHUNK_SIZE = 320;
const DEFAULT_OVERLAP = 80;

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function chunkHistoryDocuments(
  documents: HistoryDocument[],
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP,
): HistoryChunk[] {
  const step = Math.max(1, chunkSize - overlap);

  return documents.flatMap((document) => {
    const normalized = normalizeText(document.content);
    const chunks: HistoryChunk[] = [];

    for (let start = 0, chunkIndex = 0; start < normalized.length; start += step, chunkIndex += 1) {
      const content = normalized.slice(start, start + chunkSize).trim();
      if (!content) continue;

      chunks.push({
        id: `${document.id}-chunk-${String(chunkIndex + 1).padStart(2, "0")}`,
        docId: document.id,
        title: document.title,
        content,
        metadata: {
          sourceType: document.sourceType,
          sourcePath: document.sourcePath,
          dynasty: document.dynasty,
          people: document.people,
          topics: document.topics,
          chunkIndex,
        },
      });

      if (start + chunkSize >= normalized.length) break;
    }

    return chunks;
  });
}

