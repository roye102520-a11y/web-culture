interface Props { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[#F5F5F4]">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-2xl bg-white/85 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#1C1917]">达人主页（动态路由 /expert/[id]）</h1>
          <p className="mt-3 text-sm text-[#57534E]">当前 ID：{id}</p>
        </div>
      </main>
    </div>
  );
}
