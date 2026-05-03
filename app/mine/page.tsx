import { User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const myQuestions = [
  { id: "q-1", title: "唐代科举制度的演变？", time: "2026-04-21" },
  { id: "q-2", title: "王维山水诗里的禅意如何理解？", time: "2026-04-19" },
  { id: "q-3", title: "《史记》纪传体和编年体有何差异？", time: "2026-04-16" },
  { id: "q-4", title: "安史之乱后唐诗风格为何变化明显？", time: "2026-04-12" },
];

const myCollections = [
  {
    id: "c-1",
    title: "《红楼梦》第一回导读",
    summary: "从开篇神话结构切入，理解全书叙事框架与人物隐喻。",
  },
  {
    id: "c-2",
    title: "《资治通鉴》唐纪阅读地图",
    summary: "梳理关键年份与政治事件，帮助建立宏观时间线。",
  },
  {
    id: "c-3",
    title: "科举制度核心考点笔记",
    summary: "覆盖考试层级、取士机制与朝代差异，适合快速复盘。",
  },
];

const myMistakes = [
  {
    id: "m-1",
    question: "“贞观之治”发生于哪个朝代的哪位皇帝时期？",
    reason: "将唐太宗与唐玄宗混淆",
  },
  {
    id: "m-2",
    question: "“三省六部制”在隋唐时期主要作用是什么？",
    reason: "易错考点：机构职能记忆不清",
  },
  {
    id: "m-3",
    question: "王安石变法核心目标是什么？",
    reason: "易错考点：把“富国”与“强兵”因果顺序答反",
  },
  {
    id: "m-4",
    question: "《史记》与《汉书》体例差异有哪些？",
    reason: "忽略“纪传体”内部结构差异",
  },
];

export default function MinePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <section className="rounded-3xl bg-white/80 p-6 shadow-sm md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eeece9] md:h-24 md:w-24">
              <User className="h-9 w-9 text-[#78716C] md:h-10 md:w-10" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">文脉探索者</h1>
            <span className="mt-2 rounded-full bg-[#991B1B]/10 px-3 py-1 text-xs font-medium text-[#991B1B]">
              文化初学者
            </span>

            <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 md:text-base">
              <p>
                已沉淀时长：<span className="font-semibold text-red-800">32小时</span>
              </p>
              <p>
                提问次数：<span className="font-semibold text-red-800">15次</span>
              </p>
              <p>
                已收藏：<span className="font-semibold text-red-800">8篇</span>
              </p>
            </div>
          </div>

          <Tabs defaultValue="questions" className="mt-8">
            <div className="overflow-x-auto pb-1">
              <TabsList className="h-auto w-max min-w-full justify-start gap-1 rounded-xl bg-[#f6f3f1] p-1">
                <TabsTrigger
                  value="questions"
                  className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#991B1B] data-[state=active]:text-white"
                >
                  我的提问
                </TabsTrigger>
                <TabsTrigger
                  value="collections"
                  className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#991B1B] data-[state=active]:text-white"
                >
                  我的收藏
                </TabsTrigger>
                <TabsTrigger
                  value="mistakes"
                  className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#991B1B] data-[state=active]:text-white"
                >
                  我的错题
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="questions" className="mt-5">
              <div className="space-y-1 rounded-2xl bg-white/70 p-2">
                {myQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-4 last:border-none"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1C1917] md:text-base">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">提问时间：{item.time}</p>
                    </div>
                    <button type="button" className="shrink-0 text-sm text-[#991B1B] hover:text-[#7F1D1D]">
                      查看
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="collections" className="mt-5">
              <div className="space-y-1 rounded-2xl bg-white/70 p-2">
                {myCollections.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 px-3 py-4 last:border-none">
                    <p className="text-sm font-medium text-[#1C1917] md:text-base">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-500">{item.summary}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mistakes" className="mt-5">
              <div className="space-y-1 rounded-2xl bg-white/70 p-2">
                {myMistakes.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 px-3 py-4 last:border-none">
                    <p className="text-sm font-medium text-[#1C1917] md:text-base">{item.question}</p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs text-red-700">
                      易错考点 · {item.reason}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
