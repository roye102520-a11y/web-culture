"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, House, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: House },
  { href: "/explore", label: "发现", icon: Compass },
  { href: "/profile", label: "我的", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs transition active:scale-95 ${
                active ? "text-[#991B1B]" : "text-[#78716C]"
              }`}
              aria-current={active ? "page" : undefined}
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
