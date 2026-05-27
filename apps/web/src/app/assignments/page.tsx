"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Plus, Search } from "lucide-react";
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
      <section className="relative min-h-[calc(100vh-104px)]">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[140px] animate-pulse rounded-[22px] bg-white"
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
          <>
            <div className="mb-4 flex items-start gap-3">
              <span className="mt-2 h-4 w-4 rounded-full border-[4px] border-[#b9e7c7] bg-[#38b96f]" />

              <div>
                <h1 className="text-[20px] font-extrabold leading-tight tracking-normal text-[#303030]">
                  Assignments
                </h1>

                <p className="mt-1 text-[13px] leading-tight tracking-normal text-[#5E5E5E]/70">
                  Manage and create assignments for your classes.
                </p>
              </div>
            </div>

            <div className="mb-3 flex min-h-[56px] flex-col gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-[13px] font-semibold tracking-normal text-[#9b9b9b]">
                <Filter size={16} />
                <span>Filter By</span>
              </div>

              <div className="flex h-11 w-full items-center gap-3 rounded-full border border-[#dadada] px-4 text-[13px] tracking-normal text-[#9b9b9b] md:max-w-[360px]">
                <Search size={18} />
                <span>Search Assignment</span>
              </div>
            </div>

            <div className="grid gap-3 pb-20 md:grid-cols-2">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <Link
              href="/assignments/new"
              className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 lg:bottom-6"
            >
              <Button className="h-11 gap-2 bg-[#181818] px-6 shadow-[0_14px_34px_rgba(0,0,0,0.24)] hover:bg-[#181818]">
                <Plus size={18} />
                <span>Create Your First Assignment</span>
              </Button>
            </Link>
          </>
        )}
      </section>
    </AppShell>
  );
}
