import { env } from "../config/env";
import { AssignmentDocument } from "../models/assignment.model";
import {
  questionPaperSchema,
  ValidatedQuestionPaper,
} from "../schemas/question-paper.schema";

import { buildQuestionPaperPrompt } from "./prompt-builder.service";
import { generateMockQuestionPaper } from "./mock-question-generator.service";

const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";

type GenerationProvider = "mock" | "openai";

export type GeneratedQuestionPaperResult = {
  paper: ValidatedQuestionPaper;
  provider: GenerationProvider;
  fallbackReason?: "openai_insufficient_quota";
};

class OpenAIGenerationError extends Error {
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
    this.name = "OpenAIGenerationError";
    this.status = status;
    this.code = code;
    this.type = type;
    this.responseBody = responseBody;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createOpenAIError = (status: number, responseBody: string) => {
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

  return new OpenAIGenerationError({
    status,
    message: `OpenAI generation failed: ${message}`,
    code,
    type,
    responseBody,
  });
};

const isInsufficientQuotaError = (error: unknown) => {
  if (!(error instanceof OpenAIGenerationError)) {
    return false;
  }

  return (
    error.code === "insufficient_quota" || error.type === "insufficient_quota"
  );
};

const generateWithMock = (assignment: AssignmentDocument) => {
  return questionPaperSchema.parse(generateMockQuestionPaper(assignment));
};

const questionPaperJsonSchema = {
  name: "question_paper",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "schoolName",
      "subject",
      "className",
      "timeAllowed",
      "maximumMarks",
      "generalInstructions",
      "sections",
    ],
    properties: {
      schoolName: { type: "string" },
      subject: { type: "string" },
      className: { type: "string" },
      timeAllowed: { type: "string" },
      maximumMarks: { type: "number" },
      generalInstructions: {
        type: "array",
        items: { type: "string" },
      },
      sections: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "instruction", "questions"],
          properties: {
            title: { type: "string" },
            instruction: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["id", "question", "difficulty", "marks", "type"],
                properties: {
                  id: { type: "string" },
                  question: { type: "string" },
                  difficulty: {
                    type: "string",
                    enum: ["easy", "medium", "hard"],
                  },
                  marks: { type: "number" },
                  type: {
                    type: "string",
                    enum: [
                      "Multiple Choice Questions",
                      "Short Questions",
                      "Diagram/Graph-Based Questions",
                      "Numerical Problems",
                      "Long Answer Questions",
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const extractOpenAIContent = (responseJson: any): string => {
  const content = responseJson?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("OpenAI response did not contain valid content");
  }

  return content;
};

const generateWithOpenAI = async (
  assignment: AssignmentDocument,
): Promise<ValidatedQuestionPaper> => {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const prompt = buildQuestionPaperPrompt(assignment);

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
     body: JSON.stringify({
      model: env.openAiModel,
      messages: [
        {
          role: "system",
          content:
            "You are an expert academic assessment creator. Return only valid JSON that matches the provided schema.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: questionPaperJsonSchema,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw createOpenAIError(response.status, errorText);
  }

   const responseJson = await response.json();
  const content = extractOpenAIContent(responseJson);

  const parsed = JSON.parse(content);

   return questionPaperSchema.parse(parsed);
};

export const generateQuestionPaper = async (
  assignment: AssignmentDocument
): Promise<GeneratedQuestionPaperResult> => {
  if (env.aiProvider === "openai") {
    try {
      return {
        paper: await generateWithOpenAI(assignment),
        provider: "openai",
      };
    } catch (error) {
      if (isInsufficientQuotaError(error)) {
        console.warn(
          "OpenAI quota exceeded. Falling back to mock question generation.",
        );

        return {
          paper: generateWithMock(assignment),
          provider: "mock",
          fallbackReason: "openai_insufficient_quota",
        };
      }

      throw error;
    }
  }

  return {
    paper: generateWithMock(assignment),
    provider: "mock",
  };
};
