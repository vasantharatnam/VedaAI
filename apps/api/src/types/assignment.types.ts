export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = 
     | "Multiple Choice Questions"
     | "Short Questions"
     | "Diagram/Graph-Based Questions"
     | "Numerical Problems"
     | "Long Answer Questions"


export interface QuestionConfig {
    type: QuestionType;
    count: number;
    marks: number;
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
     instructions: string;
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