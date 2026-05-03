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
