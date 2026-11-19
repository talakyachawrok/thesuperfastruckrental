import { Request, Response } from 'express';
import { User } from '../models/User';
import { Truck } from '../models/Truck';
import { LoadRequest } from '../models/LoadRequest';
import { Booking } from '../models/Booking';
import { DriverOffer } from '../models/DriverOffer';
import { Notification } from '../models/Notification';
import { seedDatabaseIfEmpty } from '../seed/assamSeed';

export async function getAdminStats(req: Request, res: Response) {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrucks = await Truck.countDocuments();
    const totalLoads = await LoadRequest.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find({});
    const totalGMV = bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0) + 48200;
    const platformRevenue = Math.round(totalGMV * 0.08); // 8% marketplace take rate

    res.json({
      success: true,
      data: {
        activeTrucks: totalTrucks || 840,
        completedTrips: totalBookings + 14250,
        emptyMilesSavedKm: 685000,
        co2SavedTons: 540,
        avgShipperSavingsPercent: 34,
        totalShippers: 3420,
        totalDrivers: 1280,
        onTimeRatePercent: 98.9,
        totalGMV,
        platformRevenue,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching admin stats' });
  }
}

export async function getPendingDrivers(req: Request, res: Response) {
  try {
    // Return demo compliance review queue
    const pending = [
      {
        id: 'p-drv-1',
        name: 'Diganta Moran',
        email: 'diganta.moran@assamfreight.demo',
        vehicle: 'Tata Signa 4825.TK (AS-23-CD-8812)',
        dotNumber: 'AS-23-2024-COM (Demo RTO Permit)',
        status: 'pending',
      },
      {
        id: 'p-drv-2',
        name: 'Rupam Phukan',
        email: 'rupam.phukan@upperassamtransport.demo',
        vehicle: 'BharatBenz 2823R (AS-06-EA-3341)',
        dotNumber: 'AS-06-2024-COM (Demo RTO Permit)',
        status: 'pending',
      },
    ];

    res.json({
      success: true,
      data: pending,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function approvePendingDriver(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    res.json({
      success: true,
      message: `Carrier ${name || id} has been vetted and granted verified carrier status on the marketplace (demo).`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function resetDatabaseSeed(req: Request, res: Response) {
  try {
    await User.deleteMany({});
    await Truck.deleteMany({});
    await LoadRequest.deleteMany({});
    await DriverOffer.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});

    await seedDatabaseIfEmpty();

    res.json({
      success: true,
      message: 'Database sandbox re-initialized with fresh Assam logistics marketplace seed data',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error resetting database' });
  }
}

