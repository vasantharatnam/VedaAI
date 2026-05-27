export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType =
  | "Multiple Choice Questions"
  | "Short Questions"
  | "Diagram/Graph-Based Questions"
  | "Numerical Problems"
  | "Long Answer Questions";

export interface QuestionConfig {
  type: QuestionType;
  count: number;
  marks: number;
}

export interface Assignment {
  _id: string;
  title: string;
  subject?: string;
  className?: string;
  dueDate: string;
  questionTypes: QuestionConfig[];
  additionalInstructions?: string;
  uploadedFileName?: string;
  uploadedFileMimeType?: string;
  status: AssignmentStatus;
  jobId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  difficulty: Difficulty;
  marks: number;
  type: QuestionType;
}

export interface QuestionSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface QuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string[];
  sections: QuestionSection[];
}

export interface GetAssignmentsResponse {
  success: true;
  message: string;
  data: {
    assignments: Assignment[];
  };
}

export interface DeleteAssignmentResponse {
  success: true;
  message: string;
  data: {
    assignmentId: string;
  };
}

export interface AssignmentJobStatusResponse {
  success: true;
  message: string;
  data: {
    assignmentStatus: AssignmentStatus;
    jobId: string | null;
    jobState: string | null;
    progress: number;
    errorMessage?: string;
    queueMessage?: string;
  };
}

export interface AssignmentResultResponse {
  success: true;
  message: string;
  data: {
    assignment: Assignment;
    result: {
      _id: string;
      assignmentId: string;
      paper: QuestionPaper;
      provider: "mock" | "openai" | "claude" | "oss";
      createdAt: string;
      updatedAt: string;
    };
  };
}