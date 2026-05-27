import { create } from "zustand";
import { QuestionConfig, QuestionType } from "../types/assignment";

interface AssignmentFormState {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  file: File | null;
  questionTypes: QuestionConfig[];
  additionalInstructions: string;

  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setClassName: (className: string) => void;
  setDueDate: (dueDate: string) => void;
  setFile: (file: File | null) => void;
  setAdditionalInstructions: (instructions: string) => void;

  addQuestionType: () => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (
    index: number,
    field: keyof QuestionConfig,
    value: string | number
  ) => void;
  incrementQuestionCount: (index: number) => void;
  decrementQuestionCount: (index: number) => void;
  incrementMarks: (index: number) => void;
  decrementMarks: (index: number) => void;

  resetForm: () => void;
}

const initialQuestionTypes: QuestionConfig[] = [
  {
    type: "Multiple Choice Questions",
    count: 4,
    marks: 1,
  },
  {
    type: "Short Questions",
    count: 3,
    marks: 2,
  },
  {
    type: "Diagram/Graph-Based Questions",
    count: 5,
    marks: 5,
  },
  {
    type: "Numerical Problems",
    count: 5,
    marks: 5,
  },
];

const initialState = {
  title: "Create Assignment",
  subject: "Science",
  className: "Class 10",
  dueDate: "",
  file: null,
  questionTypes: initialQuestionTypes,
  additionalInstructions: "",
};

export const useAssignmentFormStore = create<AssignmentFormState>((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setSubject: (subject) => set({ subject }),
  setClassName: (className) => set({ className }),
  setDueDate: (dueDate) => set({ dueDate }),
  setFile: (file) => set({ file }),
  setAdditionalInstructions: (additionalInstructions) =>
    set({ additionalInstructions }),

  addQuestionType: () =>
    set((state) => ({
      questionTypes: [
        ...state.questionTypes,
        {
          type: "Long Answer Questions",
          count: 1,
          marks: 5,
        },
      ],
    })),

  removeQuestionType: (index) =>
    set((state) => ({
      questionTypes:
        state.questionTypes.length === 1
          ? state.questionTypes
          : state.questionTypes.filter((_, itemIndex) => itemIndex !== index),
    })),

  updateQuestionType: (index, field, value) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        return {
          ...item,
          [field]: field === "type" ? value : Number(value),
        };
      }),
    })),

  incrementQuestionCount: (index) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((item, itemIndex) =>
        itemIndex === index ? { ...item, count: item.count + 1 } : item
      ),
    })),

  decrementQuestionCount: (index) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, count: Math.max(1, item.count - 1) }
          : item
      ),
    })),

  incrementMarks: (index) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((item, itemIndex) =>
        itemIndex === index ? { ...item, marks: item.marks + 1 } : item
      ),
    })),

  decrementMarks: (index) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, marks: Math.max(1, item.marks - 1) }
          : item
      ),
    })),

  resetForm: () =>
    set({
      ...initialState,
      questionTypes: initialQuestionTypes,
    }),
}));

export const questionTypeOptions: QuestionType[] = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
];