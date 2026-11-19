import { Request, Response } from 'express';
import { Truck } from '../models/Truck';

export async function getAllTrucks(req: Request, res: Response) {
  try {
    const { search, type, returnOnly, instantOnly, minTons, maxRate } = req.query;

    const query: any = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (returnOnly === 'true') {
      query['returnTripMatch.isReturningEmpty'] = true;
    }

    if (instantOnly === 'true') {
      query.instantBooking = true;
    }

    if (minTons) {
      query.capacityTons = { $gte: Number(minTons) };
    }

    if (maxRate) {
      query.ratePerKm = { $lte: Number(maxRate) };
    }

    let trucks = await Truck.find(query).sort({ rating: -1, createdAt: -1 });

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      trucks = trucks.filter((t) => {
        const matchesOrigin = t.currentLocation.toLowerCase().includes(q);
        const matchesDest = t.destinationsCovered.some((d) => d.toLowerCase().includes(q));
        const matchesReturn =
          t.returnTripMatch &&
          (t.returnTripMatch.origin.toLowerCase().includes(q) ||
            t.returnTripMatch.destination.toLowerCase().includes(q));
        const matchesName = t.name.toLowerCase().includes(q) || t.driverName.toLowerCase().includes(q);
        return matchesOrigin || matchesDest || matchesReturn || matchesName;
      });
    }

    res.json({
      success: true,
      count: trucks.length,
      data: trucks,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching trucks' });
  }
}

export async function getTruckById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const truck = await Truck.findOne({ id });

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }

    res.json({ success: true, data: truck });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createTruck(req: Request, res: Response) {
  try {
    const truckData = req.body;
    const id = `trk-${Date.now().toString().slice(-4)}`;

    const newTruck = await Truck.create({
      ...truckData,
      id,
      rating: 4.95,
      reviewsCount: 0,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully in marketplace',
      data: newTruck,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating truck' });
  }
}

export async function toggleTruckAvailability(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const truck = await Truck.findOne({ id });

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }

    truck.isAvailable = !truck.isAvailable;
    await truck.save();

    res.json({
      success: true,
      message: `Truck status updated to ${truck.isAvailable ? 'Accepting Loads' : 'Off Duty'}`,
      data: truck,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

