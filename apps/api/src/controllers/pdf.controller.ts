import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AssignmentModel } from "../models/assignment.model";
import { ResultModel } from "../models/result.model";
import { ApiError } from "../utils/api-error";
import { generateQuestionPaperPdf } from "../services/pdf.service";

const sanitizeFileName = (value: string) => {
  return value
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export const downloadAssignmentPdf = async (
  req: Request<{ assignmentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId } = req.params;

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw new ApiError(400, "Invalid assignment id");
    }

    const assignmentObjectId = new mongoose.Types.ObjectId(assignmentId);

    const assignment = await AssignmentModel.findById(assignmentObjectId).select(
      "title status"
    );

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    const result = await ResultModel.findOne({
      assignmentId: assignmentObjectId,
    });

    if (!result) {
      throw new ApiError(
        404,
        "Question paper is not generated yet. Please try again after generation completes."
      );
    }

    const fileName = `${sanitizeFileName(assignment.title)}-question-paper.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await generateQuestionPaperPdf(res, result.paper);

    return;
  } catch (error) {
    next(error);
    return;
  }
};