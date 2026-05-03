# 文脉 WenMai（web-culture）

culture share · 历史文化学习平台 Demo，基于 [Next.js](https://nextjs.org) App Router + TypeScript + Tailwind CSS + shadcn/ui。

远程仓库：[https://github.com/roye102520-a11y/web-culture](https://github.com/roye102520-a11y/web-culture)

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

根目录创建 `.env.local`（勿提交到 Git），例如：

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

## 本地视频资源

`public/videos/*.mov` 已加入 `.gitignore`（单文件超过 GitHub 限制）。克隆后请将演示视频自行放到 `public/videos/`，文件名需与代码中引用一致，例如：

- `lianzhenhu-guide.mov`
- `difangzhi.mov`

## 构建

```bash
npm run build
npm start
```

---

## Vercel 部署与运维指南

本节说明如何把「文脉」稳定部署到 Vercel，以及和本地开发对齐时要注意什么。按顺序配置即可，无需额外脚本。

### 1. 环境变量配置 (Required Environment Variables)

| 变量名 | 说明 |
|--------|------|
| **`DEEPSEEK_API_KEY`** | 服务端调用 DeepSeek 接口时使用，驱动 AI 问答、讲解等逻辑；未配置或仍为占位值时，相关能力会降级为兜底提示，健康检查页也会显示未配置。 |

**重要提醒：**

- **不要在代码里硬编码 API Key**，也不要把真实 Key 写进 Git 或提交到 PR。
- 请在 Vercel 控制台：**Project → Settings → Environment Variables** 中新增变量，名称填 `DEEPSEEK_API_KEY`，值填你的密钥；按需勾选 **Production** / **Preview** / **Development**。
- 修改环境变量后，需要对已有部署执行 **Redeploy**，新变量才会生效。

### 2. 环境要求 (Runtime Requirements)

- **Node.js**：`>= 20.9.0`（与 `package.json` 中 `engines` 一致；也可在 Vercel **Settings → Node.js Version** 中手动选择 20 或 22）。
- **推荐构建流程**（与仓库根目录 `vercel.json` 对齐）：先 **`npm ci`**（严格按 `package-lock.json` 安装），再 **`npm run build`**。Vercel 默认会执行 `npm run build`；本地自检可执行：

```bash
npm ci && npm run build
```

### 3. 大文件托管说明 (Static Assets Notice)

- **`/public/videos/` 下的 `.mov` 视频**已通过根目录 **`.gitignore`** 排除，**不会进入 Git 仓库**，因此也不会随 Vercel 从 Git 拉取的代码一起部署到边缘（若未通过其他方式上传，线上访问这些路径可能出现 **404**）。
- **运维建议**：生产环境尽量把大体积视频放到 **对象存储或专用媒体服务**，例如阿里云 OSS、腾讯云 COS、AWS S3，或使用 **Vercel Blob** 等；前端把链接改为 CDN/公开 URL。这样既不占用仓库与构建资源，也便于缓存与带宽优化。

---

## 故障排查

**Vercel 部署失败或构建报错时**，可先对照下面一条排查：

- **路径与大小写**：Vercel 构建环境为 **Linux**，文件名与 `import` 路径**区分大小写**。若在 macOS 上「本地能跑、线上报错」，请检查组件路径、`@/` 别名指向的文件名是否与仓库里**完全一致**（包括大小写），修正后重新推送再部署。
