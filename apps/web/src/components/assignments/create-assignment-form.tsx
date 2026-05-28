"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Mic,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  questionTypeOptions,
  useAssignmentFormStore,
} from "../../store/assignment-form.store";
import { apiRequest } from "../../lib/api";

interface CreateAssignmentFormProps {
  onCreated: (assignmentId: string) => void;
}

interface CreateAssignmentResponse {
  success: true;
  message: string;
  data: {
    assignment: {
      _id: string;
    };
    jobId: string;
  };
}

interface FormErrors {
  title?: string;
  subject?: string;
  className?: string;
  dueDate?: string;
  file?: string;
  questionTypes?: string;
}

const allowedFileTypes = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const maxFileSize = 5 * 1024 * 1024;
const minTotalQuestions = 2;

export function CreateAssignmentForm({ onCreated }: CreateAssignmentFormProps) {
  const router = useRouter();

  const {
    title,
    subject,
    className,
    dueDate,
    file,
    questionTypes,
    additionalInstructions,
    setTitle,
    setSubject,
    setClassName,
    setDueDate,
    setFile,
    setAdditionalInstructions,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    incrementQuestionCount,
    decrementQuestionCount,
    incrementMarks,
    decrementMarks,
    resetForm,
  } = useAssignmentFormStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = useMemo(() => {
    return questionTypes.reduce(
      (acc, item) => {
        acc.questions += Number(item.count || 0);
        acc.marks += Number(item.count || 0) * Number(item.marks || 0);
        return acc;
      },
      {
        questions: 0,
        marks: 0,
      }
    );
  }, [questionTypes]);

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Assignment title is required";
    }

    if (!subject.trim()) {
      nextErrors.subject = "Subject is required";
    }

    if (!className.trim()) {
      nextErrors.className = "Class name is required";
    }

    if (!dueDate) {
      nextErrors.dueDate = "Due date is required";
    }

    if (!questionTypes.length) {
      nextErrors.questionTypes = "At least one question type is required";
    }

    if (questionTypes.length && totals.questions < minTotalQuestions) {
      nextErrors.questionTypes =
        "Please add at least 2 questions. A one-question paper is too small for reliable generation.";
    }

    const hasInvalidQuestionConfig = questionTypes.some(
      (item) => Number(item.count) <= 0 || Number(item.marks) <= 0
    );

    if (hasInvalidQuestionConfig) {
      nextErrors.questionTypes =
        "Question count and marks must be greater than zero";
    }

    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        nextErrors.file = "Only PDF, TXT, Markdown, and DOCX files are allowed";
      }

      if (file.size > maxFileSize) {
        nextErrors.file = "File size should be less than 5MB";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setErrors((current) => ({
        ...current,
        file: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("subject", subject.trim());
      formData.append("className", className.trim());
      formData.append("dueDate", dueDate);
      formData.append("questionTypes", JSON.stringify(questionTypes));
      formData.append("additionalInstructions", additionalInstructions.trim());

      if (file) {
        formData.append("file", file);
      }

      const response = await apiRequest<CreateAssignmentResponse>(
        "/api/assignments",
        {
          method: "POST",
          body: formData,
          isFormData: true,
        }
      );

      resetForm();
      onCreated(response.data.assignment._id);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create assignment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-7 flex items-center justify-center gap-2">
          <div className="h-[4px] w-[360px] rounded-full bg-[#303030]" />
          <div className="h-[4px] w-[360px] rounded-full bg-[#dadada]" />
        </div>

        <div className="rounded-[32px] bg-white/80 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur lg:p-8">
          <div>
            <h2 className="text-[22px] font-extrabold leading-none text-[#303030]">
              Assignment Details
            </h2>
            <p className="mt-2 text-[14px] leading-[140%] text-[#5E5E5E]/80">
              Basic information about your assignment
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border-2 border-dashed border-[#dadada] bg-white/60 px-6 py-9 text-center">
            <input
              id="assignment-file"
              type="file"
              accept=".pdf,.txt,.md,.docx"
              className="hidden"
              onChange={handleFileChange}
            />

            <label
              htmlFor="assignment-file"
              className="flex cursor-pointer flex-col items-center justify-center"
            >
              <UploadCloud size={26} className="text-[#303030]" />

              <p className="mt-6 text-[16px] font-semibold tracking-[-0.04em] text-[#303030]">
                Choose a file or drag & drop it here
              </p>

              <p className="mt-2 text-[13px] text-[#A9A9A9]">
                PDF, TXT, MD, DOCX up to 5MB
              </p>

              <span className="mt-5 rounded-full bg-[#f2f2f2] px-6 py-3 text-[14px] font-semibold text-[#303030]">
                Browse Files
              </span>
            </label>

            {file ? (
              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#303030]">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-[#770d0d]"
                >
                  Remove
                </button>
              </div>
            ) : null}

            {errors.file ? (
              <p className="mt-3 text-sm font-semibold text-[#770d0d]">
                {errors.file}
              </p>
            ) : null}
          </div>

          <p className="mt-4 text-center text-[15px] font-medium text-[#5E5E5E]/80">
            Upload your preferred document/material
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-[15px] font-bold text-[#303030]">
              Assignment Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g Create Assignment"
              className="h-[44px] w-full rounded-full border border-[#dadada] bg-white px-5 text-[15px] outline-none focus:border-[#ff5623]"
            />
            {errors.title ? (
              <p className="mt-2 text-sm font-semibold text-[#770d0d]">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[15px] font-bold text-[#303030]">
                Subject
              </label>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g Science"
                className="h-[44px] w-full rounded-full border border-[#dadada] bg-white px-5 text-[15px] outline-none focus:border-[#ff5623]"
              />
              {errors.subject ? (
                <p className="mt-2 text-sm font-semibold text-[#770d0d]">
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-bold text-[#303030]">
                Class
              </label>
              <input
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                placeholder="e.g Class 10"
                className="h-[44px] w-full rounded-full border border-[#dadada] bg-white px-5 text-[15px] outline-none focus:border-[#ff5623]"
              />
              {errors.className ? (
                <p className="mt-2 text-sm font-semibold text-[#770d0d]">
                  {errors.className}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-[15px] font-bold text-[#303030]">
              Due Date
            </label>

            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-[44px] w-full rounded-full border border-[#dadada] bg-white px-5 pr-12 text-[15px] text-[#303030] outline-none focus:border-[#ff5623]"
              />

              <CalendarDays
                size={20}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#303030]"
              />
            </div>

            {errors.dueDate ? (
              <p className="mt-2 text-sm font-semibold text-[#770d0d]">
                {errors.dueDate}
              </p>
            ) : null}
          </div>

          <div className="mt-7">
            <div className="grid grid-cols-[1fr_130px_100px] gap-4 px-1 text-[15px] font-bold text-[#303030]">
              <span>Question Type</span>
              <span className="text-center">No. of Questions</span>
              <span className="text-center">Marks</span>
            </div>

            <div className="mt-3 space-y-3">
              {questionTypes.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_28px_110px_90px] items-center gap-3"
                >
                  <div className="relative">
                    <select
                      value={item.type}
                      onChange={(event) =>
                        updateQuestionType(index, "type", event.target.value)
                      }
                      className="h-[44px] w-full appearance-none rounded-full border-0 bg-white px-5 pr-10 text-[15px] font-medium text-[#303030] outline-none"
                    >
                      {questionTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#303030]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestionType(index)}
                    disabled={questionTypes.length === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#303030] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <X size={17} />
                  </button>

                  <div className="flex h-[40px] items-center justify-between rounded-full bg-white px-3">
                    <button
                      type="button"
                      onClick={() => decrementQuestionCount(index)}
                      className="text-[#dadada]"
                    >
                      −
                    </button>
                    <span className="text-[15px] font-bold text-[#303030]">
                      {item.count}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementQuestionCount(index)}
                      className="text-[#dadada]"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex h-[40px] items-center justify-between rounded-full bg-white px-3">
                    <button
                      type="button"
                      onClick={() => decrementMarks(index)}
                      className="text-[#dadada]"
                    >
                      −
                    </button>
                    <span className="text-[15px] font-bold text-[#303030]">
                      {item.marks}
                    </span>
                    <button
                      type="button"
                      onClick={() => incrementMarks(index)}
                      className="text-[#dadada]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.questionTypes ? (
              <p className="mt-3 text-sm font-semibold text-[#770d0d]">
                {errors.questionTypes}
              </p>
            ) : null}

            <button
              type="button"
              onClick={addQuestionType}
              className="mt-4 inline-flex items-center gap-3 text-[15px] font-bold text-[#303030]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#303030] text-white">
                <Plus size={20} />
              </span>
              Add Question Type
            </button>

            <div className="mt-6 flex justify-end">
              <div className="space-y-2 text-right text-[15px] font-bold text-[#303030]">
                <p>Total Questions: {totals.questions}</p>
                <p>Total Marks: {totals.marks}</p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <label className="mb-3 block text-[15px] font-bold text-[#303030]">
              Additional Information For better output
            </label>

            <div className="relative">
              <textarea
                value={additionalInstructions}
                onChange={(event) =>
                  setAdditionalInstructions(event.target.value)
                }
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="min-h-[96px] w-full resize-none rounded-[20px] border border-dashed border-[#dadada] bg-white px-5 py-4 pr-12 text-[15px] text-[#303030] outline-none placeholder:text-[#A9A9A9] focus:border-[#ff5623]"
              />

              <button
                type="button"
                className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f6f6] text-[#303030]"
              >
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="flex h-[48px] items-center gap-2 rounded-full bg-white px-7 text-[16px] font-semibold text-[#303030] shadow-sm"
          >
            ← Previous
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[48px] items-center gap-2 rounded-full bg-[#181818] px-7 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Generating..." : "Next →"}
          </button>
        </div>
      </div>
    </form>
  );
}
