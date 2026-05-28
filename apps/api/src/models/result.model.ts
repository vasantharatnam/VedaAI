import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { QuestionPaper } from "../types/assignment.types";

export interface ResultDocument extends Document {
  assignmentId: Types.ObjectId;
  paper: QuestionPaper;
  provider: "groq" | "claude" | "oss";
  createdAt: Date;
  updatedAt: Date;
}

const generatedQuestionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Multiple Choice Questions",
        "Short Questions",
        "Diagram/Graph-Based Questions",
        "Numerical Problems",
        "Long Answer Questions",
      ],
    },
  },
  {
    _id: false,
  }
);

const questionSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [generatedQuestionSchema],
      required: true,
      default: [],
    },
  },
  {
    _id: false,
  }
);

const questionPaperSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
      default: "VedaAI School",
    },
    subject: {
      type: String,
      required: true,
      default: "General Subject",
    },
    className: {
      type: String,
      required: true,
      default: "Class 10",
    },
    timeAllowed: {
      type: String,
      required: true,
      default: "3 Hours",
    },
    maximumMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    generalInstructions: {
      type: [String],
      required: true,
      default: [],
    },
    sections: {
      type: [questionSectionSchema],
      required: true,
      default: [],
    },
  },
  {
    _id: false,
  }
);

const resultSchema = new Schema<ResultDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      unique: true,
      index: true,
    },

    paper: {
      type: questionPaperSchema,
      required: true,
    },

    provider: {
      type: String,
      enum: ["groq", "claude", "oss"],
      default: "groq",
    },
  },
  {
    timestamps: true,
  }
);

export const ResultModel: Model<ResultDocument> =
  mongoose.models.Result as Model<ResultDocument> ||
  mongoose.model<ResultDocument>("Result", resultSchema);
