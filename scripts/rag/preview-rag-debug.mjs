import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const vectorStorePath = path.join(rootDir, "data/rag/history-vector-store.json");
const port = Number(process.env.PORT ?? 3000);
const host = "127.0.0.1";
const embeddingDimensions = 256;
const punctuationPattern = /[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~，。！？；：“”‘’、（）《》【】]/;

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
  return vector.map((value) => value / magnitude);
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator === 0 ? 0 : dot / denominator;
}

async function search(query, topK) {
  const store = JSON.parse(await readFile(vectorStorePath, "utf8"));
  const queryEmbedding = createLocalEmbedding(query);

  const matches = store
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);

  return {
    ok: true,
    query,
    topK,
    ragHits: matches.map(({ chunk, score }, index) => {
      const topics = chunk.metadata.topics.length ? `主题：${chunk.metadata.topics.join("、")}` : "";
      return `【资料${index + 1}｜${chunk.title}｜相似度 ${score.toFixed(4)}】${topics}\n${chunk.content}`;
    }),
    citations: matches.map(({ chunk, score }) => ({
      title: chunk.title,
      docId: chunk.docId,
      chunkId: chunk.id,
      sourcePath: chunk.metadata.sourcePath,
      score: Number(score.toFixed(4)),
      metadata: chunk.metadata,
    })),
  };
}

function pageHtml() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WenMai RAG 调试</title>
  <style>
    body { margin: 0; background: #f5f5f4; color: #1c1917; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 20px; }
    h1 { margin: 0 0 6px; font-size: 26px; }
    p { line-height: 1.7; }
    textarea { width: 100%; min-height: 120px; box-sizing: border-box; border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; font-size: 15px; }
    button { border: 0; border-radius: 8px; padding: 10px 16px; background: #991b1b; color: white; cursor: pointer; }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .panel { background: white; border: 1px solid #efeae7; border-radius: 8px; padding: 16px; margin-top: 16px; }
    .samples { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
    .samples button { background: white; color: #57534e; border: 1px solid #e7e5e4; }
    .score { color: #78716c; font-size: 13px; }
    .hit { white-space: pre-wrap; line-height: 1.8; color: #57534e; }
  </style>
</head>
<body>
  <main>
    <h1>RAG 检索调试</h1>
    <p>输入一个文史问题，查看它命中的 Top K 向量知识片段。</p>
    <textarea id="query">李白为什么一直想进入政治中心？</textarea>
    <div class="samples">
      <button type="button" data-q="李白为什么一直想进入政治中心？">李白仕途</button>
      <button type="button" data-q="安史之乱如何影响杜甫诗歌？">杜甫与安史之乱</button>
      <button type="button" data-q="唐宋科举制度在选官逻辑上有什么变化？">唐宋科举</button>
      <button type="button" data-q="梁山招安为什么是水浒的关键转折？">梁山招安</button>
    </div>
    <button id="run" type="button">开始检索</button>
    <section id="result"></section>
  </main>
  <script>
    const query = document.querySelector("#query");
    const run = document.querySelector("#run");
    const result = document.querySelector("#result");
    document.querySelectorAll("[data-q]").forEach((button) => {
      button.addEventListener("click", () => { query.value = button.dataset.q; });
    });
    run.addEventListener("click", async () => {
      run.disabled = true;
      result.innerHTML = '<div class="panel">检索中...</div>';
      try {
        const response = await fetch("/api/history/rag-debug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.value, topK: 5 })
        });
        const data = await response.json();
        result.innerHTML = '<div class="panel"><strong>Query：</strong>' + data.query + '<br><span class="score">返回 ' + data.citations.length + ' 个片段</span></div>' +
          data.ragHits.map((hit, index) => '<article class="panel"><div class="score">score ' + data.citations[index].score + '</div><div class="hit">' + hit.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;") + '</div></article>').join("");
      } catch (error) {
        result.innerHTML = '<div class="panel">检索失败：' + error.message + '</div>';
      } finally {
        run.disabled = false;
      }
    });
  </script>
</body>
</html>`;
}

const server = createServer(async (request, response) => {
  if (request.url === "/admin/rag-debug" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(pageHtml());
    return;
  }

  if (request.url === "/api/history/rag-debug" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    const result = await search(String(body.query ?? ""), Math.min(Math.max(Number(body.topK ?? 5), 1), 10));
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(result));
    return;
  }

  response.writeHead(302, { Location: "/admin/rag-debug" });
  response.end();
});

server.listen(port, host, () => {
  console.log(`RAG debug preview ready: http://${host}:${port}/admin/rag-debug`);
});

