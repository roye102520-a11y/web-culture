import type { Metadata } from "next";

import { ApiKeyFetchBridge } from "@/components/ApiKeyFetchBridge";
import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/home/BottomNav";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "WenMai（文脉）",
  description: "历史文化学习平台 Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-background text-foreground">
        <ApiKeyFetchBridge />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
