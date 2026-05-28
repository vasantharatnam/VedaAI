import { env } from "../config/env";
import { AssignmentDocument } from "../models/assignment.model";
import {
  questionPaperSchema,
  ValidatedQuestionPaper,
} from "../schemas/question-paper.schema";

import { buildQuestionPaperPrompt } from "./prompt-builder.service";

const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";

type GenerationProvider = "groq";

export type GeneratedQuestionPaperResult = {
  paper: ValidatedQuestionPaper;
  provider: GenerationProvider;
};

class GroqGenerationError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly type: string | undefined;
  readonly responseBody: string;

  constructor({
    status,
    message,
    code,
    type,
    responseBody,
  }: {
    status: number;
    message: string;
    code: string | undefined;
    type: string | undefined;
    responseBody: string;
  }) {
    super(message);
    this.name = "GroqGenerationError";
    this.status = status;
    this.code = code;
    this.type = type;
    this.responseBody = responseBody;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createGroqGenerationError = (
  status: number,
  responseBody: string,
) => {
  let message = responseBody;
  let code: string | undefined;
  let type: string | undefined;

  try {
    const parsed = JSON.parse(responseBody) as unknown;

    if (isRecord(parsed) && isRecord(parsed.error)) {
      const error = parsed.error;
      message =
        typeof error.message === "string" ? error.message : responseBody;
      code = typeof error.code === "string" ? error.code : undefined;
      type = typeof error.type === "string" ? error.type : undefined;
    }
  } catch {
    message = responseBody;
  }

  return new GroqGenerationError({
    status,
    message: `GROQ generation failed: ${message}`,
    code,
    type,
    responseBody,
  });
};

const isGroqCreditUsageCompletedError = (error: unknown) => {
  if (!(error instanceof GroqGenerationError)) {
    return false;
  }

  const searchableText = [
    error.code,
    error.type,
    error.message,
    error.responseBody,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    error.status === 402 ||
    searchableText.includes("insufficient_quota") ||
    searchableText.includes("quota") ||
    searchableText.includes("credit") ||
    searchableText.includes("billing") ||
    searchableText.includes("balance")
  );
};

const normalizeQuestionPaperPayload = (payload: unknown) => {
  if (!isRecord(payload)) {
    return payload;
  }

  const normalized = { ...payload };

  if (typeof normalized.generalInstructions === "string") {
    normalized.generalInstructions = [normalized.generalInstructions];
  }

  if (Array.isArray(normalized.sections)) {
    normalized.sections = normalized.sections.map((section) => {
      if (!isRecord(section)) {
        return section;
      }

      const normalizedSection = { ...section };

      if (Array.isArray(normalizedSection.questions)) {
        normalizedSection.questions = normalizedSection.questions.map((question) => {
          if (!isRecord(question)) {
            return question;
          }

          return {
            ...question,
            id:
              typeof question.id === "string"
                ? question.id
                : String(question.id ?? ""),
          };
        });
      }

      return normalizedSection;
    });
  }

  return normalized;
};

const extractGroqContent = (responseJson: any): string => {
  const content = responseJson?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("GROQ response did not contain valid content");
  }

  return content;
};

const generateWithGroq = async (
  assignment: AssignmentDocument,
): Promise<ValidatedQuestionPaper> => {
  if (!env.groqApiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const prompt = buildQuestionPaperPrompt(assignment);

  console.log(`Generating question paper with groq:${env.groqModel}`);

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groqApiKey}`,
      "Content-Type": "application/json",
    },
     body: JSON.stringify({
      model: env.groqModel,
      messages: [
        {
          role: "system",
          content:
            "You are an expert academic assessment creator. Return only a valid JSON object that matches this shape: schoolName string, subject string, className string, timeAllowed string, maximumMarks number, generalInstructions array of strings, and sections array. Each section must contain title string, instruction string, and questions array. Each question must contain id string, question string, difficulty easy|medium|hard, marks number, and type string. Do not include markdown or explanatory text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw createGroqGenerationError(response.status, errorText);
  }

   const responseJson = await response.json();
  const content = extractGroqContent(responseJson);

  const parsed = JSON.parse(content);

   return questionPaperSchema.parse(normalizeQuestionPaperPayload(parsed));
};

export const generateQuestionPaper = async (
  assignment: AssignmentDocument
): Promise<GeneratedQuestionPaperResult> => {
  try {
    return {
      paper: await generateWithGroq(assignment),
      provider: env.aiProvider,
    };
  } catch (error) {
    if (isGroqCreditUsageCompletedError(error)) {
      throw new Error("credit usage of groq completed");
    }

    throw error;
  }
};
