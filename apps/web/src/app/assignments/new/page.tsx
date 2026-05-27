"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "../../../components/layout/app-shell";
import { CreateAssignmentForm } from "../../../components/assignments/create-assignment-form";

export default function CreateAssignmentPage() {
  const router = useRouter();

  return (
    <AppShell>
      <section>
        <div className="mb-6 flex items-start gap-3">
          <span className="mt-1 h-4 w-4 rounded-full border-4 border-[#8ee4aa] bg-[#4bc26d]" />

          <div>
            <h1 className="text-[22px] font-extrabold leading-none text-[#303030]">
              Create Assignment
            </h1>

            <p className="mt-2 text-[14px] text-[#A9A9A9]">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        <CreateAssignmentForm
          onCreated={(assignmentId) => {
            router.push(`/assignments/${assignmentId}/output`);
          }}
        />
      </section>
    </AppShell>
  );
}