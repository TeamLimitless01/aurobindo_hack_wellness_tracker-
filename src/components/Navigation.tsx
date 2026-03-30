"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Settings, Calendar } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", Icon: Home },
  { href: "/routine", label: "Routine", Icon: Calendar },
  { href: "/trends", label: "Insights", Icon: LineChart },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-4 pb-safe pt-2 md:top-0 md:bottom-0 md:w-64 md:border-t-0 md:border-r md:px-0 md:pt-8 md:pb-0 md:bg-transparent">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto md:flex-col md:justify-start md:items-start md:space-y-4 md:px-6 md:h-auto">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded-xl transition-all duration-200 md:flex-row md:space-y-0 md:space-x-3 md:w-full md:justify-start md:py-3 md:px-4",
                isActive
                  ? "text-teal-400 font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <Icon
                size={24}
                className={clsx("transition-transform", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs md:text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
