import { notFound } from "next/navigation";
import Link from "next/link";

import { ContentCover } from "@/components/ui/ContentCover";
import { getContentById } from "@/data/content-adapters";
import { getContentExternalUrl } from "@/lib/external-links";

interface Props {
  params: Promise<{ id: string }>;
}

function buildReadableIntro(content: NonNullable<ReturnType<typeof getContentById>>) {
  if (content.category === "首页内容" || content.category === "分类浏览") {
    return `这篇内容以“${content.title}”为入口，用社科通识读物的方式梳理历史现象：先解释时代结构，再进入制度、社会和观念层面的因果关系。`;
  }
  if (content.category === "剧说古今") {
    return `这篇文章用“剧情线索 + 真实历史 + 改编边界”的方式解释《${content.tags}》相关问题，帮助你分清哪些是史实、哪些是戏剧化处理。`;
  }
  if (content.category === "八卦来了") {
    return `这篇文章把一个看似轻松的历史趣闻讲清楚：先说流行说法，再回到人物处境、生活习俗和材料可信度。`;
  }
  if (content.category === "典籍探疑") {
    return `这篇文章适合带着“证据从哪里来”去读：先给判断，再拆解史料、版本差异和仍需保留的不确定性。`;
  }
  if (["红楼梦", "三国演义", "水浒传", "西游记"].includes(content.category)) {
    return `这篇文章围绕《${content.category}》的一个具体切口展开，先帮你抓住人物、情节和文化含义，再回到原著阅读。`;
  }
  return `这篇文章围绕“${content.title}”建立一条清晰学习路径：先看结论，再看背景，最后知道还能继续追问什么。`;
}

function buildTakeaway(content: NonNullable<ReturnType<typeof getContentById>>) {
  if (/安史之乱/.test(content.title)) {
    return "安史之乱不是单一叛乱事件，而是唐代财政、军镇、边防和中央权力结构长期累积矛盾的一次爆发。";
  }
  if (/科举/.test(content.title)) {
    return "科举的关键不只是考试本身，而是它改变了读书、家族投资、士人身份和国家选官之间的关系。";
  }
  if (/红楼|潇湘|黛玉|宝玉|宝钗/.test(content.title)) {
    return "读《红楼梦》不能只看情节，还要把人物情感放回家族秩序、空间美学和礼法压力中理解。";
  }
  if (/李白|杜甫|苏轼|诗/.test(content.title)) {
    return "诗人故事的重点不是补一段传奇对白，而是看他们在时代、仕途和文学理想之间如何选择。";
  }
  if (/甄嬛|宫|王朝|影视|剧/.test(content.title)) {
    return "影视作品常借用历史框架塑造戏剧冲突，阅读时要把人物原型、制度背景和艺术虚构分开。";
  }
  return content.content;
}

function detectDynasty(content: NonNullable<ReturnType<typeof getContentById>>) {
  const raw = `${content.title} ${content.tags} ${content.content}`;
  if (/唐|长安|安史|李白|杜甫|武则天|贞观|五代/.test(raw)) return "唐";
  if (/宋|汴梁|临安|苏轼|王安石|朱熹|水浒|岳飞|士大夫/.test(raw)) return "宋";
  if (/元|蒙古|忽必烈|行省|大都|杂剧/.test(raw)) return "元";
  if (/明|朱元璋|永乐|王阳明|张居正|白银|东林|锦衣卫/.test(raw)) return "明";
  if (/清|康熙|雍正|乾隆|红楼|台湾|郑成功|鸦片|晚清/.test(raw)) return "清";
  return "唐宋元明清";
}

function buildComicFlow(content: NonNullable<ReturnType<typeof getContentById>>) {
  if (/安史之乱/.test(content.title)) {
    return [
      { title: "1. 原因", body: "从朝政失衡、边镇坐大、财政压力和人事任用切入，不把事件简化成某一个人的野心。" },
      { title: "2. 过程", body: "按范阳起兵、潼关失守、玄宗入蜀、肃宗即位、平定叛乱的线索建立时间轴。" },
      { title: "3. 影响", body: "重点看唐朝由盛转衰、藩镇割据、中央财政与地方控制力变化。" },
    ];
  }
  if (/科举|考试|考点|刷题|选官/.test(content.title)) {
    return [
      { title: "1. 审题", body: "先判断题目问的是制度功能、社会影响，还是人物上升路径。" },
      { title: "2. 找线索", body: "把时间、群体、选官方式、教育投入这些关键词连成证据链。" },
      { title: "3. 复盘", body: "答完后归纳成“制度如何改变社会流动”的可迁移表达。" },
    ];
  }
  if (/红楼|黛玉|宝玉|宝钗|大观园|家族/.test(content.title)) {
    return [
      { title: "1. 人物", body: "先看人物在家族秩序中的位置，不急着只判断谁对谁错。" },
      { title: "2. 空间", body: "把大观园、贾府礼法、诗社和日常生活看成情感压力的舞台。" },
      { title: "3. 读法", body: "从细节回到主题：家族兴衰、个体情感与制度边界。" },
    ];
  }
  if (/甄嬛|影视|剧|宫/.test(content.title)) {
    return [
      { title: "1. 剧情", body: "先抓住作品想制造的冲突：人物关系、权力选择和情绪转折。" },
      { title: "2. 史实", body: "再区分真实制度、人物原型和为了戏剧效果做出的改编。" },
      { title: "3. 对照", body: "最后判断：这段剧情借了哪些历史外壳，又改变了哪些历史逻辑。" },
    ];
  }
  return [
    { title: "1. 入口", body: "先用标题确定核心问题，知道这篇内容是在解释人物、制度、事件还是典籍。" },
    { title: "2. 证据", body: "再看关键词、材料来源与时代背景，避免只记一个孤立结论。" },
    { title: "3. 迁移", body: "最后把它转成可复述的一段话，能用于考试、讨论或短视频导读。" },
  ];
}

function buildArticleSections(content: NonNullable<ReturnType<typeof getContentById>>) {
  const dynasty = detectDynasty(content);
  const base = content.content;

  return [
    {
      title: "核心问题",
      body: `${base} 这篇文章首先要回答的不是“记住一个知识点”，而是理解它为什么会在${dynasty}历史中出现：它回应了什么压力，改变了哪些人的行动方式，又怎样留下可追踪的后果。`,
    },
    {
      title: "时代结构",
      body: `阅读${dynasty}史，不能把事件孤立成帝王将相的选择。更稳妥的读法，是同时观察国家财政、军事组织、官僚选拔、地方社会和文化传播。许多看似偶然的人物转折，背后往往有制度成本和社会资源重新分配。`,
    },
    {
      title: "制度与社会",
      body: `把“${content.tags}”放进制度史中看，可以看到国家如何把权力落实到土地、户籍、考试、军队、交通和地方精英身上；放进社会史中看，则能看到普通人、家族、城市和区域网络如何承受或利用这些制度。`,
    },
    {
      title: "材料边界",
      body: `这类内容适合用“史料事实、后世叙事、现代解释”三层区分。史料能帮助确认基本过程，后世叙事会强化人物形象，现代解释则负责提出结构性问题。三者都重要，但不能混成同一种证据。`,
    },
    {
      title: "阅读延展",
      body: `下一步可以沿三条线继续读：第一，找同一朝代的相邻事件做时间线；第二，把同类制度放到唐、宋、元、明、清之间比较；第三，用一段话复述它的因果链，形成可用于讨论、写作和考试迁移的表达。`,
    },
  ];
}

function buildFullArticleParagraphs(content: NonNullable<ReturnType<typeof getContentById>>) {
  const dynasty = detectDynasty(content);
  const categoryGuide =
    content.category === "剧说古今"
      ? "影视内容最容易把历史背景、人物原型和戏剧冲突混在一起。阅读这类文章时，重点不是挑错，而是知道作品借用了哪些历史结构，又在哪里为了情绪、节奏和人物成长做了改写。"
      : content.category === "八卦来了"
        ? "轻松题目也可以有严肃读法。越是流传广的趣闻，越要把材料来源、人物处境和后世想象分开，才不会只停留在猎奇结论里。"
        : content.category === "典籍探疑"
          ? "典籍问题的重点，是把证据链摆出来。哪些来自原文，哪些来自注疏，哪些是后人解释，哪些暂时不能断定，都应该在阅读时分层处理。"
          : ["红楼梦", "三国演义", "水浒传", "西游记"].includes(content.category)
            ? `读《${content.category}》不能只看情节热闹，还要把人物放回原著的社会秩序、叙事结构和价值冲突中。这样才能看见人物为什么这样选择，也能看见作品为什么反复写这些选择。`
            : "历史内容不宜只背结论。更可靠的读法，是把事件放进制度、地理、财政、社会关系和人物处境里，看它为什么发生，又怎样影响后来的人。";

  return [
    content.content,
    `围绕“${content.title}”，可以先抓住一个核心问题：它不是孤立知识点，而是${dynasty}历史与文化经验中的一个观察口。标题里的关键词“${content.tags}”提示我们，文章需要同时解释事实、结构和人的处境。`,
    categoryGuide,
    "如果把它放到文脉的整体内容里，它承担的是一篇可继续追问的入口文章：先让读者知道发生了什么，再提示哪些说法需要谨慎，最后把问题引向更大的阅读路径。",
    "因此，这篇内容适合用三步读完：第一遍看主线，第二遍看人物和制度如何互相牵动，第三遍带着自己的问题继续问 AI 或跳转到相关视频、图文材料。这样链接打开后不只是摘要，而是一段可以继续学习的正文导读。",
  ].filter(Boolean);
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const content = getContentById(id);

  if (!content) {
    notFound();
  }

  const intro = buildReadableIntro(content);
  const takeaway = buildTakeaway(content);
  const comicFlow = buildComicFlow(content);
  const articleSections = buildArticleSections(content);
  const fullArticleParagraphs = buildFullArticleParagraphs(content);

  return (
    <div className="min-h-screen bg-[#f4ead7] bg-[radial-gradient(circle_at_12%_8%,rgba(255,250,235,0.9),transparent_26%),radial-gradient(circle_at_88%_20%,rgba(177,65,44,0.10),transparent_25%)]">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <article className="space-y-5 rounded-[18px] border-2 border-[#2b2016] bg-[#fff7e7] p-4 shadow-[0_18px_50px_rgba(43,32,22,0.15)] md:p-6">
          <ContentCover theme={content.theme} title={content.title} badge={content.contentTypeCN} className="aspect-[16/8] rounded-xl border-2 border-[#2b2016]" />
          <header className="space-y-4">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-lg border-2 border-[#2b2016] bg-[#f3dba7] px-5 py-2 shadow-[0_6px_0_rgba(43,32,22,0.12)]">
              <span className="h-7 w-3 rounded-full bg-[#b9935b]" aria-hidden="true" />
              <span className="text-sm font-black text-[#2b2016] md:text-base">文脉图解导读</span>
              <span className="h-7 w-3 rounded-full bg-[#b9935b]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-black leading-9 text-[#1C1917] md:text-3xl md:leading-10">{content.title}</h1>
            <p className="rounded-xl border border-[#d6bd84] bg-[#fffdf5] px-4 py-3 text-base font-medium leading-8 text-[#4b4036]">{intro}</p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#5f5146]">
              <span className="rounded-full border border-[#d6bd84] bg-[#fffdf5] px-2.5 py-1">分类：{content.category}</span>
              <span className="rounded-full border border-[#d6bd84] bg-[#fffdf5] px-2.5 py-1">标签：{content.tags}</span>
              <span className="rounded-full border border-[#d6bd84] bg-[#fffdf5] px-2.5 py-1">难度：{content.difficulty}</span>
              <span className="rounded-full border border-[#d6bd84] bg-[#fffdf5] px-2.5 py-1">来源：{content.source}</span>
            </div>
          </header>

          <section className="rounded-xl border-2 border-[#2b2016] bg-[#fffdf5] p-4">
            <h2 className="text-lg font-black text-[#2b2016]">三格看懂</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {comicFlow.map((step) => (
                <div key={step.title} className="rounded-lg border border-[#d6bd84] bg-[#fff7e7] p-3">
                  <div className="w-fit rounded-md border border-[#2b2016] bg-[#f3dba7] px-3 py-1 text-sm font-black text-[#2b2016]">{step.title}</div>
                  <p className="mt-2 text-sm font-medium leading-7 text-[#5f5146]">{step.body}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            {articleSections.map((section, index) => (
              <section key={section.title} className="relative rounded-xl border border-[#d6bd84] bg-[#fffdf5] px-4 py-4">
                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2b2016] bg-[#b13a2c] text-sm font-black text-white">
                  {index + 1}
                </div>
                <h2 className="pl-5 text-base font-black text-[#991B1B]">{section.title}</h2>
                <p className="mt-2 text-sm font-medium leading-7 text-[#57534E] md:text-[15px] md:leading-8">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="rounded-xl border-2 border-[#2b2016] bg-[#fffdf5] p-4">
            <h2 className="text-lg font-black text-[#2b2016]">完整正文</h2>
            <div className="mt-3 space-y-3">
              {fullArticleParagraphs.map((paragraph, index) => (
                <p key={`${content.id}-body-${index}`} className="text-sm font-medium leading-7 text-[#57534E] md:text-[15px] md:leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`/look/deepseek?q=${encodeURIComponent(content.title)}`} className="rounded-xl border-2 border-[#2b2016] bg-[#991B1B] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_rgba(43,32,22,0.16)] hover:bg-[#7F1D1D]">
              继续问 DeepSeek
            </Link>
            <a
              href={getContentExternalUrl(content.contentTypeCN, content.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-[#2b2016] bg-[#fffdf5] px-4 py-2 text-sm font-bold text-[#57534E] hover:text-[#1C1917]"
            >
              查找外部视频 / 图文
            </a>
            <Link href="/" className="rounded-xl border-2 border-[#2b2016] bg-[#fffdf5] px-4 py-2 text-sm font-bold text-[#57534E] hover:text-[#1C1917]">
              返回首页
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
