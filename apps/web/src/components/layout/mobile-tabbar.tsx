"use client";

import Link from "next/link";
import { Bot, ClipboardList, Home, Library } from "lucide-react";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    active: true,
  },
  {
    label: "Library",
    href: "#",
    icon: Library,
  },
  {
    label: "AI Toolkit",
    href: "#",
    icon: Bot,
  },
];

export function MobileTabbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] bg-dark px-4 pb-4 pt-3 lg:hidden">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={
                tab.active
                  ? "flex flex-col items-center justify-center rounded-full bg-white px-2 py-2 text-xs font-semibold text-dark"
                  : "flex flex-col items-center justify-center px-2 py-2 text-xs font-medium text-white/70"
              }
            >
              <Icon size={18} />
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}