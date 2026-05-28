"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Download } from "lucide-react";
import { AppShell } from "../../../../components/layout/app-shell";
import { Button } from "../../../../components/ui/button";
import { apiRequest } from "../../../../lib/api";
import { webEnv } from "../../../../lib/env";
import {
  AssignmentJobStatusResponse,
  AssignmentResultResponse,
  AssignmentStatus,
  QuestionPaper,
  RegenerateAssignmentResponse,
} from "../../../../types/assignment";
import { QuestionPaperPreview } from "../../../../components/assignments/question-paper-preview";
import { useGenerationSocket } from "../../../../hooks/user-generation-socket";

export default function AssignmentOutputPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;
  const { getToken } = useAuth();

  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [status, setStatus] = useState<AssignmentStatus>("pending");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Preparing your assignment...");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchResult = useCallback(async () => {
    const authToken = await getToken();

    const response = await apiRequest<AssignmentResultResponse>(
      `/api/assignments/${assignmentId}/result`,
      {
        authToken,
      }
    );

    setPaper(response.data.result.paper);
    setStatus("completed");
    setProgress(100);
    setMessage("Question paper generated successfully.");
  }, [assignmentId, getToken]);

  const fetchStatus = useCallback(async () => {
    const authToken = await getToken();

    const response = await apiRequest<AssignmentJobStatusResponse>(
      `/api/assignments/${assignmentId}/status`,
      {
        authToken,
      }
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
  }, [assignmentId, getToken]);

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

  const handleDownloadPdf = async () => {
    try {
      const authToken = await getToken();
      const response = await fetch(
        `${webEnv.apiUrl}/api/assignments/${assignmentId}/pdf`,
        {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        }
      );

      if (!response.ok) {
        let message = "Failed to download PDF";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // The API may return a non-JSON PDF error response.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "question-paper.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to download PDF"
      );
    }
  };

  const handleRegenerate = async () => {
  try {
    setPaper(null);
    setStatus("pending");
    setProgress(0);
    setErrorMessage("");
    setMessage("Starting regeneration...");
    const authToken = await getToken();

    await apiRequest<RegenerateAssignmentResponse>(
      `/api/assignments/${assignmentId}/regenerate`,
      {
        method: "POST",
        authToken,
      }
    );

    setMessage("Regeneration job started. AI is preparing a new paper...");
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "Failed to regenerate paper"
    );
  }
};

  const progressValue = Math.max(0, Math.min(progress, 100));

  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px]">
        <div className="mb-3 rounded-[34px] bg-[#242424] px-5 py-7 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:mb-4 sm:rounded-[30px] sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="max-w-[760px] text-[16px] font-extrabold leading-snug tracking-normal sm:text-[22px]">
                {message}
              </h1>

              <div className="mt-3 hidden flex-wrap items-center gap-3 text-sm font-semibold tracking-normal text-white/65 sm:flex">
                <span className="uppercase">{status}</span>
                <span>{progressValue}% complete</span>
              </div>

              {status !== "completed" && status !== "failed" ? (
                <div className="mt-4 hidden h-2 w-full max-w-[460px] overflow-hidden rounded-full bg-white/15 sm:block">
                  <div
                    className="h-full rounded-full bg-[#ff5623] transition-all"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              ) : null}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={!paper}
                aria-label="Download as PDF"
                className="mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
              >
                <Download size={20} />
              </button>
            </div>

            <div className="hidden flex-wrap gap-3 sm:flex">
              <Link href="/assignments">
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  Back
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="border-white/15 bg-white/10 text-white hover:bg-white/15"
              >
                Regenerate
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={!paper}
                className="bg-white text-[#242424] hover:bg-white/90"
              >
                Download as PDF
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <p className="text-lg font-bold tracking-normal text-[#303030]">
              Loading assignment output...
            </p>
          </div>
        ) : errorMessage && status === "failed" ? (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold tracking-normal text-[#770d0d]">
              Generation Failed
            </h2>

            <p className="mt-2 tracking-normal text-[#5E5E5E]">
              {errorMessage}
            </p>
          </div>
        ) : paper ? (
          <QuestionPaperPreview paper={paper} />
        ) : (
          <div className="rounded-[30px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#dadada] border-t-[#ff5623]" />

            <h2 className="text-xl font-bold tracking-normal text-[#303030]">
              AI is generating your paper
            </h2>

            <p className="mx-auto mt-2 max-w-[520px] tracking-normal text-[#5E5E5E]">
              Please wait while we create sections, questions, difficulty tags,
              and marks.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
