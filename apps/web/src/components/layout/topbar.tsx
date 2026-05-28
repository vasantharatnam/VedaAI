"use client";

import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Grid2X2,
  Menu,
} from "lucide-react";

export function Topbar() {
  return (
    <header className="hidden h-[58px] w-full items-center justify-between overflow-hidden rounded-[16px] bg-white px-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:flex">
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text transition hover:bg-bg">
          <ArrowLeft size={22} />
        </button>

        <div className="flex items-center gap-2 text-subtle">
          <Grid2X2 size={18} />
          <span className="text-[16px] font-normal tracking-[-0.04em]">
            Assignment
          </span>
        </div>
      </div>

      <div className="flex h-full items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-text">
          <Bell size={20} />
          <span className="absolute right-[8px] top-[7px] h-[7px] w-[7px] rounded-full bg-brand" />
        </button>

        <button className="flex h-11 items-center gap-3 rounded-full bg-white px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe0c9] text-[12px] font-extrabold tracking-normal text-[#303030]">
            JD
          </div>

          <span className="text-[16px] font-semibold tracking-[-0.04em] text-text">
            John Doe
          </span>

          <ChevronDown size={18} />
        </button>
      </div>
    </header>
  );
}

export function MobileTopbar() {
  return (
    <header className="bg-bg px-3 pb-2 pt-3 lg:hidden">
      <div className="flex h-16 items-center justify-between rounded-[18px] bg-white px-3 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#242424] text-xl font-black text-white">
            V
          </div>

          <span className="text-[22px] font-extrabold tracking-[-0.06em]">
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f6f6] text-text">
            <Bell size={20} />
            <span className="absolute right-[7px] top-[6px] h-[7px] w-[7px] rounded-full bg-brand" />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe0c9] text-[13px] font-extrabold tracking-normal text-[#303030]">
            JD
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
