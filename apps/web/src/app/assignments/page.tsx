import Link from "next/link";
import { AppShell } from "../../../src/components/layout/app-shell";
import { Button } from "../../../src/components/ui/button";

function EmptyAssignmentIllustration() {
  return (
    <div className="relative h-[220px] w-[260px]">
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

      <div className="absolute left-[30px] top-[70px] h-[70px] w-[80px] rounded-full border-t-[3px] border-[#001a2e]" />
      <div className="absolute right-[5px] top-[106px] h-[10px] w-[10px] rounded-full bg-[#2f80b5]" />
      <div className="absolute bottom-[28px] left-[62px] text-[28px] text-[#2f80b5]">
        ✧
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <AppShell>
      <section className="flex min-h-[calc(100vh-104px)] items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <EmptyAssignmentIllustration />

          <h1 className="mt-5 text-[24px] font-extrabold leading-[120%] tracking-[-0.04em] text-text">
            No assignments yet
          </h1>

          <p className="mt-2 max-w-[520px] text-[16px] font-normal leading-[140%] tracking-[-0.04em] text-[#5E5E5E]/80">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and
            let AI assist with grading.
          </p>

          <Link href="/assignments/new" className="mt-9">
            <Button size="lg" className="gap-2 px-8">
              <span className="text-[24px] leading-none">+</span>
              <span>Create Your First Assignment</span>
            </Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}