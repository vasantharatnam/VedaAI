import dotenv from 'dotenv';

dotenv.config({ path: ".env", override: true });
dotenv.config({ path: "apps/api/.env", override: true });

const normalizeAiProvider = (value?: string): "groq" => {
    const provider = (value || 'groq').trim().toLowerCase();

    if (provider === 'groq' || provider === 'groqapi' || provider === 'groq_api') {
        return 'groq';
    }

    return 'groq';
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
    groqApiKey: optionalTrimmedValue(process.env.GROQ_API_KEY),
    groqModel: optionalTrimmedValue(process.env.GROQ_MODEL) || "llama-3.3-70b-versatile",

}
