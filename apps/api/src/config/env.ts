import dotenv from 'dotenv';

dotenv.config();

export const  env = {
    port: process.env.PORT || 4000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai_assessment_creator',

    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    redisPassword: process.env.REDIS_PASSWORD || undefined,

    aiProvider: process.env.AI_PROVIDER || 'mock',
    openaiApiKey: process.env.OPENAI_API_KEY || undefined,
}