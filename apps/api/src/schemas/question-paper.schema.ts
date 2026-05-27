import { z } from "zod"

export const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const questionTypeSchema = z.enum([
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
])

export const generatedQuestionSchema = z.object({
    id: z.string().min(1),
    questions: z.string().min(5),
    difficulty: difficultySchema,
    marks: z.number().positive(),
    type: questionTypeSchema,
});

export const questionSectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(generatedQuestionSchema).min(1),
});


export const questionPaperSchema = z.object({
  schoolName: z.string().min(1),
  subject: z.string().min(1),
  className: z.string().min(1),
  timeAllowed: z.string().min(1),
  maximumMarks: z.number().positive(),
  generalInstructions: z.array(z.string()).min(1),
  sections: z.array(questionSectionSchema).min(1),
});

export type ValidatedQuestionPaper = z.infer<typeof questionPaperSchema>;