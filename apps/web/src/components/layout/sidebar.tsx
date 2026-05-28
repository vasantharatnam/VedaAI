"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ClipboardList,
  Home,
  Library,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { apiRequest } from "../../lib/api";
import { GetAssignmentsResponse } from "../../types/assignment";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "My Groups",
    href: "#",
    icon: Users,
  },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    badge: "assignments",
    active: true,
  },
  {
    label: "AI Teacher's Toolkit",
    href: "#",
    icon: Bot,
  },
  {
    label: "My Library",
    href: "#",
    icon: Library,
    badge: "32",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [assignmentCount, setAssignmentCount] = useState(0);
  const isQuestionPaperPreview = /^\/assignments\/[^/]+\/output$/.test(
    pathname
  );
  const ctaLabel = isQuestionPaperPreview
    ? "AI Teacher's Toolkit"
    : "Create Assignment";

  const fetchAssignmentCount = useCallback(async () => {
    try {
      const response =
        await apiRequest<GetAssignmentsResponse>("/api/assignments");

      setAssignmentCount(response.data.assignments.length);
    } catch {
      setAssignmentCount(0);
    }
  }, []);

  useEffect(() => {
    fetchAssignmentCount();

    window.addEventListener("assignments:changed", fetchAssignmentCount);

    return () => {
      window.removeEventListener("assignments:changed", fetchAssignmentCount);
    };
  }, [fetchAssignmentCount, pathname]);

  return (
    <aside className="hidden h-[calc(100vh-32px)] w-[300px] shrink-0 rounded-[16px] bg-surface p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] lg:flex lg:flex-col">
      <Link href="/assignments" className="mb-14 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#ff8a3d] via-[#c54a24] to-[#55150c] text-[24px] font-black text-white shadow-[0_8px_18px_rgba(255,86,35,0.35)]">
          V
        </div>

        <span className="text-[26px] font-extrabold leading-none tracking-[-0.06em] text-text">
          VedaAI
        </span>
      </Link>

      <Link href="/assignments/new" className="mb-14 block">
        <Button
          variant="figmaDark"
          className="h-[52px] w-full gap-3 text-[16px] shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
        >
          <Sparkles size={18} fill="white" />
          <span>{ctaLabel}</span>
        </Button>
      </Link>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-[8px] px-3 text-[15px] font-normal leading-[140%] tracking-[-0.04em] text-[#5E5E5E]/80 transition hover:bg-[#eeeeee] hover:text-text",
                item.active && "bg-[#eeeeee] font-medium text-text"
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>

              {item.badge ? (
                <span className="flex h-6 min-w-10 items-center justify-center rounded-full bg-[#ff5623] px-3 text-sm font-extrabold leading-none text-white">
                  {item.badge === "assignments"
                    ? assignmentCount
                    : item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          href="#"
          className="flex h-10 items-center gap-3 rounded-[8px] px-3 text-[15px] font-normal leading-[140%] tracking-[-0.04em] text-[#5E5E5E]/80 transition hover:bg-[#eeeeee] hover:text-text"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        <div className="flex h-[76px] items-center gap-3 rounded-[18px] bg-[#f0f0f0] px-4">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ffd7c5] text-[16px] font-extrabold tracking-normal text-[#303030]">
            DPS
          </div>

          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold leading-tight tracking-[-0.04em] text-text">
              Delhi Public School
            </p>
            <p className="mt-1 text-[14px] font-normal leading-tight tracking-[-0.04em] text-muted">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
