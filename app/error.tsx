"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-base text-foreground">页面出错了，请稍后重试。</p>
        <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={reset}>
          重试
        </Button>
      </div>
    </div>
  );
}
