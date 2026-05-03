import { CategoryBrowseSection } from "@/components/home/CategoryBrowseSection";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <CategoryBrowseSection title="分类浏览（双维筛选）" />
      </main>
    </div>
  );
}
