import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectMongoDB, disconnectMongoDB } from "./config/db";
import { connectRedis, disconnectRedis } from "./config/redis";

import { startGenerationWorker, stopGenerationWorker } from "./workers/generation.worker";

const startServer = async () => {
   try{
      await connectMongoDB();
      await connectRedis();

      startGenerationWorker();
     
      const server = http.createServer(app);

      server.listen(env.port, () => {
         console.log(`Server is running on port ${env.port}`);
      });

      const gracefulShutdown = async () => {
         console.log("Shutting down gracefully...");

         stopGenerationWorker();
         await disconnectRedis();
         await disconnectMongoDB();

         server.close(() => {
            console.log("HTTP server closed");
             process.exit(0);
         });
      };

       process.on("SIGINT", gracefulShutdown);
       process.on("SIGTERM", gracefulShutdown);
   } catch(error) {
      console.error("Error starting server:", error);
      process.exit(1);
   }
}


startServer();