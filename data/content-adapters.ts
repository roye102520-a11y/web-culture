import contentLibrary from "@/data/content-library.json";
import examLibrary from "@/data/exam-questions.json";
import type { ContentCoverTheme } from "@/components/ui/ContentCover";

export type RawContent = {
  id: number;
  title: string;
  content: string;
  type: "article" | "video" | "podcast";
  category: string;
  tags: string;
  difficulty: string;
  image: string;
  source: string;
};

export type RawExam = {
  id: number;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  analysis: string;
  exam_type: string;
  knowledge_point: string;
  difficulty: string;
  tags: string;
  language: string;
};

type ExamDifficulty = "简单" | "中等" | "困难";
type Dynasty = "唐" | "宋" | "元" | "明" | "清";
type ContentTypeCN = "长文" | "视频" | "播客";
export type ExamType = "高考" | "考研" | "GRE" | "美国高考";
export type OfficialPublicExamSet = {
  id: string;
  examType: Extract<ExamType, "GRE" | "美国高考">;
  title: string;
  provider: "ETS" | "College Board";
  url: string;
  skill: string;
  description: string;
};

function isRawContentArray(value: unknown): value is RawContent[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return (
        typeof row.id === "number" &&
        typeof row.title === "string" &&
        typeof row.content === "string" &&
        (row.type === "article" || row.type === "video" || row.type === "podcast") &&
        typeof row.category === "string" &&
        typeof row.tags === "string" &&
        typeof row.difficulty === "string" &&
        typeof row.image === "string" &&
        typeof row.source === "string"
      );
    })
  );
}

function isRawExamArray(value: unknown): value is RawExam[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return (
        typeof row.id === "number" &&
        typeof row.title === "string" &&
        typeof row.optionA === "string" &&
        typeof row.optionB === "string" &&
        typeof row.optionC === "string" &&
        typeof row.optionD === "string" &&
        (row.answer === "A" || row.answer === "B" || row.answer === "C" || row.answer === "D") &&
        typeof row.analysis === "string" &&
        typeof row.exam_type === "string" &&
        typeof row.knowledge_point === "string" &&
        typeof row.difficulty === "string" &&
        typeof row.tags === "string" &&
        typeof row.language === "string"
      );
    })
  );
}

const baseRawContents = isRawContentArray(contentLibrary) ? contentLibrary : [];
const rawExams = isRawExamArray(examLibrary) ? examLibrary : [];

const generatedContentCategories = [
  "红楼梦",
  "三国演义",
  "水浒传",
  "西游记",
  "剧说古今",
  "八卦来了",
  "典籍探疑",
  "首页内容",
  "分类浏览",
] as const;

const dynastyCycle = ["唐", "宋", "元", "明", "清"] as const;
const typeCycle = ["article", "video", "podcast"] as const;
const difficultyCycle = ["易", "中", "难"] as const;
const classicAngles = ["人物", "情节", "制度", "意象", "考点", "叙事"];
const lifeAngles = ["饮食", "服饰", "出行", "节令", "科举", "婚俗", "城市", "传闻"];
const dramaWorks = ["甄嬛传", "琅琊榜", "长安十二时辰", "大明王朝1566", "雍正王朝", "知否"];
const gossipPeople = ["李白", "苏轼", "乾隆", "曹操", "王安石", "李清照", "唐太宗", "张居正"];
const categoryTypes = ["成语", "新词", "影视", "制度"] as const;

type TimelineChapter = {
  dynasty: Dynasty;
  period: string;
  theme: string;
  topic: string;
  summary: string;
};

const homeTimelineByDynasty: Record<Dynasty, Array<Omit<TimelineChapter, "dynasty">>> = {
  唐: [
    { period: "建国", theme: "政权更替", topic: "隋唐更替与李唐建国", summary: "从隋末动乱、关陇集团到李渊起兵，建立唐朝的关键是军事联盟、地方控制和合法性塑造。" },
    { period: "初唐", theme: "权力结构", topic: "玄武门之变后的皇权重组", summary: "玄武门之变不只是宫廷冲突，也重塑了唐初皇权、功臣集团和太子制度之间的关系。" },
    { period: "初唐", theme: "盛世治理", topic: "贞观之治的制度基础", summary: "贞观政治依靠君臣互动、法制节制、赋役恢复和边疆经营共同支撑，并非单靠明君个人。" },
    { period: "初唐", theme: "法律制度", topic: "唐律疏议与帝国秩序", summary: "唐律把礼法、刑罚和行政秩序结合起来，成为理解唐代国家治理的重要入口。" },
    { period: "初唐", theme: "选官制度", topic: "科举与门第政治的拉扯", summary: "唐代科举已经打开上升通道，但门第、荐举和文名仍然深刻影响士人的政治机会。" },
    { period: "武周", theme: "女性政治", topic: "武则天时代的权力实验", summary: "武周改变了官僚选拔、政治符号和皇权叙事，也让唐代政治展现出罕见的制度弹性。" },
    { period: "盛唐", theme: "都城生活", topic: "长安城的开放与秩序", summary: "长安既是政治中心，也是商业、宗教、外交和城市管理交汇的世界性都市。" },
    { period: "盛唐", theme: "边疆交流", topic: "丝绸之路与胡汉文化交融", summary: "商旅、使节、僧侣和军镇让唐代文化具有开放气质，也带来边疆治理压力。" },
    { period: "盛唐", theme: "宗教文化", topic: "佛教寺院与社会生活", summary: "佛教不仅影响信仰，也进入城市经济、艺术、教育和国家礼仪之中。" },
    { period: "盛唐", theme: "文学艺术", topic: "李白杜甫与盛唐诗歌气象", summary: "李白和杜甫代表不同诗人气质，也共同记录了盛唐理想与时代转折。" },
    { period: "盛唐", theme: "外交格局", topic: "遣唐使与东亚文化圈", summary: "日本、新罗等地区通过使节、留学生和佛教网络吸收唐制，形成东亚文化互动。" },
    { period: "盛唐", theme: "经济基础", topic: "均田租庸调如何支撑国家", summary: "土地、户籍和赋役制度共同构成唐前期财政基础，一旦人口流动加剧就会出现裂缝。" },
    { period: "转折", theme: "财政变迁", topic: "两税法与唐代财政转向", summary: "两税法从按丁征收转向按资产和土地征收，反映国家面对社会流动的制度调整。" },
    { period: "转折", theme: "军事制度", topic: "府兵制衰落与募兵兴起", summary: "府兵制难以适应边防和土地变化，募兵与军镇逐渐改变唐代军事结构。" },
    { period: "转折", theme: "重大事件", topic: "安史之乱如何撕开盛唐", summary: "安史之乱串联朝政失衡、边将坐大、财政压力和地方割据，是唐代由盛转衰的关键。" },
    { period: "中唐", theme: "地方政治", topic: "藩镇割据与中央控制", summary: "藩镇并非单纯叛乱势力，它们在军事防御、财政征收和地方治理中形成复杂角色。" },
    { period: "中唐", theme: "社会变迁", topic: "江南经济为何开始上升", summary: "人口南移、水利开发和商业增长让江南地位不断提高，为宋代经济重心南移铺垫。" },
    { period: "中唐", theme: "文学转向", topic: "韩愈柳宗元与古文运动", summary: "古文运动不仅是文体改革，也包含士人对道统、政治和社会责任的重新理解。" },
    { period: "中唐", theme: "城市商业", topic: "坊市制度松动的日常影响", summary: "夜市、草市和商业空间扩张，改变了城市居民的消费、娱乐和出行方式。" },
    { period: "晚唐", theme: "党争", topic: "牛李党争与官僚政治内耗", summary: "晚唐党争反映科举士人与门第网络、皇权和宦官势力之间的长期冲突。" },
    { period: "晚唐", theme: "宦官政治", topic: "神策军与宦官专权", summary: "宦官掌握禁军后，皇帝、外朝和军队之间的权力边界被重新改写。" },
    { period: "晚唐", theme: "社会危机", topic: "黄巢起义与唐末崩解", summary: "黄巢起义暴露财政、盐政、地方治理和社会流动的多重危机，加速唐朝解体。" },
    { period: "晚唐", theme: "五代前夜", topic: "节度使如何走向五代格局", summary: "晚唐节度使的军事与财政独立，为五代十国的分裂格局提供直接条件。" },
    { period: "总结", theme: "历史影响", topic: "唐代遗产如何影响后世", summary: "唐代留下制度、诗歌、都城、东亚秩序和盛衰叙事，成为后世理解帝国文明的重要参照。" },
  ],
  宋: [
    { period: "建国", theme: "中央集权", topic: "陈桥兵变与宋初立国", summary: "宋太祖以军事政变建国，却通过杯酒释兵权和制度分权避免武人再次夺权。" },
    { period: "宋初", theme: "兵权制度", topic: "杯酒释兵权背后的制度设计", summary: "宋初削弱武将兵权，强化文官治理，为宋代重文轻武格局奠定基础。" },
    { period: "宋初", theme: "文官政治", topic: "士大夫政治如何形成", summary: "科举扩张和文官体系成熟，让士大夫成为国家治理和公共议论的核心群体。" },
    { period: "北宋", theme: "科举教育", topic: "宋代科举为何更像制度通道", summary: "宋代考试规模扩大、程序规范，推动家族教育、地方学校和士人身份认同重组。" },
    { period: "北宋", theme: "财政经济", topic: "宋朝经济为何能达到古代高峰", summary: "农业、手工业、货币、城市和海外贸易共同推动宋代经济高度发展。" },
    { period: "北宋", theme: "城市生活", topic: "东京汴梁的城市日常", summary: "夜市、瓦舍、食店、桥市和娱乐活动，让宋代城市呈现更开放的生活节奏。" },
    { period: "北宋", theme: "商业货币", topic: "交子与宋代货币革命", summary: "纸币出现反映商业信用、政府财政和区域贸易的变化，是经济复杂化的结果。" },
    { period: "北宋", theme: "出版传播", topic: "雕版印刷如何改变知识传播", summary: "印刷与书籍市场扩张，让经典、笔记、话本和考试资料更容易进入社会。" },
    { period: "北宋", theme: "科技", topic: "活字、火药、指南针的宋代场景", summary: "宋代技术创新与战争、航海、出版和手工业需求密切相关，而非孤立发明。" },
    { period: "北宋", theme: "边防", topic: "澶渊之盟与宋辽关系", summary: "澶渊之盟用岁币和边境和平换取稳定，体现宋代外交与军事现实的权衡。" },
    { period: "北宋", theme: "改革", topic: "王安石变法的社会争议", summary: "变法试图解决财政和军政问题，却牵动农民、商人、官僚和皇权之间的利益格局。" },
    { period: "北宋", theme: "党争", topic: "新旧党争如何消耗北宋政治", summary: "围绕变法的争论逐渐演变为官僚集团对立，影响政策连续性和政治信任。" },
    { period: "北宋", theme: "理学", topic: "理学兴起与士人修养", summary: "理学把经典解释、道德实践和社会秩序联系起来，深刻影响后世教育。" },
    { period: "北宋", theme: "文学", topic: "苏轼与宋代文人精神", summary: "苏轼的政治挫折、地方经验和文学创造，体现宋代士人的韧性与公共关怀。" },
    { period: "靖康", theme: "重大转折", topic: "靖康之变为何改变南北格局", summary: "靖康之变不仅是都城陷落，也改变了宋金对峙、人口流动和文化心理。" },
    { period: "南宋", theme: "南渡", topic: "临安如何成为新中心", summary: "南宋在江南重建政治和经济中心，临安城市生活延续并改造了宋代繁华。" },
    { period: "南宋", theme: "江南经济", topic: "经济重心南移如何完成", summary: "南宋江南农业、手工业和海贸发展，使中国经济地理出现长期转向。" },
    { period: "南宋", theme: "海外贸易", topic: "市舶司与海上贸易网络", summary: "南宋海贸连接东南亚、印度洋和国内港口，带来财政收入与城市活力。" },
    { period: "南宋", theme: "军事", topic: "岳飞叙事与宋金战争", summary: "岳飞故事背后是南宋军事防御、朝廷策略和民族记忆的复杂叠加。" },
    { period: "南宋", theme: "社会", topic: "宗族与地方社会的扩张", summary: "族谱、祠堂、义庄和地方教育共同加强了基层社会的组织能力。" },
    { period: "南宋", theme: "文化", topic: "宋词与城市审美", summary: "宋词与宴饮、歌伎、文人交游和城市消费相关，呈现精致而复杂的情感世界。" },
    { period: "南宋", theme: "知识", topic: "朱熹与书院体系", summary: "朱熹将理学、讲学和书院结合，使士人教育形成更稳定的思想结构。" },
    { period: "宋末", theme: "危机", topic: "蒙古压力下的南宋防线", summary: "南宋后期在财政、军事和地理防线中苦撑，最终难以抵御蒙古扩张。" },
    { period: "总结", theme: "历史影响", topic: "宋代为何影响后世中国", summary: "宋代的文官政治、城市经济、出版教育和士人精神，塑造了此后中国社会的许多底层结构。" },
  ],
  元: [
    { period: "兴起", theme: "草原帝国", topic: "蒙古兴起与欧亚秩序变化", summary: "蒙古扩张连接草原、农耕和商贸世界，改变了欧亚大陆的政治交通格局。" },
    { period: "征服", theme: "南北整合", topic: "从灭金到灭宋的统一过程", summary: "元朝统一经历长期军事推进，也面对如何治理不同区域和人群的问题。" },
    { period: "建国", theme: "都城", topic: "忽必烈建元与大都格局", summary: "忽必烈选择汉地制度和大都城市规划，显示草原帝国向多元帝国治理转型。" },
    { period: "制度", theme: "行省", topic: "行省制度如何管理辽阔疆域", summary: "行省让中央权力延伸到地方，也成为后世地方行政区划的重要源头。" },
    { period: "制度", theme: "驿站", topic: "站赤驿传与帝国交通", summary: "驿站系统支撑军令、商旅和信息流动，是元代跨区域治理的关键网络。" },
    { period: "制度", theme: "户籍", topic: "诸色户计与社会分层", summary: "元代按职业和身份组织户籍，既方便征发赋役，也固化了部分社会分层。" },
    { period: "财政", theme: "纸币", topic: "中统钞与元代货币治理", summary: "纸币流通体现元代财政需求和商业网络，也暴露信用与物价管理的风险。" },
    { period: "经济", theme: "运河", topic: "大运河与南粮北运", summary: "元代重修运河，把江南粮食和北方都城连接起来，支撑大都政治中心。" },
    { period: "经济", theme: "海贸", topic: "泉州港与海上交流", summary: "元代海贸繁荣连接阿拉伯、印度洋和东南亚世界，港口城市高度国际化。" },
    { period: "交流", theme: "多族群", topic: "多族群城市里的日常往来", summary: "蒙古、汉人、色目人和其他群体在市场、官府和宗教空间中共同生活又保持差异。" },
    { period: "宗教", theme: "信仰", topic: "藏传佛教与帝国政治", summary: "元代重视藏传佛教，宗教网络也进入边疆治理和皇权象征之中。" },
    { period: "文化", theme: "戏曲", topic: "元杂剧为何兴盛", summary: "城市娱乐、文人处境和商业舞台推动元杂剧发展，形成新的文学高峰。" },
    { period: "文化", theme: "文人", topic: "赵孟頫与元代书画转向", summary: "元代文人书画在政治失落与审美重建中形成新的传统意识。" },
    { period: "地方", theme: "江南", topic: "江南士人如何面对新王朝", summary: "江南士人在仕元、隐居、书画和地方社会之间寻找身份位置。" },
    { period: "边疆", theme: "西域", topic: "西域交通与东西交流", summary: "西域道路承载使节、商队和宗教传播，是元代世界性的一部分。" },
    { period: "法律", theme: "治理", topic: "元代法律如何处理多元社会", summary: "不同身份、习俗和行政传统并存，让元代法律治理呈现复杂层次。" },
    { period: "军事", theme: "征伐", topic: "海外征伐与帝国边界", summary: "元朝对日本、安南等地的行动显示扩张野心，也暴露海上军事和后勤限制。" },
    { period: "社会", theme: "民生", topic: "赋役压力与基层生活", summary: "赋役、差发和地方官吏共同影响普通人生活，社会矛盾逐渐累积。" },
    { period: "灾异", theme: "危机", topic: "水患与财政困局", summary: "黄河水患和财政紧张相互叠加，削弱元末国家治理能力。" },
    { period: "末期", theme: "起义", topic: "红巾军起义与元末动荡", summary: "元末起义既有灾荒和赋役因素，也与地方武装和宗教动员有关。" },
    { period: "末期", theme: "群雄", topic: "朱元璋崛起前的南方格局", summary: "元末南方群雄并起，财政、军队和地方士人支持决定政权成败。" },
    { period: "转折", theme: "明元更替", topic: "明朝建立与元廷北退", summary: "明元更替不是一夜完成，而是中原控制、北方边防和草原政治继续纠缠。" },
    { period: "遗产", theme: "制度影响", topic: "元代行省为何影响后世", summary: "行省、交通和多元治理经验，成为理解明清地方行政的重要前史。" },
    { period: "总结", theme: "历史影响", topic: "元代在中国史中的位置", summary: "元代连接草原、汉地和世界贸易，其制度遗产和文化冲突都深刻影响后世。" },
  ],
  明: [
    { period: "建国", theme: "王朝更替", topic: "朱元璋建明与洪武秩序", summary: "明朝建立在元末动乱之后，洪武皇帝以严密户籍、赋役和法律重塑国家秩序。" },
    { period: "洪武", theme: "皇权", topic: "废丞相后的皇权集中", summary: "废丞相让皇帝直接面对六部事务，也为后来的内阁和宦官政治埋下伏笔。" },
    { period: "洪武", theme: "基层治理", topic: "里甲黄册与鱼鳞图册", summary: "明初通过户籍、土地和赋役登记控制基层，是财政和社会秩序的基础工程。" },
    { period: "洪武", theme: "法律", topic: "大明律与严刑治理", summary: "明代法律强调秩序和惩戒，反映开国政权对官吏和百姓的强控制。" },
    { period: "靖难", theme: "政治转折", topic: "靖难之役与永乐迁都", summary: "靖难之役改变皇位继承，也推动北京成为新的政治和军事中心。" },
    { period: "永乐", theme: "海洋", topic: "郑和下西洋与国家远航", summary: "郑和远航展示明初国力和朝贡秩序，也不同于后来的民间海贸逻辑。" },
    { period: "永乐", theme: "边防", topic: "北京城与北方防线", summary: "迁都北京使王朝重心贴近边防，长城、军镇和粮运成为长期问题。" },
    { period: "制度", theme: "内阁", topic: "内阁如何成为决策中枢", summary: "内阁从秘书机构逐渐参与票拟和政务，弥补废丞相后的行政压力。" },
    { period: "制度", theme: "锦衣卫", topic: "锦衣卫与特务政治", summary: "锦衣卫承担侦缉、审讯和皇权耳目功能，显示明代皇权对官僚的不信任。" },
    { period: "中期", theme: "财政", topic: "白银流入与赋税变化", summary: "白银成为重要支付媒介，连接海外贸易、市场经济和国家财政。" },
    { period: "中期", theme: "改革", topic: "张居正改革与一条鞭法", summary: "张居正改革试图整顿财政和官僚，但也依赖强势政治资源维持。" },
    { period: "中期", theme: "海禁", topic: "海禁与倭寇问题", summary: "海禁政策、民间贸易和沿海武装冲突交织，使倭寇问题不能简单理解为外敌入侵。" },
    { period: "中期", theme: "商业", topic: "江南市镇与工商业扩张", summary: "棉纺、丝织、市镇和商帮让明代社会出现更强商业活力。" },
    { period: "中期", theme: "思想", topic: "王阳明心学为何流行", summary: "心学强调主体实践和良知，回应士人在科举和现实政治中的精神困境。" },
    { period: "中期", theme: "文学", topic: "小说戏曲如何进入大众生活", summary: "出版商业和城市娱乐推动小说戏曲传播，历史知识也被故事化、大众化。" },
    { period: "晚明", theme: "党争", topic: "东林党争与晚明政治", summary: "东林党争背后是财政、官僚伦理、皇权和地方士绅利益的复杂冲突。" },
    { period: "晚明", theme: "宦官", topic: "魏忠贤与宦官权力扩张", summary: "宦官权力依附皇权和厂卫系统，成为晚明政治信任崩坏的重要表现。" },
    { period: "晚明", theme: "边防", topic: "辽东危机与后金崛起", summary: "辽东军事、财政和将领体系问题，让明朝面对后金时越来越被动。" },
    { period: "晚明", theme: "财政危机", topic: "加派与农民负担", summary: "军费、灾荒和税收加派共同压迫基层社会，导致明末社会危机加深。" },
    { period: "晚明", theme: "灾荒", topic: "小冰期与明末灾荒", summary: "气候异常、粮价波动和地方治理失效互相叠加，放大了社会不稳定。" },
    { period: "晚明", theme: "起义", topic: "李自成起义与王朝崩解", summary: "农民军兴起与财政军事危机相互推动，最终冲击北京政权核心。" },
    { period: "转折", theme: "明清更替", topic: "山海关与清军入关", summary: "明清更替涉及农民军、边将、满洲政权和北方防线的多方互动。" },
    { period: "遗民", theme: "文化记忆", topic: "明遗民与王朝记忆", summary: "明亡后，遗民通过诗文、绘画和地方记忆保存对旧王朝的情感。" },
    { period: "总结", theme: "历史影响", topic: "明代制度遗产与社会变化", summary: "明代留下高度皇权、商业社会、白银财政和晚期危机，是理解清代与近世转型的关键。" },
  ],
  清: [
    { period: "入关", theme: "王朝更替", topic: "清军入关与新秩序建立", summary: "清朝入关后需要同时面对军事征服、官僚接收和文化合法性建构。" },
    { period: "顺治", theme: "制度整合", topic: "满汉官僚如何共同治理", summary: "清初通过满汉并用、六部和军机前身机制，逐渐建立跨族群统治结构。" },
    { period: "康熙", theme: "统一", topic: "平三藩与中央权威恢复", summary: "平定三藩让清朝摆脱地方藩镇威胁，巩固对南方的控制。" },
    { period: "康熙", theme: "边疆", topic: "雅克萨之战与东北边界", summary: "清朝与俄国交涉边界，显示传统王朝开始面对近代国际边界问题。" },
    { period: "康熙", theme: "治理", topic: "康熙巡幸与江南控制", summary: "南巡不只是游览，也包含安抚士绅、考察河工和展示皇权的政治目的。" },
    { period: "雍正", theme: "财政", topic: "摊丁入亩与税制调整", summary: "摊丁入亩把人丁税并入土地税，减轻部分人身控制，也改变地方财政结构。" },
    { period: "雍正", theme: "官僚", topic: "军机处如何提高决策效率", summary: "军机处强化皇帝直接处理军政事务的能力，使清代中央集权更加高效。" },
    { period: "乾隆", theme: "盛世", topic: "康乾盛世的繁荣与代价", summary: "人口增长、疆域扩展和财政稳定构成盛世表象，也带来资源压力和治理负担。" },
    { period: "乾隆", theme: "边疆", topic: "新疆纳入版图的过程", summary: "清朝通过军事、驻防和地方制度整合西北边疆，塑造多民族帝国格局。" },
    { period: "乾隆", theme: "文化", topic: "四库全书与文字狱", summary: "大型文化工程既整理典籍，也伴随思想审查和政治控制。" },
    { period: "乾隆", theme: "商业", topic: "广州十三行与外贸限制", summary: "广州一口通商把外贸集中管理，带来财富也积累中外制度摩擦。" },
    { period: "清中期", theme: "社会", topic: "人口增长与土地压力", summary: "人口快速增长推动移民、垦殖和市场发展，也让土地、粮价和贫困问题更突出。" },
    { period: "清中期", theme: "基层", topic: "宗族乡约与地方治理", summary: "基层社会依靠宗族、乡约、保甲和地方士绅共同维持秩序。" },
    { period: "清中期", theme: "文学", topic: "红楼梦与清代家族社会", summary: "《红楼梦》通过家族兴衰和情感伦理，折射清代士绅社会的秩序与危机。" },
    { period: "嘉庆", theme: "危机", topic: "白莲教起义与财政消耗", summary: "白莲教起义暴露基层控制松动、军费膨胀和地方治理问题。" },
    { period: "道光", theme: "鸦片", topic: "鸦片贸易为何冲击清朝", summary: "鸦片问题连接白银外流、财政危机、社会控制和中外贸易冲突。" },
    { period: "道光", theme: "战争", topic: "鸦片战争与通商口岸", summary: "鸦片战争改变清朝对外关系，也让沿海城市和条约体系进入新阶段。" },
    { period: "咸同", theme: "内乱", topic: "太平天国与地方军兴起", summary: "太平天国战争迫使清朝依赖地方团练和湘淮军，改变中央与地方权力关系。" },
    { period: "同治", theme: "洋务", topic: "洋务运动的自强逻辑", summary: "洋务运动试图以器物和工业技术挽救危局，却受到制度与观念边界限制。" },
    { period: "光绪", theme: "边疆", topic: "新疆建省与边疆治理转型", summary: "新疆建省代表清朝把边疆治理进一步纳入内地化行政体系。" },
    { period: "光绪", theme: "变法", topic: "戊戌变法为何失败", summary: "变法触及制度、官僚和皇权结构，但缺少稳定政治基础，迅速失败。" },
    { period: "晚清", theme: "战争", topic: "甲午战争与东亚秩序崩塌", summary: "甲午战争不仅是军事失败，也意味着传统朝贡秩序和自强路线遭受重击。" },
    { period: "晚清", theme: "新政", topic: "清末新政与制度转型", summary: "清末新政推动教育、军制和官制改革，却已难以挽回政治信任危机。" },
    { period: "总结", theme: "历史影响", topic: "清代遗产与近代转折", summary: "清代留下多民族疆域、基层治理、文化控制和近代冲击，是传统王朝走向近代的关键阶段。" },
  ],
};

const homeTimelineChapters: TimelineChapter[] = dynastyCycle.flatMap((dynasty) =>
  homeTimelineByDynasty[dynasty].map((chapter) => ({ dynasty, ...chapter }))
);

function getHomeTimelineChapter(index: number) {
  return homeTimelineChapters[(index - 1) % homeTimelineChapters.length];
}

const curatedTitleContents: RawContent[] = [
  {
    id: 90001,
    title: "科举制度如何重塑唐宋社会流动",
    content:
      "科举制的关键意义，不只是把考试变成选官工具，而是改变了士人进入国家秩序的路径。唐代科举仍与门第、荐举、文学声名交织；到宋代，考试规模扩大、录取制度趋于规范，寒门士人获得了更多制度化上升机会。它一方面削弱门阀垄断，另一方面也让地方教育、家族投资和士人身份认同围绕考试重新组织。理解唐宋社会流动，必须同时看到制度开放、资源不均和地方治理三条线索。",
    type: "article",
    category: "首页内容",
    tags: "科举",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90002,
    title: "《红楼梦》中的家族秩序与情感伦理",
    content:
      "《红楼梦》的人物关系并不是单纯的爱情或家庭故事，而是一套礼法秩序中的情感实验。贾府依靠宗法、婚姻、等级和财产维持体面，个体情感却不断从这些结构缝隙中流露出来。宝玉、黛玉、宝钗等人的选择，既有性格差异，也受家族利益和社会期待牵引。阅读时可抓住三层：家族如何安排人，礼法如何约束人，情感如何让人物显出真实生命。",
    type: "article",
    category: "红楼梦",
    tags: "家族",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90003,
    title: "李白和杜甫在洛阳相遇时聊了什么？",
    content:
      "李白与杜甫相遇于盛唐转折前夜，二人的交往常被后世视为中国文学史上的高光时刻。史料无法逐字还原他们的谈话，但可以从诗作、交游和时代处境推测其精神主题：李白代表豪纵、游仙与功名想象，杜甫则逐渐走向沉郁、现实与家国关怀。洛阳相遇的意义，不在于补写一段传奇对白，而在于看见两种诗人气质如何面对同一个时代：一个仍相信远游、声名和超越现实的可能，一个开始把个人遭遇放进国家秩序与民生困境中理解。读这段关系，适合同时关注文学史、士人仕途和安史之乱前的社会气候。",
    type: "article",
    category: "八卦来了",
    tags: "李白",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90004,
    title: "《红楼梦》里的建筑美学，如何体现在潇湘馆？",
    content:
      "潇湘馆的建筑美学与林黛玉的人物气质互相映照。竹影、清幽、疏朗、带有隔绝感的空间，共同塑造出一种敏感而自守的精神氛围。大观园不是普通园林布景，而是人物命运的空间化表达：怡红院偏热闹，蘅芜苑偏冷静，潇湘馆则把才情、孤高与病弱感压缩在同一处景观里。理解潇湘馆，不能只看“好看”的园林描写，还要看贾府如何用空间安排身份、性情和社交秩序。它既是黛玉的居所，也是读者进入清代家族伦理、女性才情和情感压抑的一处入口。",
    type: "article",
    category: "红楼梦",
    tags: "建筑",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90005,
    title: "科举改变了谁的人生路径？",
    content:
      "科举改变的是士人、家族和地方社会的共同路径。对个人而言，它提供了相对明确的上升通道；对家族而言，读书和应试成为长期投资；对地方而言，学校、书院、刻书和师友网络因此扩张。但科举并不等于绝对公平，家庭资源、地域条件和政治环境仍然影响结果。它真正改变的，是人们理解“前途”的方式：身份不再只由出身决定，知识、文章、考试和官僚资格被放进同一套评价体系。读科举史，重点不是背制度名词，而是看它如何重塑教育市场、家族策略、地方声望和国家选官。",
    type: "article",
    category: "首页内容",
    tags: "科举",
    difficulty: "易",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90006,
    title: "《竹书纪年》与《史记》关于商系谱差异，应以哪本为准？",
    content:
      "《竹书纪年》与《史记》关于商代世系和年代的差异，不能简单用“哪本更准”来回答。《史记》体现汉代史学整理后的叙事系统，《竹书纪年》则保留了另一条编年传统。判断时要结合出土文献、甲骨材料、传世文本成书背景和后世辑佚过程。更稳妥的结论是：两者都不能孤立作为唯一标准，应按具体条目做证据等级判断。",
    type: "article",
    category: "典籍探疑",
    tags: "竹书纪年",
    difficulty: "难",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90007,
    title: "里耶秦简“迁陵县”的文字写法，与汉地统治关系如何解读？",
    content:
      "里耶秦简中的迁陵县材料，是理解秦代基层治理的重要入口。文字写法、行政术语和文书格式，反映出秦制在地方推行时的标准化努力，也能看到边地治理的复杂性。它不是单纯的文字问题，而牵涉户籍、徭役、邮传、司法和县级行政运行。阅读此类材料，要把字形辨识、制度名词和地理位置放在一起分析。",
    type: "article",
    category: "典籍探疑",
    tags: "里耶秦简",
    difficulty: "难",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90008,
    title: "《诗经》之“相如”于何时、何人语料最早可系年？",
    content:
      "《诗经》语词系年问题需要避免把后世解释直接当作先秦事实。所谓“相如”相关语料，首先要确认字词形态、篇章语境和传注来源，再比较毛传、郑笺及后世训诂的解释路径。可系年的材料越早，结论越稳；若只有晚出注释支撑，则应标注不确定性。典籍探疑的重点，是把证据链摆清楚，而不是抢先给绝对答案。",
    type: "article",
    category: "典籍探疑",
    tags: "诗经",
    difficulty: "难",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90009,
    title: "《四书集注》中与阳明后学批判朱子的对比核心是什么？",
    content:
      "朱子学与阳明后学的差异，核心不只是“理在外”或“心即理”的口号，而是修养路径和知识依据的不同。朱子强调格物穷理、经典秩序和层层工夫；阳明后学更重良知现成、主体实践与当下体认。比较《四书集注》与后学批评，要看他们如何解释同一句经文，以及这种解释如何服务于不同的成德路径。",
    type: "article",
    category: "典籍探疑",
    tags: "四书集注",
    difficulty: "难",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90010,
    title: "《资治通鉴》与《通鉴纪事本末》在叙事目的上有何不同？",
    content:
      "《资治通鉴》以编年体组织历史，强调连续时间中的政治得失；《通鉴纪事本末》则按事件本末重组材料，便于读者追踪一件事的起因、经过和结果。前者适合观察长期趋势，后者适合把复杂事件拆成完整专题。两种体例没有高下之分，差异在于历史知识的组织方式不同。",
    type: "article",
    category: "典籍探疑",
    tags: "资治通鉴",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90011,
    title: "《汉书·艺文志》为何成为后世目录学分流的关键节点？",
    content:
      "《汉书·艺文志》之所以重要，是因为它把知识分类与国家藏书、学术谱系连接起来。六艺、诸子、诗赋、兵书、数术、方技等分类，不只是书目排列，也体现了汉代对知识价值和秩序的判断。后世目录学不断继承、调整或回应这一框架，因此它成为理解中国古代知识分类的关键节点。",
    type: "article",
    category: "典籍探疑",
    tags: "汉书",
    difficulty: "中",
    image: "",
    source: "文脉专题",
  },
  {
    id: 90101,
    title: "廉贞虎传导读：边地治理与军政平衡",
    content: "廉贞虎传可以作为理解边地治理的入口。人物命运背后，是军政资源、地方秩序和民生压力之间的拉扯。阅读时要注意传记如何安排功绩、冲突与评价，也要追问边地官员面对的现实约束。边地人物传记往往不只是个人成败记录，它还会暴露王朝如何调配军队、财政、交通和地方精英。读这类文本，要把人物评价和制度环境分开：传记称颂的忠勇，背后可能是长期缺粮、兵源不足、族群互动和地方自治空间的复杂结果。",
    type: "video",
    category: "典籍探疑",
    tags: "边地治理",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90102,
    title: "孛亲丑传中的族群叙事如何演变",
    content: "族群叙事常在不同文本中发生变化：有的强调身份来源，有的强调功业归属，有的服务于王朝正统论述。读孛亲丑传，重点是比较版本差异，判断哪些描述来自事实记录，哪些属于后世叙事加工。人物在不同史书、地方文献或族谱中被重新书写，通常反映的是政治身份、地方记忆和王朝合法性的变化。它适合被当作一个方法案例：同一个人为什么会被不同群体讲成不同样子，哪些细节被突出，哪些矛盾被淡化。",
    type: "article",
    category: "典籍探疑",
    tags: "族群叙事",
    difficulty: "难",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90103,
    title: "天津传播客：港埠文化与商贸网络",
    content: "天津的港埠文化并非只由地理位置决定，还与漕运、盐政、近代通商和城市移民有关。商贸网络塑造了城市气质，也带来语言、饮食、行业组织和公共空间的变化。理解一座港埠城市，不能只看地图上的水路位置，还要看货物流动、官府管理、商人组织和外来人口如何共同塑造日常生活。这个标题适合扩展成城市史内容：从码头、会馆、市场、行业和方言入手，解释城市性格如何被经济网络长期沉淀出来。",
    type: "podcast",
    category: "首页内容",
    tags: "城市史",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90104,
    title: "地方志里的人物志该怎么读",
    content: "地方志人物志不是简单名人录。它体现地方社会如何选择值得记忆的人：忠孝节义、科举功名、乡贤治理、烈女传记等分类，都带有明确价值判断。阅读时要看入选标准、叙事套语和地方利益。人物志最有价值的地方，往往不在于某个人多传奇，而在于地方社会如何通过“入志”确认声望、伦理和秩序。读的时候可以问三件事：谁被写进去，谁没有被写进去，编纂者为什么要这样安排。这能帮助我们从地方志进入基层社会史。",
    type: "video",
    category: "典籍探疑",
    tags: "地方志",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90105,
    title: "《竹书纪年》争议条目逐条辨析",
    content: "《竹书纪年》的争议来自文本流传复杂、辑佚过程漫长，以及它与传统正史系统存在差异。辨析时要逐条看证据来源，不能把全书一概判真或判伪。它的重要性不在于提供一个可以替代《史记》的简单答案，而在于提醒读者：古代历史知识本来就存在多条记忆系统。逐条辨析时，需要区分原始材料、后世辑佚、现代校勘和解释推断。这样才能把“有争议”变成可讨论的问题，而不是停在真伪判断。",
    type: "article",
    category: "典籍探疑",
    tags: "竹书纪年",
    difficulty: "难",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90106,
    title: "里耶秦简与县治建构：一线史料观察",
    content: "里耶秦简让我们看到秦代县治并非抽象制度，而是由户籍、文书、徭役、司法和邮传共同支撑的基层运行系统。它的价值在于把宏大帝国拉回日常行政现场。过去谈秦制，容易停留在郡县制、统一文字、严刑峻法这些概念上；简牍材料则让我们看到命令如何下达、文书如何流转、基层官吏如何处理具体事务。读里耶秦简，重点是把制度名词还原成一套日常运行机制。",
    type: "video",
    category: "典籍探疑",
    tags: "里耶秦简",
    difficulty: "难",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90107,
    title: "诗经系年问题：谁在什么时候说了什么",
    content: "《诗经》系年不是给每篇诗强行贴年份，而是在语言、礼制、地名、人物和传承系统之间寻找较稳妥的时间线索。可信结论往往来自多重证据相互支持。这个问题看似细碎，其实关系到我们如何使用古典文本：一首诗到底能不能被当作某个时代、某个群体、某种制度的证据？读法上要避免两种极端，一是把传统一概当事实，二是因为不能精确断年就放弃分析。更好的方法，是建立证据等级。",
    type: "podcast",
    category: "典籍探疑",
    tags: "诗经",
    difficulty: "难",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90108,
    title: "《四书集注》与阳明后学争论面面观",
    content: "《四书集注》与阳明后学的争论，集中在经典解释、修养工夫和道德主体的关系上。比较二者，不宜只背概念，而要回到具体经文章句，看解释如何导向不同实践。朱子学更强调通过格物、读书和次第工夫抵达对天理的认识，阳明后学则更强调良知、主体觉悟和当下实践。争论的背后，是明代士人在科举、政治挫折和道德实践之间寻找精神支点。读这类思想史内容，应同时看概念、文本和社会处境。",
    type: "article",
    category: "典籍探疑",
    tags: "四书集注",
    difficulty: "难",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90109,
    title: "河间府志中的士人网络结构图",
    content: "府志中的人物互引、师友关系、科举同榜和家族婚姻，能帮助重建地方士人网络。它不仅说明谁有名，也说明地方知识共同体如何形成。士人网络不是抽象的“文化圈”，而是由书院、考试、婚姻、师承、祠祀和地方公共事务连接起来的关系结构。把这些线索画出来，就能看到地方社会如何生产声望，如何把个人功名转化为家族和区域的长期资源。",
    type: "video",
    category: "分类浏览",
    tags: "清-制度",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90110,
    title: "永平府志里的边防与交通线索",
    content: "边防与交通往往共同决定地方城市的历史地位。永平府志中的关隘、驿路、军防与商旅记载，可以串联出北方防线和区域流通的双重结构。边地城市并不只是战争前线，它还承担物资转运、官员往来、商旅停驻和信息传递。读永平府志，可以把城池、驿站、山川、关口和市场放在同一张图上，看明清北方治理如何在军事安全与区域流动之间取得平衡。",
    type: "podcast",
    category: "分类浏览",
    tags: "明-制度",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90111,
    title: "蓟州传：关口叙事的历史记忆形成",
    content: "关口地带常被地方史赋予强烈记忆，因为它连接军事防御、交通往来和身份边界。蓟州相关叙事正是在这种边防经验中不断被书写和重述。一个地方被反复写成“关口”，通常不仅因为地理险要，也因为它承担了王朝边防、地方身份和历史荣誉的象征功能。读蓟州相关材料，要看它如何把战争、山川、城池、人物和忠义故事组合成地方记忆。",
    type: "article",
    category: "分类浏览",
    tags: "明-历史",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90112,
    title: "从《汉书·艺文志》看知识分类体系",
    content: "《汉书·艺文志》的分类方式，是古代知识秩序的一次重要定型。它把书籍、学派和国家治理联系起来，影响后世目录学和学术史叙述。目录不是简单的书单，而是一种知识地图：哪些书被归为经学，哪些被归为诸子，哪些进入术数、方技或兵书，都体现国家和学者对知识价值的判断。读《艺文志》，可以训练一种能力：通过分类方式理解古人如何安排世界。",
    type: "video",
    category: "典籍探疑",
    tags: "汉书",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90113,
    title: "宋代新词汇如何进入民间日常",
    content: "宋代商业、城市、出版和文人交往推动了新词汇扩散。词语从诗文、笔记、话本进入日常语言，背后是社会生活和媒介环境的变化。新词汇不是凭空出现的，它往往对应新的消费场景、职业分工、城市娱乐、官僚表达和知识传播渠道。读宋代语言变化，可以把它和瓦舍、酒楼、书籍市场、科举教育、文人社交放在一起看。语言史因此成为观察社会变迁的一条细线。",
    type: "podcast",
    category: "八卦来了",
    tags: "新词",
    difficulty: "易",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90114,
    title: "明清话本中的历史知识普及策略",
    content: "明清话本常把历史知识放进可记忆的故事结构里，通过人物冲突、因果报应和世情细节完成传播。它既娱乐读者，也重塑大众对历史的理解。话本的关键不只是“讲故事”，而是把复杂历史压缩成容易传播的情节单位：忠奸、报应、奇遇、家族兴衰、官场得失。随着商业出版和城市阅读人群扩大，历史知识不再只由正史和士人课堂传播，也进入市井娱乐和日常谈资。",
    type: "article",
    category: "剧说古今",
    tags: "话本",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90115,
    title: "史记与通鉴的叙事节奏差异导读",
    content: "《史记》偏重人物传记的生命张力，《资治通鉴》偏重连续政治事件中的得失判断。同一事件在两种书写中节奏不同，读者得到的历史感也不同。《史记》常把人物放在命运、性格和时代冲突中展开，让读者记住人的抉择；《通鉴》则把事件放入连续时间和政治因果中，让读者观察治乱得失。比较二者，不是判断哪一本更好，而是理解不同体例如何塑造不同的历史判断。",
    type: "video",
    category: "典籍探疑",
    tags: "史记",
    difficulty: "中",
    image: "",
    source: "文脉精选",
  },
  {
    id: 90116,
    title: "文史播客：地方志中的城市气质形成",
    content: "地方志记录山川、城池、人物、风俗和物产，这些材料共同塑造城市气质。用声音化方式串联地方志，可以让空间记忆和社会情感更容易被理解。所谓城市气质，不只是今天的旅游标签，而是长期行政区划、交通位置、产业结构、士人书写和民间记忆叠加出来的结果。把地方志做成播客，可以按空间路线讲述一座城：先看山川城池，再看人物风俗，最后回到城市如何记住自己。",
    type: "podcast",
    category: "首页内容",
    tags: "地方志",
    difficulty: "易",
    image: "",
    source: "文脉精选",
  },
];

function buildGeneratedTitle(category: string, index: number, dynasty: string, angle: string) {
  if (category === "剧说古今") {
    const work = dramaWorks[index % dramaWorks.length];
    return `${work}第${index}个历史细节考据`;
  }
  if (category === "八卦来了") {
    const person = gossipPeople[index % gossipPeople.length];
    return `${person}身边的${angle}小史真相`;
  }
  if (category === "典籍探疑") return `${dynasty}代史料疑点第${index}问`;
  if (category === "首页内容") {
    const chapter = getHomeTimelineChapter(index);
    return `${chapter.dynasty}代文化速读：${chapter.topic}`;
  }
  if (category === "分类浏览") return `${dynasty}代${angle}知识卡片第${index}则`;
  return `${category}${angle}导读第${index}篇`;
}

function buildGeneratedContent(category: string, index: number, dynasty: string, angle: string) {
  if (category === "首页内容") {
    const chapter = getHomeTimelineChapter(index);
    return `${chapter.summary} 本节位于${chapter.dynasty}代时间线的“${chapter.period}”阶段，核心主题是${chapter.theme}。阅读时可以抓住三个问题：它回应了什么时代处境，它改变了哪些制度或日常生活，它又怎样影响后续历史。`;
  }
  if (category === "八卦来了") {
    return `这条内容回答“${angle}背后到底发生了什么”：先交代流行说法，再区分史料记载、后世附会与合理推断。结论是不要只记猎奇版本，而要把人物处境、时代礼俗和材料出处连在一起看。`;
  }
  if (category === "剧说古今") {
    return `本篇围绕影视桥段做史实核对：哪些来自制度背景，哪些属于戏剧压缩，哪些是人物塑造需要。读完可以获得一份清晰答案，知道该如何把剧情、史料和时代常识分开。`;
  }
  if (category === "典籍探疑") {
    return `问题核心在于不同文献的叙事角度并不相同。本文给出基本结论、证据线索和不确定处，帮助你判断“可确认”“可讨论”和“暂不可证”的边界。`;
  }
  if (category === "分类浏览") {
    return `这是一张可直接复习的知识卡：先解释${dynasty}代${angle}的基本含义，再给出常见误区、代表案例和考试/阅读中的使用场景。`;
  }
  return `围绕${category}中的${angle}主题，本文给出核心答案、关键人物、情节线索和文化含义。适合先快速建立判断，再进入原著或相关史料做精读。`;
}

function generateSupplementalContents(): RawContent[] {
  const rows: RawContent[] = [];

  generatedContentCategories.forEach((category, categoryIndex) => {
    for (let i = 1; i <= 120; i += 1) {
      const homeChapter = category === "首页内容" ? getHomeTimelineChapter(i) : null;
      const dynasty = homeChapter?.dynasty ?? dynastyCycle[(i + categoryIndex) % dynastyCycle.length];
      const angle =
        homeChapter?.theme ??
        (category === "分类浏览"
          ? categoryTypes[i % categoryTypes.length]
          : category === "剧说古今"
            ? dramaWorks[i % dramaWorks.length]
            : category === "八卦来了"
              ? lifeAngles[i % lifeAngles.length]
              : classicAngles[i % classicAngles.length]);

      rows.push({
        id: 10000 + categoryIndex * 1000 + i,
        title: buildGeneratedTitle(category, i, dynasty, angle),
        content: buildGeneratedContent(category, i, dynasty, angle),
        type: typeCycle[i % typeCycle.length],
        category,
        tags: homeChapter ? `${homeChapter.dynasty}-${homeChapter.period}-${homeChapter.theme}` : category === "分类浏览" ? `${dynasty}-${angle}` : angle,
        difficulty: difficultyCycle[i % difficultyCycle.length],
        image: "",
        source: "文脉内容库",
      });
    }
  });

  return rows;
}

const rawContents = [...baseRawContents, ...curatedTitleContents, ...generateSupplementalContents()];

const themeByCategory: Record<string, ContentCoverTheme> = {
  红楼梦: "lantern",
  三国演义: "palace",
  水浒传: "landscape",
  西游记: "mountain",
  剧说古今: "drama",
  八卦来了: "tea",
  典籍探疑: "scroll",
  首页内容: "calligraphy",
  分类浏览: "bronze",
};

const typeMap = { article: "长文", video: "视频", podcast: "播客" } as const;

export type ContentRecord = RawContent & { theme: ContentCoverTheme; contentTypeCN: ContentTypeCN };

export const allContentRecords: ContentRecord[] = rawContents.map((item) => ({
  ...item,
  theme: themeByCategory[item.category] ?? "scroll",
  contentTypeCN: typeMap[item.type],
}));

export const latestContentFromCsv = rawContents
  .filter((item) => item.category === "首页内容")
  .map((item) => ({
    id: `csv-${item.id}`,
    title: item.title,
    desc: item.content,
    type: typeMap[item.type],
    theme: themeByCategory[item.category] ?? "scroll",
    url: `/content/${item.id}`,
    publishedAt: "2026.04.29",
    playCount: 12000 + item.id * 137,
  }));

export const classicsContentFromCsv = {
  红楼梦: rawContents.filter((item) => item.category === "红楼梦"),
  三国演义: rawContents.filter((item) => item.category === "三国演义"),
  水浒传: rawContents.filter((item) => item.category === "水浒传"),
  西游记: rawContents.filter((item) => item.category === "西游记"),
};

export const selectedFeedFromCsv = rawContents
  .filter((item) => ["典籍探疑", "剧说古今", "八卦来了"].includes(item.category))
  .slice(0, 12)
  .map((item) => ({
    id: `csv-${item.id}`,
    title: item.title,
    desc: item.content,
    type: "视频" as const,
    theme: themeByCategory[item.category] ?? "scroll",
    likes: 3000 + item.id * 120,
    collects: 1800 + item.id * 80,
    comments: 60 + item.id * 5,
    views: 10000 + item.id * 310,
    url: `/content/${item.id}`,
  }));

export const categoryContentFromCsv = rawContents
  .filter((item) => item.category === "分类浏览")
  .map((item) => {
    const [dynasty, maybeType] = item.tags.split("-");
    const type = maybeType?.includes("成语")
      ? "成语"
      : maybeType?.includes("新词")
        ? "新词"
        : maybeType?.includes("影视")
          ? "影视"
      : maybeType?.includes("官制") || maybeType?.includes("制度") || maybeType?.includes("政治")
        ? "历史"
        : "历史";
    return {
      id: `csv-${item.id}`,
      dynasty: (["唐", "宋", "元", "明", "清"].includes(dynasty) ? dynasty : "唐") as "唐" | "宋" | "元" | "明" | "清",
      contentType: type as "成语" | "新词" | "影视" | "历史",
      title: item.title,
      desc: item.content,
      theme: themeByCategory[item.category] ?? "bronze",
      likes: 2200 + item.id * 90,
      collects: 900 + item.id * 35,
      url: `/content/${item.id}`,
    };
  });

const difficultyMap: Record<string, ExamDifficulty> = {
  易: "简单",
  Easy: "简单",
  中: "中等",
  Medium: "中等",
  难: "困难",
  Hard: "困难",
};

const examTypeCycle: ExamType[] = ["高考", "考研", "GRE", "美国高考"];
const answerCycle = ["A", "B", "C", "D"] as const;
const historyTopics = [
  {
    dynasty: "唐" as const,
    period: "唐宋",
    keyword: "科举制",
    concept: "选官制度扩大了士人进入国家治理体系的通道",
    wrongA: "完全取消地方家族对教育资源的影响",
    wrongB: "使商业资本直接取代官僚集团",
    wrongC: "让皇位继承变成公开考试",
  },
  {
    dynasty: "宋" as const,
    period: "宋代",
    keyword: "城市经济",
    concept: "坊市限制弱化、商业活动和市民文化更活跃",
    wrongA: "实行严格闭关锁国并禁止夜市",
    wrongB: "废除纸币并只允许实物交换",
    wrongC: "地方城市全部转为军事堡垒",
  },
  {
    dynasty: "元" as const,
    period: "元代",
    keyword: "行省制度",
    concept: "加强中央对地方的行政整合，并影响后世省制",
    wrongA: "恢复西周分封制作为唯一地方制度",
    wrongB: "以科举成绩直接划分全部行政区",
    wrongC: "取消中央对边疆地区的管理",
  },
  {
    dynasty: "明" as const,
    period: "明代",
    keyword: "内阁与票拟",
    concept: "皇权强化背景下形成辅助决策的文官运作机制",
    wrongA: "内阁正式取代皇帝成为最高统治者",
    wrongB: "地方藩镇获得独立军事财政权",
    wrongC: "科举完全停止并改用世袭官职",
  },
  {
    dynasty: "清" as const,
    period: "清代",
    keyword: "边疆治理",
    concept: "通过军政、盟旗、驻防与多元制度整合边疆",
    wrongA: "废除一切地方差异并只保留郡县",
    wrongB: "完全放弃对西北和西南地区的管理",
    wrongC: "用城市自治替代中央任官体系",
  },
  {
    dynasty: "唐" as const,
    period: "盛唐",
    keyword: "安史之乱",
    concept: "唐朝由盛转衰，藩镇与财政格局发生深刻变化",
    wrongA: "直接导致秦朝统一六国",
    wrongB: "标志宋代经济重心南移完成",
    wrongC: "使明代海禁政策正式开始",
  },
  {
    dynasty: "宋" as const,
    period: "北宋",
    keyword: "王安石变法",
    concept: "试图通过财政、军事与基层治理改革缓解国家压力",
    wrongA: "核心目标是恢复分封并削弱中央",
    wrongB: "主要内容是停止学校教育",
    wrongC: "唯一措施是迁都江南",
  },
  {
    dynasty: "明" as const,
    period: "明清",
    keyword: "白银货币化",
    concept: "赋役折银和海外贸易推动白银在财政与市场中的地位上升",
    wrongA: "意味着铜钱彻底消失且民间不得交易",
    wrongB: "只发生在西周宗法制度内部",
    wrongC: "使所有地方税收改为实物粮食",
  },
];

const greTopics = [
  {
    keyword: "historiography",
    stem: "In the passage, a historian distinguishes archival evidence from later legend. The author's attitude toward legend is best described as",
    answer: "cautious but not dismissive",
    wrongA: "uncritically celebratory",
    wrongB: "openly hostile to all narrative sources",
    wrongC: "indifferent to evidentiary standards",
    point: "Reading inference",
  },
  {
    keyword: "continuity",
    stem: "The sentence argues that institutional change often preserves older habits beneath new forms. Which choice best captures this claim?",
    answer: "Reform may alter procedures while leaving social expectations partly intact.",
    wrongA: "Every reform immediately removes inherited practices.",
    wrongB: "Institutions never change after they are established.",
    wrongC: "Social expectations are irrelevant to political institutions.",
    point: "Sentence equivalence",
  },
  {
    keyword: "patronage",
    stem: "A court poet's success depended not only on talent but also on access to patrons. The word 'patrons' most nearly means",
    answer: "powerful supporters",
    wrongA: "anonymous opponents",
    wrongB: "ordinary readers",
    wrongC: "legal punishments",
    point: "Vocabulary in context",
  },
  {
    keyword: "causation",
    stem: "The passage warns against treating one dramatic event as the sole cause of dynastic decline. The warning is primarily about",
    answer: "oversimplifying historical causation",
    wrongA: "denying that events have consequences",
    wrongB: "preferring fiction to evidence",
    wrongC: "rejecting chronological order",
    point: "Critical reasoning",
  },
];

const usExamTopics = [
  {
    dynasty: "唐" as const,
    keyword: "Silk Road exchange",
    question: "Which historical development most directly encouraged cultural exchange along Eurasian trade routes?",
    answer: "Stable empires and merchant networks connected distant regions.",
    wrongA: "The complete isolation of all agrarian societies.",
    wrongB: "The disappearance of long-distance trade.",
    wrongC: "The abolition of cities across Asia.",
    point: "AP World History comparison",
  },
  {
    dynasty: "宋" as const,
    keyword: "commercialization",
    question: "Song China's use of paper money is best understood as evidence of",
    answer: "increasing commercialization and monetary complexity.",
    wrongA: "the absence of market exchange.",
    wrongB: "a return to purely nomadic production.",
    wrongC: "the end of state involvement in finance.",
    point: "AP World History evidence",
  },
  {
    dynasty: "明" as const,
    keyword: "maritime expeditions",
    question: "The Ming voyages led by Zheng He primarily demonstrate",
    answer: "state-sponsored maritime diplomacy and display of imperial power.",
    wrongA: "private colonization of the Americas.",
    wrongB: "the immediate industrialization of China.",
    wrongC: "the end of tribute relations in Asia.",
    point: "SAT/AP historical interpretation",
  },
  {
    dynasty: "清" as const,
    keyword: "multiethnic empire",
    question: "Qing frontier policies are often used by historians to illustrate",
    answer: "the governance challenges of a multiethnic land empire.",
    wrongA: "the lack of any territorial expansion.",
    wrongB: "the replacement of bureaucracy with direct democracy.",
    wrongC: "the collapse of all military institutions.",
    point: "AP World History theme",
  },
];

export const officialPublicExamSets: OfficialPublicExamSet[] = [
  {
    id: "official-gre-verbal",
    examType: "GRE",
    title: "GRE Verbal Reasoning Sample Questions",
    provider: "ETS",
    url: "https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html",
    skill: "Reading Comprehension / Text Completion / Sentence Equivalence",
    description: "ETS 官方公开 Verbal 样题入口，适合训练阅读推断、句子填空和语义等价。",
  },
  {
    id: "official-gre-quant",
    examType: "GRE",
    title: "GRE Quantitative Reasoning Sample Questions",
    provider: "ETS",
    url: "https://www.ets.org/gre/test-takers/general-test/prepare/content/quantitative-reasoning.html",
    skill: "Arithmetic / Algebra / Geometry / Data Analysis",
    description: "ETS 官方公开 Quant 样题入口，适合训练定量推理、建模和计算策略。",
  },
  {
    id: "official-gre-aw-issue",
    examType: "GRE",
    title: "GRE Analytical Writing Issue Task",
    provider: "ETS",
    url: "https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing/issue.html",
    skill: "Analyze an Issue",
    description: "ETS 官方公开写作任务说明和题池入口，适合训练立场、论证和例证组织。",
  },
  {
    id: "official-sat-question-bank",
    examType: "美国高考",
    title: "SAT Suite Student Question Bank",
    provider: "College Board",
    url: "https://satsuite.collegeboard.org/practice/student-question-bank",
    skill: "Reading and Writing / Math",
    description: "College Board 官方题库入口，可按 assessment、domain、skill、difficulty 等维度筛选。",
  },
  {
    id: "official-sat-practice-tests",
    examType: "美国高考",
    title: "SAT Full-Length Practice Tests",
    provider: "College Board",
    url: "https://satsuite.collegeboard.org/practice/practice-tests",
    skill: "Full-Length SAT Practice",
    description: "College Board 官方完整练习测试入口，包含 Bluebook 和可下载纸质练习资源。",
  },
  {
    id: "official-ap-world-frq",
    examType: "美国高考",
    title: "AP World History: Modern Past Exam Questions",
    provider: "College Board",
    url: "https://apcentral.collegeboard.org/courses/ap-world-history/exam/past-exam-questions",
    skill: "SAQ / DBQ / LEQ",
    description: "AP Central 官方公开近年 FRQ、评分指南和样卷入口，适合训练世界史材料分析与论证。",
  },
];

function rotateOptions(answer: string, wrongA: string, wrongB: string, wrongC: string, index: number) {
  const ordered = [answer, wrongA, wrongB, wrongC];
  const correct = answerCycle[index % 4];
  const optionsByKey: Record<"A" | "B" | "C" | "D", string> = {
    A: "",
    B: "",
    C: "",
    D: "",
  };

  answerCycle.forEach((key, position) => {
    const sourceIndex = (position - (index % 4) + 4) % 4;
    optionsByKey[key] = ordered[sourceIndex];
  });

  return {
    correct,
    options: answerCycle.map((key) => ({ key, text: optionsByKey[key] })),
  };
}

function generateSupplementalExamQuestions() {
  const rows = [];

  for (let i = 0; i < 720; i += 1) {
    const examType = examTypeCycle[i % examTypeCycle.length];
    const difficulty = (["简单", "中等", "困难"] as const)[i % 3];

    if (examType === "GRE") {
      const topic = greTopics[i % greTopics.length];
      const { correct, options } = rotateOptions(topic.answer, topic.wrongA, topic.wrongB, topic.wrongC, i);
      rows.push({
        id: `gen-gre-${i + 1}`,
        examType,
        dynasty: dynastyCycle[i % dynastyCycle.length],
        difficulty,
        text: `[GRE Verbal] ${topic.stem}`,
        options,
        correct,
        analysis: `本题考查 ${topic.point}。正确项能保留原句的限制条件和论证态度，干扰项通常过度绝对化或改变了证据关系。`,
        knowledgePoint: topic.point,
        language: "English",
        source: "原创模拟题",
        year: `Mock ${2020 + (i % 7)}`,
      });
      continue;
    }

    if (examType === "美国高考") {
      const topic = usExamTopics[i % usExamTopics.length];
      const { correct, options } = rotateOptions(topic.answer, topic.wrongA, topic.wrongB, topic.wrongC, i);
      rows.push({
        id: `gen-us-${i + 1}`,
        examType,
        dynasty: topic.dynasty,
        difficulty,
        text: `[SAT/AP] ${topic.question}`,
        options,
        correct,
        analysis: `本题接近 ${topic.point} 风格，重点不是背单一事实，而是判断材料能支持哪一种历史解释。`,
        knowledgePoint: topic.keyword,
        language: "English",
        source: "原创模拟题",
        year: `Mock ${2020 + (i % 7)}`,
      });
      continue;
    }

    const topic = historyTopics[i % historyTopics.length];
    const { correct, options } = rotateOptions(topic.concept, topic.wrongA, topic.wrongB, topic.wrongC, i);
    const prefix = examType === "高考" ? "【高考历史】" : "【考研历史/文史基础】";
    const stem =
      examType === "高考"
        ? `${prefix} 关于${topic.period}“${topic.keyword}”的影响，下列理解最恰当的是哪一项？`
        : `${prefix} 若从制度史与社会史结合的角度分析“${topic.keyword}”，下列判断最符合史实的是哪一项？`;

    rows.push({
      id: `gen-cn-${i + 1}`,
      examType,
      dynasty: topic.dynasty,
      difficulty,
      text: stem,
      options,
      correct,
      analysis: `${topic.keyword} 的核心是：${topic.concept}。做题时要先定位朝代与制度背景，再排除“完全、唯一、全部取消”这类过度绝对化表述。`,
      knowledgePoint: topic.keyword,
      language: "中文",
      source: "原创模拟题",
      year: `模拟 ${2020 + (i % 7)}`,
    });
  }

  return rows;
}

export type ExamQuestionRecord = {
  id: string;
  examType: ExamType;
  dynasty: Dynasty;
  difficulty: ExamDifficulty;
  text: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct: "A" | "B" | "C" | "D";
  analysis: string;
  knowledgePoint: string;
  language: string;
  source: string;
  sourceUrl?: string;
  year: string;
};

export const examQuestionsFromCsv: ExamQuestionRecord[] = [
  ...rawExams.map((item, index) => {
  const text = `${item.title}`;
  const dynasty =
    /唐/.test(text) ? "唐" : /宋/.test(text) ? "宋" : /元/.test(text) ? "元" : /明/.test(text) ? "明" : /清/.test(text) ? "清" : "唐";
  return {
    id: `csv-q-${item.id}`,
    examType: examTypeCycle[index % examTypeCycle.length],
    dynasty: dynasty as Dynasty,
    difficulty: difficultyMap[item.difficulty] ?? "中等",
    text: item.title,
    options: [
      { key: "A" as const, text: item.optionA },
      { key: "B" as const, text: item.optionB },
      { key: "C" as const, text: item.optionC },
      { key: "D" as const, text: item.optionD },
    ],
    correct: item.answer,
    analysis: item.analysis,
    knowledgePoint: item.knowledge_point,
    language: item.language,
    source: item.exam_type || "导入题库",
    year: "导入题",
  };
  }),
  ...generateSupplementalExamQuestions(),
];

export function getContentById(id: string) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;
  return allContentRecords.find((item) => item.id === numericId) ?? null;
}

export function getContentLinkByTitle(title: string) {
  const normalizedTitle = title.trim();
  const exact = allContentRecords.find((item) => item.title === normalizedTitle);
  if (exact) return `/content/${exact.id}`;

  const loose = allContentRecords.find((item) => normalizedTitle.includes(item.title) || item.title.includes(normalizedTitle));
  return loose ? `/content/${loose.id}` : `/search?q=${encodeURIComponent(normalizedTitle)}`;
}
