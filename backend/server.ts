import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from process cwd, root .env, or local .env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });

import { app } from './app';
import { connectDB } from './config/db';
import { seedDatabaseIfEmpty } from './seed/assamSeed';

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

export async function startServer() {
  try {
    const conn = await connectDB();
    if (conn) {
      await seedDatabaseIfEmpty();
    }
  } catch (err: any) {
    console.warn('[Server Startup] Note on MongoDB connection:', err.message);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 SuperFast Logistics Backend running on port ${PORT}`);
    console.log(`📍 Operating Region: Assam Logistics Marketplace`);
    console.log(`🔗 Host Binding: http://${HOST}:${PORT}`);
    console.log(`🔗 API Base:     http://${HOST}:${PORT}/api`);
    console.log(`🩺 Health:       http://${HOST}:${PORT}/api/health`);
    console.log(`====================================================`);
  });

  return server;
}

startServer();
