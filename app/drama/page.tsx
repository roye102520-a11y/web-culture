import { ContentCollectionPage } from "@/components/content/ContentCollectionPage";
import { allContentRecords } from "@/data/content-adapters";

const items = allContentRecords.filter((item) => item.category === "剧说古今");

export default function DramaPage() {
  return (
    <ContentCollectionPage
      eyebrow="HISTORY THROUGH SCREEN"
      title="影视里的中国历史"
      description="从熟悉的剧情进入真实历史：我们会说明哪些制度和生活细节有历史依据，哪些人物与冲突为了叙事被压缩、重组或强化。"
      items={items}
    />
  );
}
