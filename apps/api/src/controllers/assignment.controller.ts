import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AssignmentModel } from "../models/assignment.model";
import { createAssignmentSchema } from "../validations/assignment.validation";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import { addGenerationJob } from "../queues/generation.queue";
import { generationQueue } from "../queues/generation.queue";
import { ResultModel } from "../models/result.model";

const getAuthUserId = (req: Request) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
};

const parseQuestionTypes = (value: unknown) => {
  if (!value) {
    throw new ApiError(400, "Question types are required");
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "Question types must be valid JSON");
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new ApiError(400, "Question types must be valid JSON");
  }
};

const extractTextFromUploadedFile = (file?: Express.Multer.File) => {
  if (!file) {
    return "";
  }

  const textBasedMimeTypes = ["text/plain", "text/markdown"];

  if (textBasedMimeTypes.includes(file.mimetype)) {
    return file.buffer.toString("utf-8");
  }

  return "";
};

export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const parsedQuestionTypes = parseQuestionTypes(req.body.questionTypes);

    const validatedInput = createAssignmentSchema.parse({
      title: req.body.title,
      subject: req.body.subject,
      className: req.body.className,
      dueDate: req.body.dueDate,
      questionTypes: parsedQuestionTypes,
      additionalInstructions: req.body.additionalInstructions,
    });

    const file = req.file;
    const sourceText = extractTextFromUploadedFile(file);

    const assignmentPayload = {
      userId,
      title: validatedInput.title,
      subject: validatedInput.subject,
      className: validatedInput.className,
      dueDate: validatedInput.dueDate,
      questionTypes: validatedInput.questionTypes,
      additionalInstructions: validatedInput.additionalInstructions,
      sourceText,
      status: "pending" as const,
    };

    const assignment = await AssignmentModel.create(
      file
        ? {
            ...assignmentPayload,
            uploadedFileName: file.originalname,
            uploadedFileMimeType: file.mimetype,
          }
        : assignmentPayload,
    );

    const job = await addGenerationJob(String(assignment._id));

    if (job.id) {
      assignment.jobId = String(job.id);
      await assignment.save();
    }

    sendSuccess(res, 201, "Assignment created successfully", {
      assignment,
      jobId: job.id,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const assignments = await AssignmentModel.find({ userId })
      .sort({ createdAt: -1 })
      .select("-sourceText");

    sendSuccess(res, 200, "Assignments fetched successfully", {
      assignments,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getAssignmentById = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const userId = getAuthUserId(req);

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignment = await AssignmentModel.findOne({
      _id: assignmentId,
      userId,
    }).select("-sourceText");

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    sendSuccess(res, 200, "Assignment fetched successfully", {
      assignment,
    });

    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteAssignment = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const userId = getAuthUserId(req);

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignment = await AssignmentModel.findOneAndDelete({
      _id: assignmentId,
      userId,
    });

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    sendSuccess(res, 200, "Assignment deleted successfully", {
      assignmentId,
    });

    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getAssignmentJobStatus = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const userId = getAuthUserId(req);

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignment = await AssignmentModel.findOne({
      _id: assignmentId,
      userId,
    }).select("status jobId errorMessage");

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    let jobState: string | null = null;
    let progress = 0;

    if (assignment.jobId) {
      const job = await generationQueue.getJob(assignment.jobId);

      if (job) {
        jobState = await job.getState();
        progress = typeof job.progress === "number" ? job.progress : 0;
      }
    }

    sendSuccess(res, 200, "Assignment job status fetched successfully", {
      assignmentStatus: assignment.status,
      jobId: assignment.jobId,
      jobState,
      progress,
      errorMessage: assignment.errorMessage,
    });

    return;
  } catch (error) {
    next(error);
    return;
  }
};


export const regenerateAssignment = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const userId = getAuthUserId(req);

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignment = await AssignmentModel.findOne({
      _id: assignmentId,
      userId,
    });

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    const job = await addGenerationJob(String(assignment._id));

    assignment.status = "pending";
    assignment.errorMessage = "";
    if (job.id) {
      assignment.jobId = String(job.id);
    }

    await assignment.save();

    sendSuccess(res, 200, "Regeneration job started successfully", {
      assignment,
      jobId: job.id,
    });

    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const getAssignmentResult = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const userId = getAuthUserId(req);

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignmentObjectId = new mongoose.Types.ObjectId(assignmentId);

    const assignment = await AssignmentModel.findOne({
      _id: assignmentObjectId,
      userId,
    }).select("-sourceText");

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    const result = await ResultModel.findOne({
      assignmentId: assignmentObjectId,
    });

    if (!result) {
      throw new ApiError(
        404,
        "Result not generated yet. Please check assignment status."
      );
    }

    sendSuccess(res, 200, "Assignment result fetched successfully", {
      assignment,
      result,
    });

    return;
  } catch (error) {
    next(error);
    return;
  }
};
