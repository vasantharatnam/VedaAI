import mongoose, { Document, Model, Schema } from "mongoose";
import { AssignmentStatus, QuestionConfig } from "../types/assignment.types";

export interface AssignmentDocument extends Document {
  userId: string;
  title: string;
  subject?: string;
  className?: string;
  dueDate: Date;
  questionTypes: QuestionConfig[];
  additionalInstructions?: string;
  sourceText?: string;
  uploadedFileName?: string;
  uploadedFileMimeType?: string;
  status: AssignmentStatus;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionConfigSchema = new Schema<QuestionConfig>(
  {
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
    count: {
      type: Number,
      required: true,
      min: 1,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
      default: "General Subject",
    },

    className: {
      type: String,
      trim: true,
      default: "Class 10",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    questionTypes: {
      type: [questionConfigSchema],
      required: true,
      validate: {
        validator(value: QuestionConfig[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one question type is required",
      },
    },

    additionalInstructions: {
      type: String,
      trim: true,
      default: "",
    },

    sourceText: {
      type: String,
      default: "",
    },

    uploadedFileName: {
      type: String,
    },

    uploadedFileMimeType: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    jobId: {
      type: String,
      index: true,
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const AssignmentModel: Model<AssignmentDocument> =
  mongoose.models.Assignment as Model<AssignmentDocument> ||
  mongoose.model<AssignmentDocument>("Assignment", assignmentSchema);
