import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db';
import { seedDatabaseIfEmpty } from './seed/assamSeed';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import truckRoutes from './routes/truckRoutes';
import loadRoutes from './routes/loadRoutes';
import offerRoutes from './routes/offerRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notificationRoutes';

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection for incoming requests
app.use(async (req, res, next) => {
  try {
    const conn = await connectDB();
    if (conn) {
      await seedDatabaseIfEmpty();
    }
  } catch (err) {
    // Keep server running and report through health endpoint
    console.warn('[MongoDB Middleware] Database connection attempt failed:', (err as any).message);
  }
  next();
});

// Health & Diagnostics Route
app.get('/api/health', (req: Request, res: Response) => {
  const connected = isDBConnected();
  const uriConfigured = Boolean(
    process.env.MONGODB_URI?.trim() &&
    !process.env.MONGODB_URI.includes('<db_password>') &&
    !process.env.MONGODB_URI.includes('<password>')
  );

  res.json({
    success: true,
    platform: 'SuperFast Truck Rental & Logistics Marketplace',
    serviceRegion: 'Assam, India',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected,
      status: connected ? 'operational' : uriConfigured ? 'connecting' : 'pending_configuration',
      message: connected
        ? 'Connected to MongoDB Atlas cluster (Database: superfast)'
        : uriConfigured
        ? 'Attempting to establish connection with MongoDB Atlas cluster...'
        : 'MongoDB connection string is pending in root .env. Please paste your MongoDB Atlas URI.',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

