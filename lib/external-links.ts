export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

// 核心意图：统一内容卡外链，保证点击后始终有真实反馈。
export function getContentExternalUrl(type: string, title: string) {
  const keyword = encodeURIComponent(title);

  if (type === "播客") {
    return `https://www.ximalaya.com/search/${keyword}/`;
  }

  // 视频与长文先统一到已稳定可访问的 Bilibili 真实站点搜索结果页。
  return `https://search.bilibili.com/all?keyword=${keyword}`;
}
