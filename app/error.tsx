"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">页面出现错误</h2>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            抱歉，系统遇到一个异常。你可以点击下方按钮进行重试。
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => reset()}>
            重试
          </Button>
        </div>
      </body>
    </html>
  );
}
