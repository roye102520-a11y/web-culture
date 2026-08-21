import { ContentCollectionPage } from "@/components/content/ContentCollectionPage";
import { allContentRecords } from "@/data/content-adapters";

const items = allContentRecords.filter((item) => item.category === "八卦来了");

export default function GossipPage() {
  return (
    <ContentCollectionPage
      eyebrow="HISTORICAL LIVES"
      title="古人也是普通人"
      description="这里讲饮酒、吃饭、洗澡、仕途和传闻，也会交代材料来源与不确定之处。人物可以有脾气和疲惫，趣闻不能离开历史依据。"
      items={items}
    />
  );
}
