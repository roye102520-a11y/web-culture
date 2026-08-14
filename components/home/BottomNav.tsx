"use client";

import { Compass, House, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "首页", href: "/", icon: House },
  { label: "发现", href: "/explore", icon: Compass },
  { label: "我的", href: "/mine", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                active ? "text-[#991B1B]" : "text-[#78716C]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
