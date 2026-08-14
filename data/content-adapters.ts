import contentLibrary from "@/data/content-library.json";
import examLibrary from "@/data/exam-questions.json";
import type { ContentCoverTheme } from "@/components/ui/ContentCover";

export type RawContent = {
  id: number;
  title: string;
  content: string;
  type: "article" | "video" | "podcast";
  category: string;
  tags: string;
  difficulty: string;
  image: string;
  source: string;
};

export type RawExam = {
  id: number;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  analysis: string;
  exam_type: string;
  knowledge_point: string;
  difficulty: string;
  tags: string;
  language: string;
};

type ExamDifficulty = "简单" | "中等" | "困难";
type Dynasty = "唐" | "宋" | "元" | "明" | "清";
type ContentTypeCN = "长文" | "视频" | "播客";

function isRawContentArray(value: unknown): value is RawContent[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return (
        typeof row.id === "number" &&
        typeof row.title === "string" &&
        typeof row.content === "string" &&
        (row.type === "article" || row.type === "video" || row.type === "podcast") &&
        typeof row.category === "string" &&
        typeof row.tags === "string" &&
        typeof row.difficulty === "string" &&
        typeof row.image === "string" &&
        typeof row.source === "string"
      );
    })
  );
}

function isRawExamArray(value: unknown): value is RawExam[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return (
        typeof row.id === "number" &&
        typeof row.title === "string" &&
        typeof row.optionA === "string" &&
        typeof row.optionB === "string" &&
        typeof row.optionC === "string" &&
        typeof row.optionD === "string" &&
        (row.answer === "A" || row.answer === "B" || row.answer === "C" || row.answer === "D") &&
        typeof row.analysis === "string" &&
        typeof row.exam_type === "string" &&
        typeof row.knowledge_point === "string" &&
        typeof row.difficulty === "string" &&
        typeof row.tags === "string" &&
        typeof row.language === "string"
      );
    })
  );
}

const rawContents = isRawContentArray(contentLibrary) ? contentLibrary : [];
const rawExams = isRawExamArray(examLibrary) ? examLibrary : [];

const themeByCategory: Record<string, ContentCoverTheme> = {
  红楼梦: "lantern",
  三国演义: "palace",
  水浒传: "landscape",
  西游记: "mountain",
  剧说古今: "drama",
  八卦来了: "tea",
  典籍探疑: "scroll",
  首页内容: "calligraphy",
  分类浏览: "bronze",
};

const typeMap = { article: "长文", video: "视频", podcast: "播客" } as const;

export type ContentRecord = RawContent & { theme: ContentCoverTheme; contentTypeCN: ContentTypeCN };

export const allContentRecords: ContentRecord[] = rawContents.map((item) => ({
  ...item,
  theme: themeByCategory[item.category] ?? "scroll",
  contentTypeCN: typeMap[item.type],
}));

export const latestContentFromCsv = rawContents
  .filter((item) => item.category === "首页内容")
  .map((item) => ({
    id: `csv-${item.id}`,
    title: item.title,
    desc: item.content,
    type: typeMap[item.type],
    theme: themeByCategory[item.category] ?? "scroll",
    url: `/content/${item.id}`,
    publishedAt: "2026.04.29",
    playCount: 12000 + item.id * 137,
  }));

export const classicsContentFromCsv = {
  红楼梦: rawContents.filter((item) => item.category === "红楼梦"),
  三国演义: rawContents.filter((item) => item.category === "三国演义"),
  水浒传: rawContents.filter((item) => item.category === "水浒传"),
  西游记: rawContents.filter((item) => item.category === "西游记"),
};

export const selectedFeedFromCsv = rawContents
  .filter((item) => ["典籍探疑", "剧说古今", "八卦来了"].includes(item.category))
  .slice(0, 12)
  .map((item) => ({
    id: `csv-${item.id}`,
    title: item.title,
    desc: item.content,
    type: "视频" as const,
    theme: themeByCategory[item.category] ?? "scroll",
    likes: 3000 + item.id * 120,
    collects: 1800 + item.id * 80,
    comments: 60 + item.id * 5,
    views: 10000 + item.id * 310,
    url: `/content/${item.id}`,
  }));

export const categoryContentFromCsv = rawContents
  .filter((item) => item.category === "分类浏览")
  .map((item) => {
    const [dynasty, maybeType] = item.tags.split("-");
    const type = maybeType?.includes("成语")
      ? "成语"
      : maybeType?.includes("官制") || maybeType?.includes("制度") || maybeType?.includes("政治")
        ? "历史"
        : "历史";
    return {
      id: `csv-${item.id}`,
      dynasty: (["唐", "宋", "元", "明", "清"].includes(dynasty) ? dynasty : "唐") as "唐" | "宋" | "元" | "明" | "清",
      contentType: type as "成语" | "新词" | "影视" | "历史",
      title: item.title,
      desc: item.content,
      theme: themeByCategory[item.category] ?? "bronze",
      likes: 2200 + item.id * 90,
      collects: 900 + item.id * 35,
      url: `/content/${item.id}`,
    };
  });

export const examQuestionsFromCsv = rawExams.map((item) => {
  const difficultyMap: Record<string, ExamDifficulty> = {
    易: "简单",
    Easy: "简单",
    中: "中等",
    Medium: "中等",
    难: "困难",
    Hard: "困难",
  };
  const text = `${item.title}`;
  const dynasty =
    /唐/.test(text) ? "唐" : /宋/.test(text) ? "宋" : /元/.test(text) ? "元" : /明/.test(text) ? "明" : /清/.test(text) ? "清" : "唐";
  return {
    id: `csv-q-${item.id}`,
    dynasty: dynasty as Dynasty,
    difficulty: difficultyMap[item.difficulty] ?? "中等",
    text: item.title,
    options: [
      { key: "A" as const, text: item.optionA },
      { key: "B" as const, text: item.optionB },
      { key: "C" as const, text: item.optionC },
      { key: "D" as const, text: item.optionD },
    ],
    correct: item.answer,
    analysis: item.analysis,
  };
});

export function getContentById(id: string) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;
  return allContentRecords.find((item) => item.id === numericId) ?? null;
}
