"use client";

import { buildCoverUrl, COVER_PALETTES, getCoverMotif, type CoverFormat } from "@/lib/cover-art";

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

function getActorPalette(theme: ContentCoverTheme, title?: string) {
  const motif = getCoverMotif(title, theme);

  if (motif === "tangConflict" || motif === "war") {
    return { robe: "#a84436", hat: "#2e3035", prop: "#c33d2f", accent: "#d7a84f" };
  }
  if (motif === "honglou" || motif === "palace" || motif === "drama") {
    return { robe: "#d691ad", hat: "#2d2520", prop: "#d7a84f", accent: "#8f2f1f" };
  }
  if (motif === "exam" || motif === "books" || motif === "bamboo") {
    return { robe: "#6f8b77", hat: "#202020", prop: "#f2d58c", accent: "#b9412c" };
  }
  return { robe: "#b88344", hat: "#263844", prop: "#d7a84f", accent: "#8f2f1f" };
}

function AnimatedCoverActor({ theme, title }: { theme: ContentCoverTheme; title?: string }) {
  const actor = getActorPalette(theme, title);

  return (
    <div className="pointer-events-none absolute bottom-[2%] right-[4%] z-10 w-[23%] min-w-[70px] max-w-[108px]">
      <style>{`
        @keyframes wm-actor-bob {
          0%, 100% { transform: translateY(0) rotate(-0.6deg); }
          50% { transform: translateY(-6px) rotate(0.8deg); }
        }
        @keyframes wm-sleeve-wave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(9deg); }
        }
        @keyframes wm-blink {
          0%, 88%, 100% { transform: scaleY(1); }
          92% { transform: scaleY(0.12); }
        }
        @keyframes wm-book-pop {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wm-actor, .wm-sleeve, .wm-eyes, .wm-prop { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 150 164" role="presentation" aria-hidden="true" className="h-auto w-full drop-shadow-[0_9px_11px_rgba(43,32,22,0.22)]">
        <g className="wm-actor" style={{ animation: "wm-actor-bob 2.9s ease-in-out infinite", transformOrigin: "74px 120px" }}>
          <ellipse cx="75" cy="151" rx="52" ry="9" fill="#241914" opacity=".16" />
          <path d="M28 144c4-46 20-78 47-78s43 32 47 78z" fill={actor.robe} stroke="#241914" strokeWidth="5" strokeLinejoin="round" />
          <path d="M47 100c16 13 38 13 56 0M75 74v59" stroke="#241914" strokeWidth="4" strokeLinecap="round" opacity=".28" />

          <g className="wm-sleeve" style={{ animation: "wm-sleeve-wave 1.9s ease-in-out infinite", transformOrigin: "112px 103px" }}>
            <path d="M105 89c23 8 32 27 22 43-7 12-24 10-35-1 2-17 5-30 13-42z" fill={actor.robe} stroke="#241914" strokeWidth="5" strokeLinejoin="round" />
            <circle cx="122" cy="133" r="10" fill="#f3c36f" stroke="#241914" strokeWidth="4" />
          </g>
          <path d="M45 89c-24 8-33 27-23 43 7 12 24 10 35-1-2-17-5-30-12-42z" fill={actor.robe} stroke="#241914" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="28" cy="133" r="10" fill="#f3c36f" stroke="#241914" strokeWidth="4" />

          <g className="wm-prop" style={{ animation: "wm-book-pop 2.2s ease-in-out infinite", transformOrigin: "43px 116px" }}>
            <rect x="28" y="98" width="31" height="40" rx="6" fill={actor.prop} stroke="#241914" strokeWidth="4" />
            <path d="M43 103v29M35 113h16" stroke="#241914" strokeWidth="3" strokeLinecap="round" opacity=".42" />
          </g>

          <circle cx="75" cy="55" r="36" fill="#ffe6c9" stroke="#241914" strokeWidth="5" />
          <path d="M35 39c11-32 63-39 86 0 9 5 14 14 14 24-11-9-21-12-34-13-10-1-22 2-31-4-8 8-20 12-35 12-9 0-18-2-26-6 5-5 13-9 26-13z" fill={actor.hat} stroke="#241914" strokeWidth="5" strokeLinejoin="round" />
          <rect x="56" y="10" width="38" height="18" rx="7" fill={actor.hat} stroke="#241914" strokeWidth="4" />
          <rect x="62" y="17" width="26" height="10" rx="4" fill="#3d4b50" opacity=".38" />

          <g className="wm-eyes" style={{ animation: "wm-blink 3.6s ease-in-out infinite", transformOrigin: "75px 59px" }}>
            <path d="M55 58c6 4 12 4 18 0M79 58c6 4 12 4 18 0" stroke="#241914" strokeWidth="4" strokeLinecap="round" />
          </g>
          <path d="M59 73c10 8 23 8 34 0" stroke="#241914" strokeWidth="4" strokeLinecap="round" />
          <circle cx="48" cy="69" r="5" fill="#ef9f8f" opacity=".65" />
          <circle cx="103" cy="69" r="5" fill="#ef9f8f" opacity=".65" />
          <circle cx="104" cy="36" r="7" fill={actor.accent} stroke="#241914" strokeWidth="3" />
          <circle cx="45" cy="38" r="6" fill={actor.accent} stroke="#241914" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function getCoverFormat(className?: string): CoverFormat {
  if (!className) return "banner";
  if (className.includes("3/4") || className.includes("9/12")) return "poster";
  if (className.includes("4/3") || className.includes("square")) return "square";
  return "banner";
}

export function ContentCover({ theme, title, badge, className, videoSrc }: ContentCoverProps) {
  const palette = COVER_PALETTES[theme];
  const format = getCoverFormat(className);
  const coverUrl = buildCoverUrl(theme, title, badge, format);
  const usesStaticCover = coverUrl.startsWith("/images/covers/");

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-cover bg-center ${className ?? ""}`}
      style={{ backgroundColor: palette.bg, backgroundImage: `url("${coverUrl}")` }}
    >
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

      {format === "banner" && !usesStaticCover ? <AnimatedCoverActor theme={theme} title={title} /> : null}

      {title ? <span className="sr-only">{title}</span> : null}
    </div>
  );
}

export type { ContentCoverTheme };
