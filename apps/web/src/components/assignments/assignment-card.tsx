"use client";

import Link from "next/link";
import { CalendarDays, FileText, Trash2 } from "lucide-react";
import { Assignment } from "../../types/assignment";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { StatusBadge } from "../ui/status-badge";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (assignmentId: string) => void;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getTotals = (assignment: Assignment) => {
  return assignment.questionTypes.reduce(
    (acc, item) => {
      acc.questions += item.count;
      acc.marks += item.count * item.marks;
      return acc;
    },
    {
      questions: 0,
      marks: 0,
    }
  );
};

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const totals = getTotals(assignment);

  return (
    <Card className="overflow-hidden rounded-[24px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f4f4f4] text-[#303030]">
            <FileText size={22} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-extrabold leading-tight text-[#303030]">
              {assignment.title}
            </h3>

            <p className="mt-1 text-sm text-[#5E5E5E]">
              {assignment.subject || "General Subject"} ·{" "}
              {assignment.className || "Class 10"}
            </p>
          </div>
        </div>

        <StatusBadge status={assignment.status} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center rounded-full bg-[#f6f6f6] px-3 text-xs font-semibold text-[#5E5E5E]">
          {totals.questions} Questions
        </span>

        <span className="inline-flex h-7 items-center rounded-full bg-[#f6f6f6] px-3 text-xs font-semibold text-[#5E5E5E]">
          {totals.marks} Marks
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-[#5E5E5E]">
        <CalendarDays size={16} />
        <span>Due {formatDate(assignment.dueDate)}</span>
      </div>

      {assignment.uploadedFileName ? (
        <div className="mt-3 rounded-[12px] bg-[#f6f6f6] px-3 py-2 text-sm text-[#5E5E5E]">
          Material: {assignment.uploadedFileName}
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <Link href={`/assignments/${assignment._id}/output`} className="flex-1">
          <Button className="w-full">
            {assignment.status === "completed" ? "View Output" : "Track Status"}
          </Button>
        </Link>

        <button
          onClick={() => onDelete(assignment._id)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dadada] bg-white text-[#770d0d] transition hover:bg-[#fff4f4]"
          aria-label="Delete assignment"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}