import { Compass, House, UserRound } from "lucide-react";

const navItems = [
  { label: "首页", active: true, icon: House },
  { label: "发现", active: false, icon: Compass },
  { label: "我的", active: false, icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`inline-flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                item.active ? "text-[#991B1B]" : "text-[#78716C]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
