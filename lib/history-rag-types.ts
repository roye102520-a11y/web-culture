export interface HistoryDocument {
  id: string;
  title: string;
  sourceType: string;
  sourcePath: string;
  dynasty: string;
  people: string[];
  topics: string[];
  content: string;
}

export interface HistoryChunkMetadata {
  sourceType: string;
  sourcePath: string;
  dynasty: string;
  people: string[];
  topics: string[];
  chunkIndex: number;
}

export interface HistoryChunk {
  id: string;
  docId: string;
  title: string;
  content: string;
  metadata: HistoryChunkMetadata;
}

export interface HistoryVectorRecord extends HistoryChunk {
  embedding: number[];
}

export interface HistoryCitation {
  title: string;
  docId: string;
  chunkId: string;
  sourcePath: string;
  score: number;
  metadata: HistoryChunkMetadata;
}

export interface HistoryRagResult {
  ragHits: string[];
  citations: HistoryCitation[];
}

