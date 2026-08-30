import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const letters = ["A", "B", "C", "D"];
const rows = [];

function add({ section, topicOrder, knowledgePoint, title, correct, distractors, difficulty, tags }) {
  const seed = rows.length;
  const options = [correct, ...distractors].slice(0, 4);
  const shift = seed % 4;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  const answer = letters[rotated.indexOf(correct)];
  rows.push({
    id: rows.length + 1,
    title,
    optionA: String(rotated[0]),
    optionB: String(rotated[1]),
    optionC: String(rotated[2]),
    optionD: String(rotated[3]),
    answer,
    analysis: `正确答案是 ${answer}。${knowledgePoint}：${tags}。根据题干条件逐项检验可得 ${correct}。`,
    exam_type: "GRE原创专项练习",
    knowledge_point: knowledgePoint,
    difficulty,
    tags,
    language: section === "Verbal Reasoning" ? "en" : "zh-en",
    section,
    topic_order: topicOrder,
  });
}

const subjects = ["The historian", "The biologist", "The critic", "The economist", "The curator", "The linguist", "The researcher", "The architect", "The editor", "The philosopher"];
const vocab = [
  ["meticulous", "every claim is checked against several independent sources"],
  ["pragmatic", "the proposal emphasizes workable results rather than abstract doctrine"],
  ["candid", "the report openly acknowledges both successes and failures"],
  ["tentative", "the conclusion may change when additional evidence becomes available"],
  ["innovative", "the design introduces a method that has not previously been attempted"],
  ["lucid", "even readers outside the field can follow the explanation easily"],
  ["skeptical", "the claim is withheld until stronger evidence can be supplied"],
  ["concise", "the entire argument is expressed clearly in only three sentences"],
  ["impartial", "competing positions are evaluated by the same standards"],
  ["resilient", "the system quickly recovers after repeated disruptions"],
];

for (let i = 0; i < 200; i++) {
  const [word, clue] = vocab[i % vocab.length];
  const distractors = [1, 3, 6].map((offset) => vocab[(i + offset) % vocab.length][0]);
  add({ section: "Verbal Reasoning", topicOrder: 1, knowledgePoint: "Text Completion · 语境填空", title: `${subjects[i % subjects.length]}'s account is praised for being ____ because ${clue}. (Set ${i + 1})`, correct: word, distractors, difficulty: i % 3 === 0 ? "难" : i % 3 === 1 ? "中" : "易", tags: "context clues and logical completion" });
}

const equivalents = [["concise", "succinct"], ["candid", "forthright"], ["abundant", "plentiful"], ["skeptical", "doubtful"], ["obscure", "enigmatic"], ["pragmatic", "practical"], ["resilient", "robust"], ["meticulous", "painstaking"], ["tentative", "provisional"], ["impartial", "unbiased"]];
for (let i = 0; i < 200; i++) {
  const pair = equivalents[i % equivalents.length];
  add({ section: "Verbal Reasoning", topicOrder: 2, knowledgePoint: "Sentence Equivalence · 句意等价", title: `Choose the word that, together with “${pair[0]},” would produce the most similar sentence meaning: The committee requested a ____ summary. (Set ${i + 1})`, correct: pair[1], distractors: ["ornate", "ambiguous", "lengthy"], difficulty: i % 3 === 0 ? "中" : "易", tags: `${pair[0]} ≈ ${pair[1]}` });
}

const passageThemes = ["urban trees reduce summer heat", "archives reveal changes in ordinary diets", "peer review can improve a study without eliminating uncertainty", "small museums strengthen local historical memory", "bilingual education can support conceptual flexibility"];
for (let i = 0; i < 600; i++) {
  const theme = passageThemes[i % passageThemes.length];
  const kind = i % 3;
  const topicOrder = 3 + kind;
  const point = ["Reading Comprehension · 主旨", "Reading Comprehension · 推断", "Reading Comprehension · 论证结构"][kind];
  const stems = [
    `A short study argues that ${theme}. It acknowledges limited data but presents the result as a basis for further research. What is the passage's main purpose?`,
    `A short study argues that ${theme}. It acknowledges limited data but presents the result as a basis for further research. Which inference is best supported?`,
    `A short study argues that ${theme}. It acknowledges limited data but presents the result as a basis for further research. What role does the acknowledgement of limited data play?`,
  ];
  const correct = ["To present a qualified finding and invite further study", "The author regards the conclusion as promising but not final", "It limits the scope of the claim"][kind];
  add({ section: "Verbal Reasoning", topicOrder, knowledgePoint: point, title: `${stems[kind]} (Passage ${i + 1})`, correct, distractors: ["To prove that all earlier work is wrong", "To replace evidence with personal opinion", "To claim that no further research is needed"], difficulty: i % 4 === 0 ? "难" : "中", tags: theme });
}

for (let i = 0; i < 200; i++) {
  const n = 100 + i;
  const d = 3 + (i % 17);
  const r = n % d;
  add({ section: "Quantitative Reasoning", topicOrder: 6, knowledgePoint: "Arithmetic · 整数、因数与余数", title: `When ${n} is divided by ${d}, what is the remainder?`, correct: r, distractors: [(r + 1) % d, (r + 2) % d, d], difficulty: i % 3 === 0 ? "中" : "易", tags: "integer properties and remainders" });
}

for (let i = 0; i < 200; i++) {
  const base = 80 + i * 5;
  const pct = [10, 15, 20, 25][i % 4];
  const value = base * pct / 100;
  add({ section: "Quantitative Reasoning", topicOrder: 7, knowledgePoint: "Arithmetic · 百分比、比率与速率", title: `${pct}% of ${base} is equal to which value?`, correct: value, distractors: [value + 5, value - 5, base - value], difficulty: i % 3 === 2 ? "中" : "易", tags: "percent and ratio" });
}

for (let i = 0; i < 200; i++) {
  const a = 2 + (i % 8), x = 3 + i, b = 1 + (i % 9), c = a * x + b;
  add({ section: "Quantitative Reasoning", topicOrder: 8, knowledgePoint: "Algebra · 方程与代数式", title: `If ${a}x + ${b} = ${c}, what is x?`, correct: x, distractors: [x + 1, x - 1, c - b], difficulty: i % 3 === 0 ? "中" : "易", tags: "linear equations" });
}

for (let i = 0; i < 200; i++) {
  const m = 2 + (i % 5), bound = 4 + i, c = m * bound;
  add({ section: "Quantitative Reasoning", topicOrder: 9, knowledgePoint: "Algebra · 不等式与函数", title: `If ${m}x < ${c}, which statement must be true?`, correct: `x < ${bound}`, distractors: [`x > ${bound}`, `x ≤ ${c}`, `x = ${bound}`], difficulty: i % 3 === 0 ? "难" : "中", tags: "inequalities" });
}

for (let i = 0; i < 200; i++) {
  const base = 6 + i, height = 4 + (i % 13), area = base * height / 2;
  add({ section: "Quantitative Reasoning", topicOrder: 10, knowledgePoint: "Geometry · 三角形与多边形", title: `A triangle has base ${base} and height ${height}. What is its area?`, correct: area, distractors: [base * height, base + height, area + base], difficulty: i % 4 === 0 ? "中" : "易", tags: "triangle area" });
}

for (let i = 0; i < 200; i++) {
  const r = 2 + i, area = `${r * r}π`;
  add({ section: "Quantitative Reasoning", topicOrder: 11, knowledgePoint: "Geometry · 圆与坐标几何", title: `A circle has radius ${r}. What is its area?`, correct: area, distractors: [`${2 * r}π`, `${r}π`, `${r * r * 2}π`], difficulty: i % 3 === 0 ? "中" : "易", tags: "circle area" });
}

for (let i = 0; i < 200; i++) {
  const a = 4 + i, values = [a, a + 2, a + 4, a + 6, a + 8], mean = a + 4;
  add({ section: "Quantitative Reasoning", topicOrder: 12, knowledgePoint: "Data Analysis · 描述统计", title: `What is the mean of ${values.join(", ")}?`, correct: mean, distractors: [mean - 2, mean + 2, a + 8], difficulty: i % 3 === 2 ? "中" : "易", tags: "mean median range" });
}

for (let i = 0; i < 200; i++) {
  const q1 = 40 + i, q2 = q1 + 5 + (i % 7), increase = q2 - q1;
  add({ section: "Quantitative Reasoning", topicOrder: 13, knowledgePoint: "Data Analysis · 表格与图表解读", title: `A table reports ${q1} units in Quarter 1 and ${q2} units in Quarter 2. By how many units did the value increase?`, correct: increase, distractors: [q2, q1, increase + 5], difficulty: i % 3 === 0 ? "中" : "易", tags: "data interpretation" });
}

for (let i = 0; i < 200; i++) {
  const red = 2 + i, blue = 3 + (i % 11), total = red + blue;
  add({ section: "Quantitative Reasoning", topicOrder: 14, knowledgePoint: "Data Analysis · 概率与计数", title: `A bag contains ${red} red and ${blue} blue tokens. What is the probability of selecting a red token at random?`, correct: `${red}/${total}`, distractors: [`${blue}/${total}`, `1/${total}`, `${red}/${blue}`], difficulty: i % 3 === 0 ? "中" : "易", tags: "elementary probability" });
}

for (let i = 0; i < 200; i++) {
  const x = 2 + i;
  add({ section: "Quantitative Reasoning", topicOrder: 15, knowledgePoint: "Quantitative Comparison · 数量比较", title: `Quantity A: ${x}². Quantity B: ${x} × ${x}. Compare the two quantities.`, correct: "The two quantities are equal", distractors: ["Quantity A is greater", "Quantity B is greater", "The relationship cannot be determined"], difficulty: i % 3 === 0 ? "中" : "易", tags: "quantitative comparison" });
}

if (rows.length !== 3000) throw new Error(`Expected 3000 questions, got ${rows.length}`);

fs.writeFileSync(path.join(root, "data/exam-questions.json"), `${JSON.stringify(rows, null, 2)}\n`);
const headers = Object.keys(rows[0]);
const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => `"${String(row[key]).replaceAll('"', '""')}"`).join(","))].join("\n");
fs.writeFileSync(path.join(root, "data/exam-questions.csv"), `${csv}\n`);
console.log(`Generated ${rows.length} original GRE practice questions.`);
