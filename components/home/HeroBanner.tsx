import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F5F5F4] px-6 py-10 shadow-sm md:px-10 md:py-14">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#991B1B]/8 blur-3xl" />
      <div className="relative max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#991B1B]/10 px-3 py-1 text-xs font-medium text-[#991B1B] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-3.5 w-3.5" />
          全新功能体验
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-[#1C1917] animate-in fade-in slide-in-from-bottom-4 duration-700 md:text-5xl">
          探索古诗词、成语、历史...
        </h1>

        <p className="max-w-2xl text-sm leading-7 text-[#57534E] md:text-base">
          穿越千年文脉，从真实史料到现代解读，构建更有温度的历史文化学习体验。
        </p>

        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Button className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]">看看功能已上线</Button>
          <Button variant="outline" className="border-[#e7e5e4] bg-white/70 text-[#57534E] hover:bg-white">
            立即体验
          </Button>
        </div>
      </div>
    </section>
  );
}
