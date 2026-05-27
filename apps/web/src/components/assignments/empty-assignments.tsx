import Link from "next/link";
import { Button } from "../ui/button";

export function EmptyAssignments() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <div className="relative mb-6 h-[220px] w-[260px]">
        <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65" />

        <div className="absolute left-[72px] top-[42px] h-[126px] w-[96px] rounded-[14px] bg-white shadow-[0_14px_38px_rgba(0,0,0,0.08)]">
          <div className="ml-4 mt-6 h-[10px] w-[46px] rounded-full bg-[#001a2e]" />
          <div className="ml-4 mt-5 h-[10px] w-[62px] rounded-full bg-[#d9d9d9]" />
          <div className="ml-4 mt-4 h-[10px] w-[58px] rounded-full bg-[#d9d9d9]" />
          <div className="ml-4 mt-4 h-[10px] w-[70px] rounded-full bg-[#d9d9d9]" />
        </div>

        <div className="absolute left-[112px] top-[78px] flex h-[94px] w-[94px] items-center justify-center rounded-full border-[10px] border-[#c8bee3] bg-white/70">
          <span className="text-[54px] font-black leading-none text-[#ff3b3b]">
            ×
          </span>
        </div>

        <div className="absolute left-[188px] top-[154px] h-[82px] w-[22px] rotate-[-45deg] rounded-full bg-[#d8ceef]" />

        <div className="absolute right-[28px] top-[32px] h-[42px] w-[64px] rounded-[8px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="ml-3 mt-3 h-3 w-3 rounded-full bg-[#c8bee3]" />
          <div className="ml-8 -mt-3 h-3 w-7 rounded-full bg-[#d9d9d9]" />
        </div>
      </div>

      <h2 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#303030]">
        No assignments yet
      </h2>

      <p className="mt-3 max-w-[520px] text-[16px] leading-[140%] tracking-[-0.04em] text-[#5E5E5E]/80">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Link href="/assignments/new" className="mt-7">
        <Button
          size="lg"
          className="gap-2 bg-[#181818] px-8 hover:bg-[#181818]"
        >
          <span className="text-xl leading-none">+</span>
          <span>Create Your First Assignment</span>
        </Button>
      </Link>
    </div>
  );
}
