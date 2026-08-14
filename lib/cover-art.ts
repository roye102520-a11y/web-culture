import type { ContentCoverTheme } from "@/components/ui/ContentCover";

type CoverPalette = {
  bg: string;
  bg2: string;
  accent: string;
  accent2: string;
  ink: string;
  paper: string;
};

export type CoverMotif =
  | "exam"
  | "tangConflict"
  | "honglou"
  | "poets"
  | "war"
  | "palace"
  | "bamboo"
  | "books"
  | "city"
  | "drama"
  | "landscape"
  | "bronze"
  | "tea";

export const COVER_PALETTES: Record<ContentCoverTheme, CoverPalette> = {
  palace: { bg: "#efe3d4", bg2: "#caa98a", accent: "#8f2f1f", accent2: "#d7a84f", ink: "#2c1812", paper: "#fff8ee" },
  greatwall: { bg: "#d9e4dc", bg2: "#8ba494", accent: "#475f4f", accent2: "#c2934b", ink: "#1f2a24", paper: "#f7f3e8" },
  scroll: { bg: "#f3e7c8", bg2: "#d0b378", accent: "#81552c", accent2: "#b9412c", ink: "#2b2016", paper: "#fff9ea" },
  lantern: { bg: "#f5d6cf", bg2: "#b85044", accent: "#9b1c1c", accent2: "#e7b657", ink: "#341414", paper: "#fff6ee" },
  landscape: { bg: "#dbe8dd", bg2: "#8cae95", accent: "#315d45", accent2: "#b28b47", ink: "#1c2922", paper: "#f8f2e6" },
  drama: { bg: "#eadff1", bg2: "#9b79b1", accent: "#5a2a71", accent2: "#d3a144", ink: "#24142f", paper: "#faf2ff" },
  calligraphy: { bg: "#eee9df", bg2: "#b8afa0", accent: "#202020", accent2: "#9f2f25", ink: "#181716", paper: "#fbf7ee" },
  mountain: { bg: "#d9e8e5", bg2: "#82aaa2", accent: "#255a59", accent2: "#d09c48", ink: "#152d2d", paper: "#f7f4ea" },
  bronze: { bg: "#e2dccb", bg2: "#9b9876", accent: "#596032", accent2: "#b7833e", ink: "#232818", paper: "#faf5e6" },
  tea: { bg: "#e3ead2", bg2: "#9eaf73", accent: "#55632d", accent2: "#be8a43", ink: "#252b18", paper: "#fbf6e8" },
};

export function getCoverMotif(title = "", theme: ContentCoverTheme): CoverMotif {
  if (/安史之乱|安禄山|史思明|唐玄宗|杨贵妃|马嵬/.test(title)) return "tangConflict";
  if (/科举|考试|考点|刷题|选官/.test(title)) return "exam";
  if (/红楼|潇湘|黛玉|宝玉|宝钗|大观园|家族/.test(title)) return "honglou";
  if (/李白|杜甫|苏轼|诗人|诗词/.test(title)) return "poets";
  if (/安史|赤壁|战争|边防|军|战|关口/.test(title)) return "war";
  if (/甄嬛|雍正|乾隆|宫|皇|王朝|大明/.test(title)) return "palace";
  if (/竹书|秦简|简牍|里耶|文字/.test(title)) return "bamboo";
  if (/史记|通鉴|汉书|四书|诗经|典籍|艺文志/.test(title)) return "books";
  if (/天津|城市|地方志|府志|港埠|商贸/.test(title)) return "city";

  if (theme === "drama") return "drama";
  if (theme === "bronze") return "bronze";
  if (theme === "tea") return "tea";
  if (theme === "landscape" || theme === "mountain" || theme === "greatwall") return "landscape";
  if (theme === "palace" || theme === "lantern") return "palace";
  return "books";
}

export type CoverFormat = "square" | "banner" | "poster";

const STATIC_COVER_RULES: Array<{ pattern: RegExp; url: string }> = [
  { pattern: /唐代文化速读|唐朝.*盛世|唐朝贞观之治|贞观之治|开元|盛唐/, url: "/images/covers/tang-culture-overview.png" },
  { pattern: /宋代文化速读|宋朝经济|宋朝.*巅峰|宋代.*日常|宋代.*文化|宋代新词汇|宋代士人|士人精神|士人网络/, url: "/images/covers/song-culture-overview.png" },
  { pattern: /元代文化速读|元朝|元代|行省制度|行省/, url: "/images/covers/yuan-culture-overview.png" },
  { pattern: /明代文化速读|明朝.*形成|明朝.*制度|明朝宦官|明朝锦衣卫|锦衣卫|大明王朝1566|嘉靖朝/, url: "/images/covers/ming-culture-overview.png" },
  { pattern: /清代文化速读|清朝|八旗|闭关锁国|乾隆身世|延禧/, url: "/images/covers/qing-culture-overview.png" },
  { pattern: /黄巾|东汉末年|社会危机/, url: "/images/covers/yellow-turban.png" },
  { pattern: /安史之乱|安禄山|史思明|唐玄宗|杨贵妃|马嵬/, url: "/images/covers/anshi-rebellion.png" },
  { pattern: /赤壁|借东风/, url: "/images/covers/chibi-battle.png" },
  { pattern: /玄武门|李世民/, url: "/images/covers/xuanwu-gate.png" },
  { pattern: /科举|考试|选官|社会流动/, url: "/images/covers/imperial-exam.png" },
  { pattern: /三省六部/, url: "/images/covers/three-departments-six-ministries.png" },
  { pattern: /郡县|县治|秦汉治理|秦始皇/, url: "/images/covers/commandery-county.png" },
  { pattern: /王安石|变法/, url: "/images/covers/wang-anshi-reform.png" },
  { pattern: /李白|杜甫|洛阳相遇/, url: "/images/covers/libai-dufu-luoyang.png" },
  { pattern: /苏轼/, url: "/images/covers/su-shi-resilience.png" },
  { pattern: /张骞|西域/, url: "/images/covers/zhang-qian-western-regions.png" },
  { pattern: /红楼|黛玉|宝玉|宝钗|金陵十二钗|贾府|大观园|潇湘馆|四大家族/, url: "/images/covers/dream-red-mansion-family.png" },
  { pattern: /三国|诸葛亮|曹操|刘备/, url: "/images/covers/romance-three-kingdoms.png" },
  { pattern: /西游|孙悟空|取经/, url: "/images/covers/journey-west-team.png" },
  { pattern: /水浒|梁山|宋江|招安/, url: "/images/covers/water-margin-society.png" },
  { pattern: /甄嬛|雍正|乾隆|延禧|清朝|八旗|闭关锁国/, url: "/images/covers/zhenhuan-history.png" },
  { pattern: /大明王朝|嘉靖|明朝|锦衣卫|宦官|财政危机|制度困局/, url: "/images/covers/ming-fiscal-crisis.png" },
  { pattern: /唐宋城市|城市生活|港埠|商贸|城市气质|新词汇|民间日常|长安十二时辰|古人如何|洗一次澡|如厕/, url: "/images/covers/tang-song-city-life.png" },
  { pattern: /书院|阳明|四书集注|史记|通鉴|汉书|诗经|艺文志|竹书|秦简|里耶|地方志|府志|史料疑点|典籍|知识分类|目录学/, url: "/images/covers/song-scholar-spirit.png" },
  { pattern: /剧说古今|历史细节考据|历史背景原型|历史真相|话本/, url: "/images/covers/zhenhuan-history.png" },
  { pattern: /八卦来了|小史真相|身世|美食家|饮酒|传闻|日常/, url: "/images/covers/tang-song-city-life.png" },
  { pattern: /分类浏览|知识卡片|成语典故|制度职能|起源与兴衰|历史意义/, url: "/images/covers/commandery-county.png" },
];

const THEME_STATIC_COVERS: Record<ContentCoverTheme, string> = {
  palace: "/images/covers/romance-three-kingdoms.png",
  greatwall: "/images/covers/xuanwu-gate.png",
  scroll: "/images/covers/song-scholar-spirit.png",
  lantern: "/images/covers/dream-red-mansion-family.png",
  landscape: "/images/covers/water-margin-society.png",
  drama: "/images/covers/zhenhuan-history.png",
  calligraphy: "/images/covers/anshi-rebellion.png",
  mountain: "/images/covers/journey-west-team.png",
  bronze: "/images/covers/commandery-county.png",
  tea: "/images/covers/tang-song-city-life.png",
};

export function getStaticCoverUrl(title = "", theme?: ContentCoverTheme, badge?: string) {
  const text = `${title} ${badge ?? ""}`;
  const match = STATIC_COVER_RULES.find((rule) => rule.pattern.test(text));
  if (match) return match.url;
  if (theme) return THEME_STATIC_COVERS[theme];
}

export function buildCoverUrl(theme: ContentCoverTheme, title?: string, badge?: string, format: CoverFormat = "banner") {
  const staticCoverUrl = getStaticCoverUrl(title, theme, badge);
  if (staticCoverUrl) return staticCoverUrl;

  const params = new URLSearchParams({
    theme,
    title: title ?? "",
    badge: badge ?? "",
    format,
    v: "prompt-style-no-bubble-1",
  });
  return `/api/content/cover?${params.toString()}`;
}
