"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/categories", label: "分类" },
  { href: "/classics", label: "名著" },
  { href: "/exam", label: "考试" },
  { href: "/drama", label: "剧说" },
  { href: "/gossip", label: "八卦" },
  { href: "/ranking", label: "榜单" },
  { href: "/beta", label: "公测" },
  { href: "/profile", label: "我的" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mobileSearchExpand, setMobileSearchExpand] = useState(false);

  const activeMap = useMemo(() => {
    const map = new Map<string, boolean>();
    navItems.forEach((item) => {
      if (item.href === "/") {
        map.set(item.href, pathname === "/");
      } else {
        map.set(item.href, pathname.startsWith(item.href));
      }
    });
    return map;
  }, [pathname]);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchKeyword.trim();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="border-b border-[#ece9e6] bg-[#FBFBFB]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
        <Link href="/" className="shrink-0 text-base font-semibold tracking-wide text-[#1C1917] md:text-lg">
          文脉 WENMAI
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = activeMap.get(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-2 text-sm transition ${
                  active ? "font-medium text-[#1C1917]" : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                {item.label}
                {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#D4A017]" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <form onSubmit={onSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索典籍、成语、历史故事..."
              className="h-10 w-56 rounded-xl bg-white pl-9"
            />
          </form>
          <Link href="/question/new">
            <Button className="bg-[#D4A017] text-white hover:bg-[#b58711]">发布提问</Button>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <form onSubmit={onSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setMobileSearchExpand(true)}
              onBlur={() => {
                if (!searchKeyword.trim()) setMobileSearchExpand(false);
              }}
              placeholder="搜索典籍、成语、历史故事..."
              className={`h-10 rounded-xl bg-white pl-9 transition-all ${mobileSearchExpand ? "w-48" : "w-34"}`}
            />
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl bg-white">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-none bg-[#FBFBFB]">
              <div className="mt-8 space-y-2 px-1">
                <p className="px-3 text-sm font-medium text-[#78716C]">导航</p>
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-3 py-3 text-base ${
                        activeMap.get(item.href)
                          ? "bg-[#f5efe1] text-[#1C1917]"
                          : "text-[#57534E] hover:bg-[#f7f4f1]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Link href="/question/new" className="mt-3 block rounded-xl bg-[#D4A017] px-3 py-3 text-center text-base text-white">
                    发布提问
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
