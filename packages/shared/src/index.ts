export  type difficulty = "easy" | "medium" | "hard";

export type QuestionType = 
    | "Multiple Choice Questions"
    | "Short Questions"
    | "Diagram/Graph-Based Questions"
    | "Numerical Problems"
    | "Long Answer Questions"


export interface QuestionConfig {
    title: string;
    dueDate: string;
    questionTypes: QuestionConfig[];
    additionalInstructions?: string;
    sourceText?: string;
}

export interface GeneratedQuestion {
    id: string;
    question: string;
    difficulty: difficulty;
    marks: number;
    type: QuestionType;
}

export interface QuestionSection {
    title: string;
    instructions?: string;
    questions: GeneratedQuestion[];
}

export interface QuestionPaper {
    schoolName: string;
    subject: string;
    className: string;
    timeallowed: string;
    maximumMarks: number;
    generaleInstructions?: string[];
    sections: QuestionSection[];
}