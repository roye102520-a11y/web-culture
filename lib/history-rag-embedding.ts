const EMBEDDING_DIMENSIONS = 256;
const PUNCTUATION_PATTERN = /[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~，。！？；：“”‘’、（）《》【】]/;

function hashToken(token: string) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function tokenizeChineseFriendly(text: string) {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  const tokens: string[] = [];

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    if (PUNCTUATION_PATTERN.test(char)) continue;
    tokens.push(char);

    const bigram = normalized.slice(index, index + 2);
    if (bigram.length === 2 && !PUNCTUATION_PATTERN.test(bigram)) {
      tokens.push(bigram);
    }

    const trigram = normalized.slice(index, index + 3);
    if (trigram.length === 3 && !PUNCTUATION_PATTERN.test(trigram)) {
      tokens.push(trigram);
    }
  }

  return tokens;
}

export function createLocalEmbedding(text: string) {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  const tokens = tokenizeChineseFriendly(text);

  for (const token of tokens) {
    const hash = hashToken(token);
    const index = hash % EMBEDDING_DIMENSIONS;
    const sign = hash % 2 === 0 ? 1 : -1;
    vector[index] += sign;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) return vector;

  return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator === 0 ? 0 : dot / denominator;
}
