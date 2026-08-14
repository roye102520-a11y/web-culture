"use client";

import { useState } from "react";

type ContentCoverTheme =
  | "palace"
  | "greatwall"
  | "scroll"
  | "lantern"
  | "landscape"
  | "drama"
  | "calligraphy"
  | "mountain"
  | "bronze"
  | "tea";

interface ContentCoverProps {
  theme: ContentCoverTheme;
  title?: string;
  badge?: string;
  className?: string;
  videoSrc?: string;
}

const THEMES: Record<ContentCoverTheme, { gradient: string; label: string; icon: string; imgSrc?: string }> = {
  palace: { gradient: "from-[#1a0a00] to-[#4a1500]", label: "宫殿", icon: "🏯", imgSrc: "/images/palace.jpg" },
  greatwall: {
    gradient: "from-[#0d1a2e] to-[#1a3a5c]",
    label: "长城",
    icon: "🧱",
    imgSrc: "/images/greatwall.jpg",
  },
  scroll: { gradient: "from-[#1a1400] to-[#3d2e00]", label: "典籍", icon: "📜", imgSrc: "/images/scroll.jpg" },
  lantern: { gradient: "from-[#2a0008] to-[#6b0010]", label: "文化", icon: "🏮", imgSrc: "/images/lantern.jpg" },
  landscape: {
    gradient: "from-[#001a0d] to-[#003d1f]",
    label: "山水",
    icon: "🏔",
    imgSrc: "/images/landscape.jpg",
  },
  drama: { gradient: "from-[#1a0d2e] to-[#2e0d4a]", label: "影视", icon: "🎭", imgSrc: "/images/drama.jpg" },
  calligraphy: {
    gradient: "from-[#0a0a0a] to-[#2a2a2a]",
    label: "书法",
    icon: "✍️",
    imgSrc: "/images/calligraphy.jpg",
  },
  mountain: {
    gradient: "from-[#001a1a] to-[#003d3d]",
    label: "历史",
    icon: "⛰️",
    imgSrc: "/images/mountain.jpg",
  },
  bronze: { gradient: "from-[#0d1a00] to-[#2e4a00]", label: "青铜", icon: "🗿", imgSrc: "/images/bronze.jpg" },
  tea: { gradient: "from-[#0a1400] to-[#1f2e00]", label: "茶道", icon: "🍵", imgSrc: "/images/tea.jpg" },
};

export function ContentCover({ theme, title, badge, className, videoSrc }: ContentCoverProps) {
  const cfg = THEMES[theme];
  const [imageFailed, setImageFailed] = useState(false);
  const useImage = !videoSrc && Boolean(cfg.imgSrc) && !imageFailed;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cfg.gradient} ${className ?? ""}`}>
      {videoSrc ? (
        <video
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          preload="metadata"
          muted
          playsInline
          controls={false}
        />
      ) : null}

      {useImage ? (
        <img
          src={cfg.imgSrc}
          alt={title ?? cfg.label}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : null}

      <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,72 C15,58 28,64 42,56 C55,48 66,56 78,48 C88,42 94,36 100,32 L100,100 L0,100 Z" fill="rgba(255,255,255,0.18)" />
        <path d="M0,80 C14,70 26,74 40,68 C54,62 66,67 80,60 C90,56 95,52 100,48 L100,100 L0,100 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M6,20 C22,18 30,28 44,24 C57,20 68,12 84,14" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" fill="none" />
      </svg>

      {badge ? (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {badge}
        </span>
      ) : null}

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[60px] opacity-70" aria-hidden="true">
          {cfg.icon}
        </span>
      </div>

      <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/20 px-2 py-0.5 text-xs text-white">
        {cfg.label}
      </div>

      {title ? <span className="sr-only">{title}</span> : null}
    </div>
  );
}

export type { ContentCoverTheme };
