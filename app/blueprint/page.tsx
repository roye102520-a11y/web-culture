const iaBlocks = [
  {
    title: "顶层导航",
    items: ["首页", "分类", "名著", "考试", "榜单", "我的", "发布提问"],
  },
  {
    title: "首页核心模块",
    items: ["Hero Banner", "快捷标签", "内容广场", "阅读路径", "分类浏览"],
  },
  {
    title: "AI能力层",
    items: ["DeepSeek导读", "历史四段讲解", "典籍探疑快答", "考试答疑"],
  },
  {
    title: "用户资产层",
    items: ["点赞收藏", "提问回答", "排行榜", "个人中心沉淀"],
  },
];

const apiRows = [
  ["POST /api/ai/deepseek", "统一 AI 大脑入口", "mode + payload", "text/model/ragHits"],
  ["POST /api/history/explain", "四段历史讲解", "question + student_answer", "score + 四段结构化字段"],
  ["GET /api/history/health", "健康检查", "-", "ok/rag_docs/message"],
  ["GET /api/history/questions", "题库读取", "query", "questions[]"],
  ["GET /api/history/knowledge-nodes", "知识节点读取", "query", "nodes[]"],
];

const taskRows = [
  ["FE-HOME-001", "首页", "HeroBanner", "P0", "待排期"],
  ["FE-HOME-006", "首页", "三大专栏", "P0", "待排期"],
  ["BE-AI-001", "AI平台", "DeepSeek封装", "P0", "待排期"],
  ["BE-RAG-001", "AI平台", "RAG检索", "P0", "待排期"],
  ["FE-AI-004", "AI业务", "历史讲解四段卡", "P0", "待排期"],
];

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <section className="rounded-3xl bg-white/75 p-6 shadow-sm ring-1 ring-[#991B1B]/10 md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">文脉 PRD 可视化蓝图</h1>
          <p className="mt-2 text-sm text-[#57534E]">
            已根据你提供的产品定位与功能表同步：信息架构、AI能力、任务分解与里程碑。
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {iaBlocks.map((block) => (
            <article key={block.title} className="rounded-2xl bg-white/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#7F1D1D]">{block.title}</h2>
              <ul className="mt-3 space-y-1 text-sm text-[#57534E]">
                {block.items.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-white/85 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#7F1D1D]">AI 接口矩阵</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-[#57534E]">
                  <th className="py-2">接口</th>
                  <th className="py-2">用途</th>
                  <th className="py-2">入参</th>
                  <th className="py-2">出参</th>
                </tr>
              </thead>
              <tbody>
                {apiRows.map((row) => (
                  <tr key={row[0]} className="border-t border-[#e7e5e4]">
                    {row.map((cell) => (
                      <td key={cell} className="py-2 pr-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#7F1D1D]">研发里程碑</h2>
            <ol className="mt-3 space-y-2 text-sm text-[#57534E]">
              <li>1. M1 信息架构与页面骨架（3-4天）</li>
              <li>2. M2 首页模块化落地（4-6天）</li>
              <li>3. M3 AI平台层 + RAG（4-5天）</li>
              <li>4. M4 AI业务全流程（3-4天）</li>
              <li>5. M5 联调测试与上线（2-3天）</li>
            </ol>
          </article>

          <article className="rounded-2xl bg-white/85 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#7F1D1D]">功能任务看板</h2>
            <div className="mt-3 space-y-2">
              {taskRows.map((row) => (
                <div key={row[0]} className="rounded-xl bg-[#F7F6F2] px-3 py-2 text-sm">
                  <p className="font-medium text-[#1C1917]">{row[0]} · {row[2]}</p>
                  <p className="text-[#57534E]">{row[1]} · {row[3]} · {row[4]}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
