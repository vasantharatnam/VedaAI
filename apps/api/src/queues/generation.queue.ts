import { Queue } from "bullmq";
import { getBullMQConnectionOptions } from "../config/redis";


export const GENERATION_QUEUE_NAME = "question-generation";
export const GENERATION_JOB_NAME = "generate-question-paper" as const;

export interface GenerationJobPayload {
    assignmentId: string;
}

export interface GenerationJobResult {
  assignmentId: string;
  status: "completed";
}

export type GenerationJobName = typeof GENERATION_JOB_NAME;

export const generationQueue = new Queue<GenerationJobPayload>(
GENERATION_QUEUE_NAME,
  {
    connection: getBullMQConnectionOptions(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 60 * 60,
        count: 100,
      },
      removeOnFail: {
        age: 24 * 60 * 60,
        count: 100,
      },
    },
  }
);


export const addGenerationJob = async (assignmentId: string) => {
  return generationQueue.add("generate-question-paper", {
    assignmentId,
  });
};