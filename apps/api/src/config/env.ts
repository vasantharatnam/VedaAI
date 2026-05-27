import dotenv from 'dotenv';

dotenv.config();

const normalizeAiProvider = (value?: string) => {
    const provider = (value || 'mock').trim().toLowerCase();

    return provider === 'openai' ? 'openai' : 'mock';
};

const optionalTrimmedValue = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed || undefined;
};

export const  env = {
    port: process.env.PORT || 4000,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai_assessment_creator',

    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    redisPassword: optionalTrimmedValue(process.env.REDIS_PASSWORD),

    aiProvider: normalizeAiProvider(process.env.AI_PROVIDER),
    openaiApiKey: optionalTrimmedValue(process.env.OPENAI_API_KEY),
    openAiModel: optionalTrimmedValue(process.env.OPENAI_MODEL) || "gpt-4o-mini",

}
