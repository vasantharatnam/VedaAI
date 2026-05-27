"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { AssignmentCard } from "../../components/assignments/assignment-card";
import { EmptyAssignments } from "../../components/assignments/empty-assignments";
import {
  Assignment,
  DeleteAssignmentResponse,
  GetAssignmentsResponse,
} from "../../types/assignment";
import { apiRequest } from "../../lib/api";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await apiRequest<GetAssignmentsResponse>(
        "/api/assignments"
      );

      setAssignments(response.data.assignments);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch assignments"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await apiRequest<DeleteAssignmentResponse>(
        `/api/assignments/${assignmentId}`,
        {
          method: "DELETE",
        }
      );

      setAssignments((current) =>
        current.filter((assignment) => assignment._id !== assignmentId)
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <AppShell>
      <section>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold leading-none text-[#303030]">
              Assignments
            </h1>

            <p className="mt-2 text-base text-[#5E5E5E]">
              Create, manage, and review AI-generated assessments.
            </p>
          </div>

          <Link href="/assignments/new">
            <Button variant="brand">+ Create Assignment</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[260px] animate-pulse rounded-[24px] bg-white"
              />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-[24px] bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[#303030]">
              Failed to load assignments
            </h2>

            <p className="mt-2 text-[#5E5E5E]">{errorMessage}</p>

            <Button className="mt-5" onClick={fetchAssignments}>
              Try Again
            </Button>
          </div>
        ) : assignments.length === 0 ? (
          <EmptyAssignments />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}