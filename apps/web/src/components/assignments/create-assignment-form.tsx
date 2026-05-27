"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FileText, Plus, Trash2, UploadCloud } from "lucide-react";
import { useAssignmentFormStore, questionTypeOptions } from "../../store/assignment-form.store";
import { apiRequest } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

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

export function CreateAssignmentForm({ onCreated }: CreateAssignmentFormProps) {
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card className="rounded-[28px] p-6 lg:p-8">
            <div>
              <h2 className="text-[22px] font-extrabold text-[#303030]">
                Assignment Details
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5E5E5E]">
                Add basic information and optional material for the AI to use.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Assignment Title"
                placeholder="e.g. Physics Motion Test"
                value={title}
                error={errors.title}
                onChange={(event) => setTitle(event.target.value)}
              />

              <Input
                label="Subject"
                placeholder="e.g. Physics"
                value={subject}
                error={errors.subject}
                onChange={(event) => setSubject(event.target.value)}
              />

              <Input
                label="Class"
                placeholder="e.g. Class 10"
                value={className}
                error={errors.className}
                onChange={(event) => setClassName(event.target.value)}
              />

              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                error={errors.dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>

            <div className="mt-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#303030]">
                  Upload Material Optional
                </span>

                <div className="rounded-[24px] border border-dashed border-[#a9a9a9] bg-[#fafafa] p-6 text-center">
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ff5623] shadow-sm">
                      <UploadCloud size={24} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-[#303030]">
                      Click to upload PDF or text file
                    </p>

                    <p className="mt-1 text-xs text-[#5E5E5E]">
                      PDF, TXT, MD, DOCX up to 5MB
                    </p>
                  </label>

                  {file ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#303030]">
                      <FileText size={16} />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="ml-2 text-[#770d0d]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>

                {errors.file ? (
                  <span className="mt-1 block text-sm font-medium text-[#770d0d]">
                    {errors.file}
                  </span>
                ) : null}
              </label>
            </div>
          </Card>

          <Card className="rounded-[28px] p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[22px] font-extrabold text-[#303030]">
                  Question Configuration
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5E5E5E]">
                  Choose question types, number of questions, and marks.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addQuestionType}
                className="shrink-0"
              >
                <Plus size={18} />
                Add Type
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {questionTypes.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-[20px] border border-[#eeeeee] bg-[#fafafa] p-4 md:grid-cols-[1fr_140px_140px_44px]"
                >
                  <Select
                    label="Question Type"
                    value={item.type}
                    onChange={(event) =>
                      updateQuestionType(index, "type", event.target.value)
                    }
                  >
                    {questionTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Questions"
                    type="number"
                    min={1}
                    value={item.count}
                    onChange={(event) =>
                      updateQuestionType(index, "count", event.target.value)
                    }
                  />

                  <Input
                    label="Marks"
                    type="number"
                    min={1}
                    value={item.marks}
                    onChange={(event) =>
                      updateQuestionType(index, "marks", event.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeQuestionType(index)}
                    disabled={questionTypes.length === 1}
                    className="mt-7 flex h-11 w-11 items-center justify-center rounded-full border border-[#dadada] bg-white text-[#770d0d] transition hover:bg-[#fff4f4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {errors.questionTypes ? (
              <p className="mt-3 text-sm font-medium text-[#770d0d]">
                {errors.questionTypes}
              </p>
            ) : null}
          </Card>

          <Card className="rounded-[28px] p-6 lg:p-8">
            <Textarea
              label="Additional Instructions"
              placeholder="Example: Focus on conceptual understanding, include real-life examples, make questions application-based..."
              value={additionalInstructions}
              onChange={(event) =>
                setAdditionalInstructions(event.target.value)
              }
            />
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="sticky top-6 rounded-[28px] p-6">
            <h3 className="text-xl font-extrabold text-[#303030]">
              Assignment Summary
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-[16px] bg-[#f6f6f6] px-4 py-3">
                <span className="text-sm font-medium text-[#5E5E5E]">
                  Total Questions
                </span>
                <span className="text-lg font-extrabold text-[#303030]">
                  {totals.questions}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[16px] bg-[#f6f6f6] px-4 py-3">
                <span className="text-sm font-medium text-[#5E5E5E]">
                  Total Marks
                </span>
                <span className="text-lg font-extrabold text-[#303030]">
                  {totals.marks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[16px] bg-[#f6f6f6] px-4 py-3">
                <span className="text-sm font-medium text-[#5E5E5E]">
                  Question Types
                </span>
                <span className="text-lg font-extrabold text-[#303030]">
                  {questionTypes.length}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={isSubmitting}
              className="mt-6 w-full"
            >
              {isSubmitting ? "Creating..." : "Generate Question Paper"}
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-[#5E5E5E]">
              The assignment will be queued and generated asynchronously using
              AI.
            </p>
          </Card>
        </aside>
      </div>
    </form>
  );
}
