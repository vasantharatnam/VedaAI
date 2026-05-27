import mongoose from 'mongoose';
import { env } from "./env";


export const connectMongoDB =  async (): Promise<void> => {
    try {
        await mongoose.connect(env.mongodbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with an error code
    }
}

export const disconnectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}