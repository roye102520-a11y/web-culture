import { NextResponse } from "next/server";

import { COVER_PALETTES, getCoverMotif } from "@/lib/cover-art";
import type { ContentCoverTheme } from "@/components/ui/ContentCover";

const themes: ContentCoverTheme[] = [
  "palace",
  "greatwall",
  "scroll",
  "lantern",
  "landscape",
  "drama",
  "calligraphy",
  "mountain",
  "bronze",
  "tea",
];

type CoverFormat = "square" | "banner" | "poster";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function hashText(value: string) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function paperDefs(ink: string, accent: string) {
  return `
    <pattern id="paperDots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="7" cy="8" r="2" fill="${ink}" opacity=".08"/>
      <circle cx="24" cy="24" r="1.4" fill="${accent}" opacity=".10"/>
    </pattern>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="13" stdDeviation="15" flood-color="${ink}" flood-opacity=".16"/>
    </filter>
  `;
}

function cloud(x: number, y: number, scale = 1, ink = "#2b2016", fill = "#fffaf0", opacity = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}">
      <path d="M14 51c13-25 38-21 48-7 12-36 60-38 80-6 19-11 50-3 58 23 33 2 43 43 8 57H25c-34-8-34-49-11-67z" fill="${fill}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M57 69c20 0 29 15 25 34M126 58c-21 10-27 27-21 47M162 79c16 0 25 11 25 26" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" opacity=".38"/>
    </g>`;
}

function gate(x: number, y: number, scale = 1, ink = "#2b2016", flip = false) {
  const mirror = flip ? "scale(-1 1)" : "";
  return `
    <g transform="translate(${x} ${y}) scale(${scale}) ${mirror}" filter="url(#softShadow)">
      <path d="M0 82c66-70 164-92 278-54 26 9 52 5 83-15-10 48-47 78-103 78H58c-24 0-41-1-58-9z" fill="#376778" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="54" y="90" width="226" height="28" fill="#b94736" stroke="${ink}" stroke-width="7"/>
      <rect x="78" y="118" width="36" height="120" rx="8" fill="#cfaa72" stroke="${ink}" stroke-width="7"/>
      <rect x="222" y="118" width="36" height="120" rx="8" fill="#cfaa72" stroke="${ink}" stroke-width="7"/>
      <path d="M96 118v120M240 118v120" stroke="#8d6843" stroke-width="4" opacity=".45"/>
    </g>`;
}

function blankScroll(x: number, y: number, width: number, height: number, ink = "#2b2016") {
  return `
    <g filter="url(#softShadow)">
      <rect x="${x + height * 0.26}" y="${y}" width="${width - height * 0.52}" height="${height}" rx="${height * 0.12}" fill="#fff4da" stroke="${ink}" stroke-width="${Math.max(5, height * 0.06)}"/>
      <rect x="${x}" y="${y - height * 0.1}" width="${height * 0.42}" height="${height * 1.2}" rx="${height * 0.18}" fill="#cda76d" stroke="${ink}" stroke-width="${Math.max(5, height * 0.06)}"/>
      <rect x="${x + width - height * 0.42}" y="${y - height * 0.1}" width="${height * 0.42}" height="${height * 1.2}" rx="${height * 0.18}" fill="#cda76d" stroke="${ink}" stroke-width="${Math.max(5, height * 0.06)}"/>
      <path d="M${x + height * 0.72} ${y + height * 0.28}h${width - height * 1.44}M${x + height * 0.72} ${y + height * 0.72}h${width - height * 1.44}" stroke="#d7bd84" stroke-width="${Math.max(3, height * 0.035)}" opacity=".72"/>
    </g>`;
}

function qFigure(x: number, y: number, scale: number, robe: string, ink: string, variant: "official" | "lady" | "general" | "scholar" = "official") {
  const hair = variant === "lady" ? "#2d2722" : variant === "general" ? "#6f2c25" : variant === "scholar" ? "#202020" : "#283b45";
  const headwear =
    variant === "lady"
      ? `<path d="M34 25c20-37 78-39 102-4 14-14 34-10 42 8-20 17-47 25-82 25H66c-29 0-54-8-74-25 10-21 32-22 42-4z" fill="${hair}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>`
      : variant === "general"
        ? `<path d="M28 36c28-51 102-49 132 5l-16 29H44z" fill="${hair}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><path d="M146 18l55 25-47 19" fill="${robe}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>`
        : `<path d="M28 19h112l17 55H12z" fill="${hair}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/><rect x="58" y="0" width="55" height="27" rx="10" fill="${hair}" stroke="${ink}" stroke-width="7"/>`;
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <ellipse cx="88" cy="232" rx="80" ry="17" fill="${ink}" opacity=".12"/>
      <path d="M31 135c-43 28-51 82-24 104 22 18 57 3 74-31-11-31-25-55-50-73z" fill="${robe}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M145 135c45 28 53 82 25 104-22 18-57 3-75-31 12-31 26-55 50-73z" fill="${robe}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="88" cy="81" r="57" fill="#ffe6c9" stroke="${ink}" stroke-width="9"/>
      ${headwear}
      <circle cx="68" cy="83" r="5" fill="${ink}"/><circle cx="108" cy="83" r="5" fill="${ink}"/>
      <path d="M72 106c20 15 38 15 58 0" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="52" cy="101" r="9" fill="#ef9f8f" opacity=".55"/><circle cx="124" cy="101" r="9" fill="#ef9f8f" opacity=".55"/>
      <path d="M33 244c5-80 27-131 56-131s51 51 56 131z" fill="${robe}" stroke="${ink}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M58 168c21 17 42 17 64 0M88 126v105" stroke="${ink}" stroke-width="6" stroke-linecap="round" opacity=".28"/>
      <circle cx="37" cy="219" r="16" fill="#f3c36f" stroke="${ink}" stroke-width="7"/>
      <circle cx="139" cy="219" r="16" fill="#f3c36f" stroke="${ink}" stroke-width="7"/>
    </g>`;
}

function oldMap(x: number, y: number, scale: number, ink: string, fill: string, accent: string) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <path d="M22 95c48-86 117-46 171-76 83-46 135 21 218 0 73-18 125 26 113 99-12 75-74 85-143 101-82 19-122 82-217 59-93-22-190-8-168-100 6-25 14-50 26-83z" fill="${fill}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M90 180c75-58 147-41 226-88M276 211c37-46 91-65 161-58" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
      <circle cx="125" cy="170" r="12" fill="${accent}" stroke="${ink}" stroke-width="5"/><circle cx="327" cy="91" r="12" fill="${accent}" stroke="${ink}" stroke-width="5"/><circle cx="440" cy="151" r="12" fill="${accent}" stroke="${ink}" stroke-width="5"/>
    </g>`;
}

function cityTower(x: number, y: number, scale: number, ink: string, color: string, accent: string) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <path d="M0 92c68-55 145-69 231-28 18 9 42 8 70-7-12 42-44 65-97 65H42c-18 0-31-10-42-30z" fill="${accent}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="34" y="121" width="227" height="102" rx="8" fill="${color}" stroke="${ink}" stroke-width="8"/>
      <rect x="119" y="157" width="58" height="66" rx="28" fill="#fff0cf" stroke="${ink}" stroke-width="7"/>
      <path d="M72 152h31M194 152h31" stroke="${ink}" stroke-width="7" stroke-linecap="round" opacity=".35"/>
    </g>`;
}

function bookIcon(x: number, y: number, scale: number, ink: string, color: string, accent: string) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
      <path d="M20 29c91-40 145-31 196 18v179c-54-44-115-51-196-15z" fill="#fff8e8" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M216 47c55-47 119-55 196-18v182c-84-37-141-29-196 15z" fill="#fff4da" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M216 55v170M67 92h95M68 132h70M273 92h90M273 132h62" stroke="${accent}" stroke-width="11" stroke-linecap="round"/>
      <path d="M42 225c76-25 132-19 174 12 50-32 107-38 175-12" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" opacity=".65"/>
    </g>`;
}

function topicProp(motif: ReturnType<typeof getCoverMotif>, x: number, y: number, scale: number, ink: string, color: string, accent: string) {
  if (motif === "city" || motif === "palace" || motif === "drama") return cityTower(x, y, scale, ink, color, accent);
  if (motif === "books" || motif === "bamboo" || motif === "exam" || motif === "honglou") return bookIcon(x, y, scale, ink, color, accent);
  return oldMap(x, y, scale, ink, "#eadc9b", accent);
}

function frame(width: number, height: number, ink: string) {
  return `
    <rect x="${width * 0.035}" y="${height * 0.055}" width="${width * 0.93}" height="${height * 0.86}" rx="${width * 0.018}" fill="none" stroke="${ink}" stroke-width="${Math.max(7, width * 0.007)}" opacity=".82"/>
    <rect x="${width * 0.055}" y="${height * 0.078}" width="${width * 0.89}" height="${height * 0.815}" rx="${width * 0.014}" fill="none" stroke="#d3b77c" stroke-width="${Math.max(5, width * 0.005)}" opacity=".75"/>
  `;
}

function bannerSvg(title: string, theme: ContentCoverTheme) {
  const palette = COVER_PALETTES[theme];
  const motif = getCoverMotif(title, theme);
  const hash = hashText(title);
  const robeA = hash % 2 ? "#c58a48" : palette.accent;
  const robeB = hash % 3 ? "#d79ab3" : "#6f8b77";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-label="${escapeXml(title)}">
  <defs>${paperDefs(palette.ink, palette.accent)}</defs>
  <rect width="1600" height="900" rx="44" fill="#f5e8c8"/>
  <rect width="1600" height="900" rx="44" fill="url(#paperDots)"/>
  <path d="M0 690C210 560 392 625 650 535c310-107 540-120 950 15v350H0z" fill="${palette.bg2}" opacity=".18"/>
  ${frame(1600, 900, palette.ink)}
  ${gate(0, 18, 1.25, palette.ink)}
  ${gate(1600, 18, 1.25, palette.ink, true)}
  ${cloud(75, 165, 0.85, palette.ink)}
  ${cloud(1320, 160, 0.85, palette.ink)}
  ${blankScroll(520, 90, 560, 125, palette.ink)}
  ${topicProp(motif, 570, 310, 0.82, palette.ink, palette.bg2, palette.accent2)}
  ${qFigure(255, 350, 0.9, robeA, palette.ink, motif === "war" || motif === "tangConflict" ? "general" : "official")}
  ${qFigure(1088, 360, 0.86, robeB, palette.ink, motif === "honglou" || motif === "palace" || motif === "drama" ? "lady" : "scholar")}
  ${cloud(55, 705, 0.78, palette.ink, "#fffaf0", 0.82)}
  ${cloud(1340, 700, 0.72, palette.ink, "#fffaf0", 0.78)}
</svg>`;
}

function squareSvg(title: string, theme: ContentCoverTheme) {
  const palette = COVER_PALETTES[theme];
  const motif = getCoverMotif(title, theme);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" aria-label="${escapeXml(title)}">
  <defs>${paperDefs(palette.ink, palette.accent)}</defs>
  <rect width="1024" height="1024" rx="48" fill="#f5e8c8"/>
  <rect width="1024" height="1024" rx="48" fill="url(#paperDots)"/>
  <path d="M0 760C150 650 292 682 458 602c215-102 350-88 566 0v422H0z" fill="${palette.bg2}" opacity=".18"/>
  ${frame(1024, 1024, palette.ink)}
  ${gate(-45, 8, 0.85, palette.ink)}
  ${gate(1069, 8, 0.85, palette.ink, true)}
  ${cloud(62, 170, 0.7, palette.ink)}
  ${cloud(800, 174, 0.64, palette.ink)}
  ${blankScroll(218, 98, 588, 112, palette.ink)}
  ${topicProp(motif, 248, 345, 0.78, palette.ink, palette.bg2, palette.accent2)}
  ${qFigure(110, 430, 0.9, palette.accent, palette.ink, motif === "war" || motif === "tangConflict" ? "general" : "official")}
  ${qFigure(675, 430, 0.82, motif === "honglou" || motif === "palace" ? "#d79ab3" : "#6f8b77", palette.ink, motif === "honglou" || motif === "palace" ? "lady" : "scholar")}
  ${cloud(70, 822, 0.7, palette.ink, "#fffaf0", 0.82)}
  ${cloud(780, 820, 0.62, palette.ink, "#fffaf0", 0.78)}
</svg>`;
}

function blankBoard(x: number, y: number, width: number, height: number, ink: string) {
  return `
    <g filter="url(#softShadow)">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="#fff8e8" stroke="${ink}" stroke-width="7"/>
      <rect x="${x + 26}" y="${y + 30}" width="${width - 52}" height="${height * 0.25}" rx="16" fill="#f3dba7" stroke="${ink}" stroke-width="6" opacity=".96"/>
      <path d="M${x + 44} ${y + height * 0.5}h${width - 88}M${x + 44} ${y + height * 0.66}h${width * 0.55}" stroke="#d6bd84" stroke-width="12" stroke-linecap="round" opacity=".7"/>
    </g>`;
}

function posterSvg(title: string, theme: ContentCoverTheme) {
  const palette = COVER_PALETTES[theme];
  const motif = getCoverMotif(title, theme);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200" role="img" aria-label="${escapeXml(title)}">
  <defs>${paperDefs(palette.ink, palette.accent)}</defs>
  <rect width="900" height="1200" rx="42" fill="#f5e8c8"/>
  <rect width="900" height="1200" rx="42" fill="url(#paperDots)"/>
  <path d="M0 930C160 830 300 860 430 780c155-96 300-84 470 8v412H0z" fill="${palette.bg2}" opacity=".16"/>
  ${frame(900, 1200, palette.ink)}
  ${gate(-18, 2, 0.72, palette.ink)}
  ${gate(918, 2, 0.72, palette.ink, true)}
  ${cloud(58, 145, 0.6, palette.ink)}
  ${cloud(690, 140, 0.58, palette.ink)}
  ${blankScroll(190, 74, 520, 108, palette.ink)}
  ${blankBoard(78, 250, 744, 240, palette.ink)}
  ${blankBoard(78, 530, 744, 240, palette.ink)}
  ${blankBoard(78, 810, 744, 240, palette.ink)}
  ${qFigure(105, 305, 0.58, palette.accent, palette.ink, "official")}
  ${topicProp(motif, 385, 307, 0.42, palette.ink, palette.bg2, palette.accent2)}
  ${oldMap(130, 595, 0.54, palette.ink, "#eadc9b", palette.accent2)}
  ${qFigure(610, 578, 0.56, "#d79ab3", palette.ink, motif === "honglou" || motif === "palace" ? "lady" : "scholar")}
  ${cityTower(130, 872, 0.46, palette.ink, palette.bg2, palette.accent2)}
  ${bookIcon(500, 865, 0.43, palette.ink, palette.bg2, palette.accent2)}
  ${cloud(52, 1060, 0.62, palette.ink, "#fffaf0", 0.82)}
  ${cloud(690, 1058, 0.56, palette.ink, "#fffaf0", 0.78)}
</svg>`;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedTheme = searchParams.get("theme") as ContentCoverTheme | null;
  const theme = requestedTheme && themes.includes(requestedTheme) ? requestedTheme : "scroll";
  const title = searchParams.get("title") ?? "文脉";
  const format = (searchParams.get("format") ?? "banner") as CoverFormat;

  const svg = format === "poster" ? posterSvg(title, theme) : format === "square" ? squareSvg(title, theme) : bannerSvg(title, theme);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
