import { Worker } from "bullmq";
import mongoose from "mongoose";
import { getBullMQConnectionOptions } from "../config/redis";
import {
  GENERATION_QUEUE_NAME,
  GenerationJobName,
  GenerationJobPayload,
  GenerationJobResult,
} from "../queues/generation.queue";

import { AssignmentModel } from "../models/assignment.model";
import { generateQuestionPaper } from "../services/ai-generation.service";
import { ResultModel } from "../models/result.model";

import {
  emitGenerationCompleted,
  emitGenerationFailed,
  emitGenerationStatus,
} from "../socket/socket.server";

let generationWorker: Worker<
  GenerationJobPayload,
  GenerationJobResult,
  GenerationJobName
> | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const startGenerationWorker = () => {
  if (generationWorker) {
    return generationWorker;
  }

  generationWorker = new Worker<
    GenerationJobPayload,
    GenerationJobResult,
    GenerationJobName
  >(
    GENERATION_QUEUE_NAME,

    async (job) => {
      const { assignmentId } = job.data;

      if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        throw new Error(
          `Invalid assignment id in job payload: ${assignmentId}`,
        );
      }

      console.log(`Generation job started: ${job.id}`);

      const assignment = await AssignmentModel.findById(assignmentId);

      if (!assignment) {
        throw new Error(`Assignment not found for id: ${assignmentId}`);
      }

      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "processing",
        errorMessage: "",
      });

      await job.updateProgress(20);


      emitGenerationStatus(assignmentId, {
        status: "processing",
        progress: 20,
        message: "Assignment received. AI generation has started.",
      });

      const generationResult = await generateQuestionPaper(assignment);

      await job.updateProgress(70);

       emitGenerationStatus(assignmentId, {
        status: "processing",
        progress: 70,
        message:
          generationResult.fallbackReason === "openai_insufficient_quota"
            ? "OpenAI quota exceeded. Mock question paper generated. Saving structured result."
            : "Question paper generated. Saving structured result.",
      });

      await ResultModel.findOneAndUpdate(
        { assignmentId: assignment._id },
        {
          assignmentId: assignment._id,
          paper: generationResult.paper,
          provider: generationResult.provider,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      await job.updateProgress(90);

       emitGenerationStatus(assignmentId, {
        status: "processing",
        progress: 90,
        message: "Structured result saved. Finalizing assignment.",
      });


      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "completed",
      });

      await job.updateProgress(100);

       emitGenerationCompleted(assignmentId, {
        progress: 100,
        message: "Question paper generated successfully.",
      });

      console.log(`Generation job completed: ${job.id}`);

      return {
        assignmentId,
        status: "completed",
      };
    },
    {
      connection: getBullMQConnectionOptions(),
      concurrency: 2,
    },
  );

  generationWorker.on("completed", (job) => {
    console.log(`Worker completed job ${job.id}`);
  });

  generationWorker.on("failed", async (job, error) => {
    console.error(`Worker failed job ${job?.id}`, error);

    const assignmentId = job?.data.assignmentId;

    if (assignmentId && mongoose.Types.ObjectId.isValid(assignmentId)) {
      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "failed",
        errorMessage: error.message,
      });

      emitGenerationFailed(assignmentId, {
        message: "Question paper generation failed.",
        errorMessage: error.message,
      });
    }
  });

  console.log("Generation worker started");

  return generationWorker;
};

export const stopGenerationWorker = async () => {
  if (generationWorker) {
    await generationWorker.close();
    generationWorker = null;
  }
};
