"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Grid2X2, Library, Sparkles } from "lucide-react";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: Grid2X2,
    match: "/",
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: Briefcase,
    match: "/assignments",
  },
  {
    label: "Library",
    href: "/library",
    icon: Library,
    match: "/library",
  },
  {
    label: "AI Toolkit",
    href: "/ai-toolkit",
    icon: Sparkles,
    match: "/ai-toolkit",
  },
];

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-7 left-4 right-4 z-50 rounded-[28px] bg-[#181818] px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.match === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.match);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              style={{ color: isActive ? "#ffffff" : "#555555" }}
              className={
                isActive
                  ? "flex h-[58px] flex-col items-center justify-center rounded-[14px] px-1 font-extrabold tracking-normal"
                  : "flex h-[58px] flex-col items-center justify-center rounded-[14px] px-1 font-bold tracking-normal"
              }
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.8 : 2.4}
                color={isActive ? "#ffffff" : "#555555"}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="mt-1.5 text-[12px] leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
