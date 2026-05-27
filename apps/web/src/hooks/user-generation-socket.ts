"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { webEnv } from "../lib/env";
import { AssignmentStatus } from "../types/assignment";

interface GenerationStatusPayload {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
  errorMessage?: string;
}

interface UseGenerationSocketOptions {
  assignmentId: string;
  onStatus?: (payload: GenerationStatusPayload) => void;
  onCompleted?: (payload: GenerationStatusPayload) => void;
  onFailed?: (payload: GenerationStatusPayload) => void;
}

export function useGenerationSocket({
  assignmentId,
  onStatus,
  onCompleted,
  onFailed,
}: UseGenerationSocketOptions) {
  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    const socket: Socket = io(webEnv.wsUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("assignment:join", assignmentId);
    });

    socket.on("assignment:joined", () => {
      console.log(`Joined assignment room: ${assignmentId}`);
    });

    socket.on("generation:status", (payload: GenerationStatusPayload) => {
      onStatus?.(payload);
    });

    socket.on("generation:completed", (payload: GenerationStatusPayload) => {
      onCompleted?.(payload);
    });

    socket.on("generation:failed", (payload: GenerationStatusPayload) => {
      onFailed?.(payload);
    });

    return () => {
      socket.emit("assignment:leave", assignmentId);
      socket.disconnect();
    };
  }, [assignmentId, onStatus, onCompleted, onFailed]);
}