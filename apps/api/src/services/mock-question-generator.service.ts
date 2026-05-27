import { AssignmentDocument } from "../models/assignment.model";
import { QuestionConfig, QuestionPaper } from "../types/assignment.types";

const difficultyCycle = ["easy", "medium", "hard"] as const;

const calculateMaximumMarks = (questionTypes: QuestionConfig[]) => {
  return questionTypes.reduce((total, config) => {
    return total + config.count * config.marks;
  }, 0);
};

const buildQuestionText = (
  assignment: AssignmentDocument,
  config: QuestionConfig,
  questionNumber: number,
) => {
  const subject = assignment.subject || "the subject";
  const title = assignment.title || "the assignment";

  switch (config.type) {
    case "Multiple Choice Questions":
      return `Choose the correct answer for ${subject}: concept ${questionNumber} from ${title}.`;
    case "Short Questions":
      return `Answer briefly: explain concept ${questionNumber} from ${title}.`;
    case "Diagram/Graph-Based Questions":
      return `Draw or interpret a diagram/graph related to concept ${questionNumber} in ${subject}.`;
    case "Numerical Problems":
      return `Solve the numerical problem based on concept ${questionNumber} in ${subject}, showing all steps.`;
    case "Long Answer Questions":
      return `Write a detailed answer discussing concept ${questionNumber} from ${title}.`;
    default:
      return `Answer question ${questionNumber} for ${title}.`;
  }
};

const buildSectionInstruction = (config: QuestionConfig) => {
  return `Answer all ${config.count} question${config.count > 1 ? "s" : ""}. Each question carries ${config.marks} mark${config.marks > 1 ? "s" : ""}.`;
};

export const generateMockQuestionPaper = (
  assignment: AssignmentDocument,
): QuestionPaper => {
  let globalQuestionNumber = 1;

  const sections = assignment.questionTypes.map((config, sectionIndex) => {
    const questions = Array.from({ length: config.count }, (_, index) => {
      const questionNumber = globalQuestionNumber;
      globalQuestionNumber += 1;

      return {
        id: `q-${questionNumber}`,
        question: buildQuestionText(assignment, config, questionNumber),
        difficulty:
          difficultyCycle[
            (questionNumber + index) % difficultyCycle.length
          ] ?? "medium",
        marks: config.marks,
        type: config.type,
      };
    });

    return {
      title: `Section ${String.fromCharCode(65 + sectionIndex)} - ${config.type}`,
      instruction: buildSectionInstruction(config),
      questions,
    };
  });

  return {
    schoolName: "VedaAI School",
    subject: assignment.subject || "General Subject",
    className: assignment.className || "Class 10",
    timeAllowed: "3 Hours",
    maximumMarks: calculateMaximumMarks(assignment.questionTypes),
    generalInstructions: [
      "Read all questions carefully before answering.",
      "Attempt all questions in the order given.",
      "Write clear steps for numerical and long answer questions.",
    ],
    sections,
  };
};
