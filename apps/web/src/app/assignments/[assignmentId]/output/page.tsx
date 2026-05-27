"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "../../../../components/layout/app-shell";
import { Button } from "../../../../components/ui/button";
import { apiRequest } from "../../../../lib/api";
import { webEnv } from "../../../../lib/env";
import {
  AssignmentJobStatusResponse,
  AssignmentResultResponse,
  AssignmentStatus,
  QuestionPaper,
} from "../../../../types/assignment";
import { QuestionPaperPreview } from "../../../../components/assignments/question-paper-preview";
import { useGenerationSocket } from "../../../../hooks/user-generation-socket";

export default function AssignmentOutputPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;

  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [status, setStatus] = useState<AssignmentStatus>("pending");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Preparing your assignment...");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchResult = useCallback(async () => {
    const response = await apiRequest<AssignmentResultResponse>(
      `/api/assignments/${assignmentId}/result`
    );

    setPaper(response.data.result.paper);
    setStatus("completed");
    setProgress(100);
    setMessage("Question paper generated successfully.");
  }, [assignmentId]);

  const fetchStatus = useCallback(async () => {
    const response = await apiRequest<AssignmentJobStatusResponse>(
      `/api/assignments/${assignmentId}/status`
    );

    setStatus(response.data.assignmentStatus);
    setProgress(response.data.progress || 0);

    if (response.data.assignmentStatus === "completed") {
      setMessage("Question paper generated successfully.");
    } else if (response.data.assignmentStatus === "processing") {
      setMessage("AI is generating your question paper...");
    } else if (response.data.assignmentStatus === "failed") {
      setMessage("Question paper generation failed.");
      setErrorMessage(response.data.errorMessage || "Generation failed");
    } else {
      setMessage("Preparing your assignment...");
    }
  }, [assignmentId]);

  useGenerationSocket({
    assignmentId,
    onStatus: (payload) => {
      setStatus(payload.status);
      setProgress(payload.progress);
      setMessage(payload.message);
    },
    onCompleted: async (payload) => {
      setStatus("completed");
      setProgress(payload.progress || 100);
      setMessage(payload.message || "Question paper generated successfully.");
      await fetchResult();
    },
    onFailed: (payload) => {
      setStatus("failed");
      setProgress(0);
      setMessage(payload.message || "Question paper generation failed.");
      setErrorMessage(payload.errorMessage || "Generation failed");
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        await fetchStatus();

        try {
          await fetchResult();
        } catch {
          // Result may not be ready yet.
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load assignment"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) {
      loadInitialData();
    }
  }, [assignmentId, fetchStatus, fetchResult]);

  const handleDownloadPdf = () => {
    window.open(`${webEnv.apiUrl}/api/assignments/${assignmentId}/pdf`, "_blank");
  };

  const progressValue = Math.max(0, Math.min(progress, 100));

  return (
    <AppShell>
      <section>
        <div className="mb-5 rounded-[24px] bg-[#181818] px-5 py-4 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-white/70">
                Generation Status · {status.toUpperCase()}
              </p>

              <h1 className="mt-1 text-xl font-extrabold">{message}</h1>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15 lg:w-[420px]">
                <div
                  className="h-full rounded-full bg-[#ff5623] transition-all"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/assignments">
                <Button variant="outline">Back</Button>
              </Link>

              <Button
                variant="brand"
                onClick={handleDownloadPdf}
                disabled={!paper}
              >
                Download as PDF
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <p className="text-lg font-bold text-[#303030]">
              Loading assignment output...
            </p>
          </div>
        ) : errorMessage && status === "failed" ? (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-[#770d0d]">
              Generation Failed
            </h2>

            <p className="mt-2 text-[#5E5E5E]">{errorMessage}</p>
          </div>
        ) : paper ? (
          <QuestionPaperPreview paper={paper} />
        ) : (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#dadada] border-t-[#ff5623]" />

            <h2 className="text-xl font-bold text-[#303030]">
              AI is generating your paper
            </h2>

            <p className="mt-2 text-[#5E5E5E]">
              Please wait while we create sections, questions, difficulty tags,
              and marks.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}