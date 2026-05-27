import {Server as HttpServer } from "http";
import  { Server } from "socket.io";
import  { env } from "../config/env";



let io: Server | null  = null;

export const initSocketServer = (httpServer: HttpServer) : Server => {

    io = new Server(httpServer, {
      cors: {
         origin: env.frontendUrl,
         credentials: true,
         methods: ["GET" , "POST"],
      },
    });

    io.on("connection" , (socket) => {
         console.log(`Socket connected: ${socket.id}`);

         socket.on("assignment:join" , (assignmentId: string) => {
            if(!assignmentId){
                return;
            }

            socket.join(assignmentId);

            socket.emit("assignment:joined" , {
                assignmentId,
                message: "Joined assignment generation error"
            });

             console.log(`Socket ${socket.id} joined assignment room ${assignmentId}`);
         });

         socket.on("assignment:leave" , (assignmentId : string) => {
             if(assignmentId){
                return;
             }

             socket.leave(assignmentId);

             console.log(`Socket ${socket.id} left assignment room ${assignmentId}`);
         })

         socket.on("disconnect", () => {
          console.log(`Socket disconnected: ${socket.id}`);
        });
    })

     console.log("Socket.IO server initialized");

    return io;
}

export const getSocketServer = (): Server => {
    if(!io){
        throw new Error("Socket.IO server has not been initialized");
    }

    return io;
}


export const emitGenerationStatus = (
    assignmentId: string,
    payload: {
        status: "pending" | "processing" | "completed" | "failed";
        progress: number;
        message: string;
        errorMessage?: string;
    } 
) : void => {
      if(!io){
        console.warn("Socket.IO server not initialized. Skipping emit.");
        return;
      }

      io.to(assignmentId).emit("generation: status" , {
         assignmentId,
         ...payload,
      });
};

export const emitGenerationCompleted = (
  assignmentId: string,
  payload: {
    progress: number;
    message: string;
  }
): void => {
  if (!io) {
    console.warn("Socket.IO server not initialized. Skipping completed emit.");
    return;
  }

  io.to(assignmentId).emit("generation:completed", {
    assignmentId,
    status: "completed",
    ...payload,
  });
};

export const emitGenerationFailed = (
  assignmentId: string,
  payload: {
    message: string;
    errorMessage: string;
  }
): void => {
  if (!io) {
    console.warn("Socket.IO server not initialized. Skipping failed emit.");
    return;
  }

  io.to(assignmentId).emit("generation:failed", {
    assignmentId,
    status: "failed",
    progress: 0,
    ...payload,
  });
};