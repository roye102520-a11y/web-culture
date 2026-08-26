import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const documentsPath = path.join(rootDir, "data/rag/history-documents.json");
const outputPath = path.join(rootDir, "data/rag/history-vector-store.json");
const chunkSize = 320;
const overlap = 80;
const embeddingDimensions = 256;
const punctuationPattern = /[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~，。！？；：“”‘’、（）《》【】]/;

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function chunkDocuments(documents) {
  const step = Math.max(1, chunkSize - overlap);

  return documents.flatMap((document) => {
    const normalized = normalizeText(document.content);
    const chunks = [];

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

function hashToken(token) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function tokenizeChineseFriendly(text) {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  const tokens = [];

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    if (punctuationPattern.test(char)) continue;
    tokens.push(char);

    const bigram = normalized.slice(index, index + 2);
    if (bigram.length === 2 && !punctuationPattern.test(bigram)) tokens.push(bigram);

    const trigram = normalized.slice(index, index + 3);
    if (trigram.length === 3 && !punctuationPattern.test(trigram)) tokens.push(trigram);
  }

  return tokens;
}

function createLocalEmbedding(text) {
  const vector = new Array(embeddingDimensions).fill(0);
  const tokens = tokenizeChineseFriendly(text);

  for (const token of tokens) {
    const hash = hashToken(token);
    const index = hash % embeddingDimensions;
    const sign = hash % 2 === 0 ? 1 : -1;
    vector[index] += sign;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) return vector;
  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

const documents = JSON.parse(await readFile(documentsPath, "utf8"));
const vectorStore = chunkDocuments(documents).map((chunk) => ({
  ...chunk,
  embedding: createLocalEmbedding(
    `${chunk.title} ${chunk.metadata.dynasty} ${chunk.metadata.people.join(" ")} ${chunk.metadata.topics.join(" ")} ${chunk.content}`,
  ),
}));

await writeFile(outputPath, `${JSON.stringify(vectorStore, null, 2)}\n`);

console.log(`Built ${vectorStore.length} vector chunks -> ${path.relative(rootDir, outputPath)}`);
