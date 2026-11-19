import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from process cwd, root .env, or local .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });

import { app } from './app';
import { connectDB } from './config/db';
import { seedDatabaseIfEmpty } from './seed/assamSeed';

const PORT = process.env.PORT || 5000;

export async function startServer() {
  try {
    const conn = await connectDB();
    if (conn) {
      await seedDatabaseIfEmpty();
    }
  } catch (err: any) {
    console.warn('[Server Startup] Note on MongoDB connection:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 SuperFast Logistics Backend running on port ${PORT}`);
    console.log(`📍 Operating Region: Assam Logistics Marketplace`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🩺 Health:   http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  return server;
}

startServer();
