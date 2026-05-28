import { z } from "zod";

export const questionTypeEnum = z.enum([
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
]);

export const questionConfigSchema = z.object({
  type: questionTypeEnum,
  count: z
    .number({
      message: "Question count must be a number",
    })
    .int("Question count must be an integer")
    .positive("Question count must be greater than zero"),

  marks: z
    .number({
      message: "Marks must be a number",
    })
    .positive("Marks must be greater than zero"),
});

export const createAssignmentSchema = z.object({
  title: z
    .string({
      message: "Assignment title is required",
    })
    .trim()
    .min(3, "Assignment title must be at least 3 characters"),

  subject: z
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters")
    .optional()
    .default("General Subject"),

  className: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .optional()
    .default("Class 10"),

  dueDate: z.coerce.date({
    message: "Due date must be a valid date",
  }),

  questionTypes: z
    .array(questionConfigSchema)
    .min(1, "At least one question type is required"),

  additionalInstructions: z.string().trim().optional().default(""),
}).refine(
  (value) => {
    const totalQuestions = value.questionTypes.reduce((total, config) => {
      return total + config.count;
    }, 0);

    return totalQuestions >= 2;
  },
  {
    path: ["questionTypes"],
    message:
      "Please add at least 2 questions. A one-question paper is too small for reliable generation.",
  }
);

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
