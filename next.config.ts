import type { NextConfig } from "next";

/** Vercel 会识别 Next.js 并执行 `npm run build`，此处保持默认即可；勿随意加会改写 App Router 的 rewrites。 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
