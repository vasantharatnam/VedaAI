"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "../../../components/layout/app-shell";
import { CreateAssignmentForm } from "../../../components/assignments/create-assignment-form";

export default function CreateAssignmentPage() {
  const router = useRouter();

  return (
    <AppShell>
      <section>
        <div className="mb-6">
          <p className="text-sm font-medium text-[#5E5E5E]">Assignment</p>

          <h1 className="mt-2 text-[28px] font-extrabold leading-none text-[#303030]">
            Create Assignment
          </h1>

          <p className="mt-2 max-w-[620px] text-base leading-7 text-[#5E5E5E]">
            Upload study material, configure question types, add marks, and let
            AI generate a structured question paper.
          </p>
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