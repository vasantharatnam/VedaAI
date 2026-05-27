import IORedis from "ioredis";
import { env } from "./env";


export const redisConnection = new IORedis({
    host: env.redisHost,
    port: env.redisPort,
    ...(env.redisPassword ? { password: env.redisPassword } : {}),
    maxRetriesPerRequest: null,
});


export const getBullMQConnectionOptions = () => {
  return {
    host: env.redisHost,
    port: env.redisPort,
    ...(env.redisPassword ? { password: env.redisPassword } : {}),
    maxRetriesPerRequest: null,
  };
};


export const connectRedis = async (): Promise<void> => {
    try {
        const response = await redisConnection.ping()

        if(response === "PONG"){
            console.log("Redis connected successfully");
        }
    } catch (error) {
         console.error("Redis connection failed", error);
         process.exit(1);
    }
};


export const disconnectRedis = async (): Promise<void> => {
  await redisConnection.quit();
};