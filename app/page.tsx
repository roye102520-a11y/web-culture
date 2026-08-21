import Link from "next/link";

import { BottomNav } from "@/components/home/BottomNav";
import { CategoryBrowseSection } from "@/components/home/CategoryBrowseSection";
import { CulturalPulseFeed } from "@/components/home/CulturalPulseFeed";
import { ClassicsSection } from "@/components/home/ClassicsSection";
import { ClassicsExploreSection } from "@/components/home/ClassicsExploreSection";
import { ExpertPreview } from "@/components/home/ExpertPreview";
import { FeaturedFeedSection } from "@/components/home/FeaturedFeedSection";
import { HomeQuickTabs } from "@/components/home/HomeQuickTabs";
import { LatestContentShowcase } from "@/components/home/LatestContentShowcase";
import { SelectedFeedSection } from "@/components/home/SelectedFeedSection";
import { ThreeColumnsSection } from "@/components/home/ThreeColumnsSection";
import { TodayCultureCard } from "@/components/home/TodayCultureCard";

const quickNavItems = [
  { id: "quick", label: "快速浏览", targetId: "section-quick" },
  { id: "latest", label: "最新上线", targetId: "section-latest" },
  { id: "hot", label: "热门阅读", targetId: "section-hot" },
  { id: "category", label: "分类浏览", targetId: "section-category" },
  { id: "columns", label: "三大专栏", targetId: "section-columns" },
  { id: "classics", label: "名著聚合", targetId: "section-classics" },
  { id: "exam", label: "考试专区", targetId: "section-exam" },
  { id: "ai-explain", label: "AI历史讲解", targetId: "section-ai-explain" },
  { id: "deepseek", label: "DeepSeek导读", targetId: "section-deepseek" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 md:px-8 md:py-12 md:pb-12">
        <div className="space-y-8">
          <TodayCultureCard />
          <HomeQuickTabs items={quickNavItems} />

          <div id="section-quick" className="scroll-mt-24">
            <CulturalPulseFeed />
          </div>

          <div id="section-latest" className="scroll-mt-24">
            <LatestContentShowcase />
          </div>

          <section id="section-hot" className="scroll-mt-24 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f0ece9]">
            <h2 className="text-lg font-semibold">热门阅读</h2>
            <p className="text-sm text-[#57534E]">从安史之乱、城市气质到天津港口文化，进入有证据边界、也有人间现场的历史叙事。</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/content/28" className="text-[#991B1B] hover:text-[#7F1D1D]">安史之乱完整脉络 →</Link>
              <Link href="/content/38" className="text-[#991B1B] hover:text-[#7F1D1D]">城市气质与地方志 →</Link>
              <Link href="/content/39" className="text-[#991B1B] hover:text-[#7F1D1D]">天津港口文化 →</Link>
            </div>
          </section>

          <div id="section-category" className="scroll-mt-24">
            <CategoryBrowseSection />
          </div>

          <div id="section-columns" className="scroll-mt-24">
            <ThreeColumnsSection />
          </div>

          <div id="section-classics" className="scroll-mt-24">
            <ClassicsSection />
          </div>

          <ClassicsExploreSection />

          <section id="section-exam" className="scroll-mt-24 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f0ece9]">
            <h2 className="text-lg font-semibold">考试专区</h2>
            <p className="text-sm text-[#57534E]">高频考点分层练习，支持错因复盘与同类题拓展。</p>
            <Link href="/exam" className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">进入题库 →</Link>
          </section>

          <section id="section-ai-explain" className="scroll-mt-24 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#f0ece9]">
            <h2 className="text-lg font-semibold">AI历史讲解</h2>
            <p className="text-sm text-[#57534E]">以“错因-推理-背景-延展”四段方式拆解历史问题。</p>
            <Link href="/look/explain" className="inline-block text-sm text-[#991B1B] hover:text-[#7F1D1D]">开始讲解 →</Link>
          </section>

          <div id="section-deepseek" className="scroll-mt-24">
            <FeaturedFeedSection />
          </div>

          <ExpertPreview />

          <SelectedFeedSection />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
