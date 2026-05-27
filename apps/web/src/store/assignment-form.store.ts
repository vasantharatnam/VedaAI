import { create } from "zustand";
import { QuestionConfig, QuestionType } from "../types/assignment"

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
    setFile:  (file: File | null) => void;
    setAdditionalInstructions: (instructions: string) => void;


    addQuestionType: () => void;
    removeQuestionType: (index: number) => void;
    updateQuestionType: (
        index: number,
        field: keyof QuestionConfig,
        value: string | number
    ) => void;

    resetForm: () => void;
}

const initialQuestionType: QuestionConfig = {
    type: "Multiple Choice Questions",
    count: 5,
    marks: 1,
};

const initialState = {
  title: "",
  subject: "",
  className: "",
  dueDate: "",
  file: null,
  questionTypes: [initialQuestionType],
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
          type: "Short Questions",
          count: 3,
          marks: 2,
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
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: field === "type" ? value : Number(value),
        };
      }),
    })),

  resetForm: () =>
    set({
      ...initialState,
      questionTypes: [initialQuestionType],
    }),
}));


export const questionTypeOptions: QuestionType[] = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
];