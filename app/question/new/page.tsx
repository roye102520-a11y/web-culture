"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const dynastyTags = ["唐", "宋", "元", "明", "清"] as const;
const classicTags = ["诗经", "史记", "红楼梦", "三国演义", "水浒传", "西游记"] as const;

const TITLE_MAX = 50;
const DESC_MAX = 500;

function mockPostQuestion() {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 900);
  });
}

export default function NewQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allTags = useMemo(() => [...dynastyTags, ...classicTags], []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const validate = () => {
    const t = title.trim();
    const d = description.trim();

    if (!t) return "提问标题不能为空";
    if (t.length > TITLE_MAX) return `提问标题不能超过${TITLE_MAX}字`;
    if (!d) return "问题详细描述不能为空";
    if (d.length > DESC_MAX) return `问题详细描述不能超过${DESC_MAX}字`;
    return null;
  };

  const onSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await mockPostQuestion();
      setSuccess("提问已发布，等待达人回答");

      setTimeout(() => {
        router.push('/#section-classics-ai');
      }, 900);
    } catch {
      setError("发布失败，请稍后重试");
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseTag = "rounded-full border px-3 py-1.5 text-sm transition";
  const selectedTag = "border-[#D4A017] bg-[#f8f1dd] text-[#7a5a00]";
  const idleTag = "border-[#e7e5e4] bg-white text-[#57534E] hover:text-[#1C1917]";

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917]">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-10">
        <section className="space-y-5 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[#efeae7] md:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">发布提问</h1>
            <p className="text-sm text-[#57534E]">清晰的问题描述，将更快获得高质量回答。</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">提问标题（必填）</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX + 20))}
              placeholder="请输入提问标题"
            />
            <p className="text-xs text-[#78716C]">{title.trim().length}/{TITLE_MAX}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">问题详细描述（必填）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX + 50))}
              placeholder="请输入问题详细描述...（支持 Markdown 文本）"
              className="min-h-40 w-full rounded-xl border border-[#e7e5e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#991B1B]/45"
            />
            <p className="text-xs text-[#78716C]">{description.trim().length}/{DESC_MAX}</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">关联典籍/朝代标签（多选）</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`${baseTag} ${selectedTags.includes(tag) ? selectedTag : idleTag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#faf7f5] px-4 py-3">
            <div>
              <p className="text-sm font-medium">是否匿名提问</p>
              <p className="text-xs text-[#78716C]">开启后将隐藏你的昵称信息</p>
            </div>
            <button
              type="button"
              onClick={() => setAnonymous((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition ${anonymous ? 'bg-[#991B1B]' : 'bg-[#d6d3d1]'}`}
              aria-pressed={anonymous}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${anonymous ? 'left-5' : 'left-0.5'}`}
              />
            </button>
          </div>

          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
          >
            {isSubmitting ? "发布中..." : "发布提问"}
          </Button>
        </section>
      </main>
    </div>
  );
}
