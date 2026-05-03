import { EXTERNAL_LINK_PROPS, getContentExternalUrl } from "@/lib/external-links";
import { ContentCover, type ContentCoverTheme } from "@/components/ui/ContentCover";

export type ContentCardType = {
  id: string;
  title: string;
  summary: string;
  type: "视频" | "播客" | "长文";
  publishedAt: string;
  playCount: number;
  coverImage?: string;
  theme?: ContentCoverTheme;
  externalUrl?: string;
};

const typeTheme: Record<ContentCardType["type"], ContentCoverTheme> = {
  视频: "drama",
  播客: "tea",
  长文: "scroll",
};

function formatCount(count: number) {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}w`;
  return `${count}`;
}

export function ContentCard({ item }: { item: ContentCardType }) {
  const externalUrl = item.externalUrl ?? getContentExternalUrl(item.type, item.title);
  const theme = item.theme ?? typeTheme[item.type];

  return (
    <article className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#f0ece9]">
      <div className="relative overflow-hidden rounded-xl">
        <ContentCover
          theme={theme}
          title={item.title}
          badge={item.type === "视频" ? "🎬 视频" : item.type === "播客" ? "🎧 播客" : "📝 长文"}
          className="aspect-video"
        />
      </div>

      <div className="space-y-2 px-1 pb-1 pt-3">
        <h3 className="text-base font-semibold leading-6 text-[#1C1917] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {item.title}
        </h3>
        <p className="text-sm leading-6 text-[#57534E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
          {item.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-[#78716C]">
          <span>{item.publishedAt}</span>
          <span>播放量 {formatCount(item.playCount)}</span>
        </div>
        <a href={externalUrl} {...EXTERNAL_LINK_PROPS} className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">
          {item.type === "播客" ? "前往收听 →" : "播放 / 查看详情 →"}
        </a>
      </div>
    </article>
  );
}
