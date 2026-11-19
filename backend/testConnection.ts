import { connectDB } from './config/db';
import { seedDatabaseIfEmpty } from './seed/assamSeed';
import { User } from './models/User';
import { Truck } from './models/Truck';
import { LoadRequest } from './models/LoadRequest';
import { Booking } from './models/Booking';
import mongoose from 'mongoose';

async function testConnection() {
  console.log('[Step 1/5] Connecting to MongoDB Atlas using Mongoose with DNS-over-HTTPS fallback...');
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('ERROR: Could not establish connection (URI may be missing or invalid)');
      process.exit(1);
    }

    console.log('[Step 2/5] Connection established! Database readyState:', mongoose.connection.readyState);

    console.log('[Step 3/5] Verifying database handshake ping...');
    const pingRes = await mongoose.connection.db!.admin().ping();
    console.log('Database Ping Response:', JSON.stringify(pingRes));

    console.log('[Step 4/5] Executing database seed / collection checks...');
    await seedDatabaseIfEmpty();

    const userCount = await User.countDocuments();
    const truckCount = await Truck.countDocuments();
    const loadCount = await LoadRequest.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log('[Step 5/5] Database Verification Results:');
    console.log('  - Target Database: superfast');
    console.log('  - Users collection count:', userCount);
    console.log('  - Trucks collection count:', truckCount);
    console.log('  - LoadRequests collection count:', loadCount);
    console.log('  - Bookings collection count:', bookingCount);

    // Retrieve sample record to verify read/write
    const sampleCustomer = await User.findOne({ id: 'usr-cust-1' }).select('name email role companyName city isVerified');
    console.log('  - Sample Record Retrieved:', JSON.stringify(sampleCustomer));

    const sampleTruck = await Truck.findOne({ id: 'trk-01' }).select('name plateNumber currentLocation driverName');
    console.log('  - Sample Truck Retrieved:', JSON.stringify(sampleTruck));

    await mongoose.disconnect();
    console.log('🎉 SUCCESS: MongoDB Atlas connection and all operations verified successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('CONNECTION_ERROR:', err.message);
    process.exit(1);
  }
}

testConnection();

