import { AssignmentDocument } from "../models/assignment.model";

const buildQuestionConfigText = (assignment: AssignmentDocument): string => {
  return assignment.questionTypes
    .map((config, index) => {
      return `${index + 1}. Type: ${config.type}, Count: ${config.count}, Marks per question: ${config.marks}`;
    })
    .join("\n");
};

const calculateMaximumMarks = (assignment: AssignmentDocument): number => {
  return assignment.questionTypes.reduce((total, config) => {
    return total + config.count * config.marks;
  }, 0);
};

export const buildQuestionPaperPrompt = (
  assignment: AssignmentDocument,
): string => {
  const maximumMarks = calculateMaximumMarks(assignment);

  const sourceContext =
    assignment.sourceText && assignment.sourceText.trim().length > 0
      ? assignment.sourceText.slice(0, 6000)
      : "No uploaded material was provided. Generate questions based on assignment title, subject, and instructions.";

  return `
You are an expert teacher and exam paper setter.

Create a high-quality question paper for the following assignment.

ASSIGNMENT DETAILS:
Title: ${assignment.title}
Subject: ${assignment.subject || "General Subject"}
Class: ${assignment.className || "Class 10"}
Due Date: ${assignment.dueDate.toISOString()}
Maximum Marks: ${maximumMarks}

QUESTION CONFIGURATION:
${buildQuestionConfigText(assignment)}

TEACHER INSTRUCTIONS:
${assignment.additionalInstructions || "No additional instructions."}

SOURCE MATERIAL:
${sourceContext}

STRICT REQUIREMENTS:
1. Generate exactly the number of questions requested for each question type.
2. Group questions into sections like Section A, Section B, Section C.
3. Each section must have a clear instruction.
4. Each question must include:
   - id
   - question
   - difficulty: easy, medium, or hard
   - marks
   - type
5. For every question with type "Multiple Choice Questions":
   - include options as an array of exactly 4 answer choices
   - include answer as the exact correct option text from options
6. For non-multiple-choice questions, omit options unless they are genuinely needed.
7. The sum of marks must be exactly ${maximumMarks}.
8. Do not include markdown.
9. Do not include explanation outside JSON.
10. Do not return raw text.
11. Return only valid JSON matching the schema.
`;
};
