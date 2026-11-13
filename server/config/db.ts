import './dnsFallback';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Global connection cache for serverless environments (Vercel)
 * Prevents multiple connections during serverless function invocations
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri.includes('<db_password>') || uri.includes('<password>')) {
    console.warn(
      '[MongoDB] Connection string is missing or contains placeholder password in .env. Operating in pending mode.'
    );
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      dbName: 'superfast',
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[MongoDB] Connected successfully to cluster (Database: superfast)`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

