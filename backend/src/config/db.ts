import mongoose from 'mongoose';
import { env } from './env';

export let isDBConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // Timeout after 2 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isDBConnected = true;
  } catch (error) {
    console.warn(`\n[WARNING] MongoDB Connection failed: ${(error as Error).message}`);
    console.warn(`[INFO] Server will run using the local In-Memory Fallback Database.\n`);
    isDBConnected = false;
  }
};
