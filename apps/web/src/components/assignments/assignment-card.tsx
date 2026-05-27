"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Assignment } from "../../types/assignment";
import { Card } from "../ui/card";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (assignmentId: string) => void;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date(date))
    .replace(/\//g, "-");
};

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className="relative min-h-[140px] rounded-[22px] border-0 bg-white p-6 shadow-[0_16px_44px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]">
      <Link href={`/assignments/${assignment._id}/output`} className="block">
        <h3 className="max-w-[80%] truncate text-[22px] font-extrabold leading-tight tracking-[-0.04em] text-[#303030] underline decoration-[#303030] decoration-1 underline-offset-2">
          {assignment.title}
        </h3>

        <div className="mt-14 flex items-center justify-between gap-4 text-[14px] tracking-normal">
          <p className="font-bold text-[#303030]">
            Assigned on{" "}
            <span className="font-normal text-[#7d7d7d]">
              : {formatDate(assignment.createdAt)}
            </span>
          </p>

          <p className="font-bold text-[#303030]">
            Due{" "}
            <span className="font-normal text-[#7d7d7d]">
              : {formatDate(assignment.dueDate)}
            </span>
          </p>
        </div>
      </Link>

      <button
        onClick={() => setIsMenuOpen((current) => !current)}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[#9b9b9b] transition hover:bg-[#f2f2f2] hover:text-[#303030]"
        aria-label="Open assignment actions"
        aria-expanded={isMenuOpen}
      >
        <MoreVertical size={22} />
      </button>

      {isMenuOpen ? (
        <div className="absolute right-16 top-11 z-10 w-[196px] rounded-[20px] bg-white p-3 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
          <Link
            href={`/assignments/${assignment._id}/output`}
            className="block rounded-[12px] px-3 py-3 text-[16px] font-medium tracking-normal text-[#303030] hover:bg-[#f5f5f5]"
          >
            View Assignment
          </Link>

          <button
            onClick={() => onDelete(assignment._id)}
            className="mt-1 w-full rounded-[12px] bg-[#f5f5f5] px-3 py-3 text-left text-[16px] font-medium tracking-normal text-[#ff1f1f]"
          >
            Delete
          </button>
        </div>
      ) : null}
    </Card>
  );
}
