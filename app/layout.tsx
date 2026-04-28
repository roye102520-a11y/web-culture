import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./globals.css";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/look", label: "看看" },
  { href: "/explore", label: "探索" },
  { href: "/exam", label: "考试" },
  { href: "/mine", label: "我的" },
];

export const metadata: Metadata = {
  title: "文脉 WenMai",
  description: "文脉历史文化学习平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
              <Link href="/" className="text-xl font-semibold tracking-wide md:text-2xl">
                文脉
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:max-w-sm md:flex-none">
                <div className="relative hidden w-full md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索历史文化内容"
                    className="h-9 rounded-full bg-card pl-9"
                  />
                </div>
                <Button className="rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 md:px-5">
                  发布提问
                </Button>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-3 md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          <main className="flex flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
