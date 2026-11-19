import { Request, Response } from 'express';
import { LoadRequest } from '../models/LoadRequest';
import { DriverOffer } from '../models/DriverOffer';

export async function getAllLoads(req: Request, res: Response) {
  try {
    const { status, customerId, origin, destination } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customerId = customerId;
    }
    if (origin) {
      query.originCity = { $regex: String(origin), $options: 'i' };
    }
    if (destination) {
      query.destinationCity = { $regex: String(destination), $options: 'i' };
    }

    const loads = await LoadRequest.find(query).sort({ isUrgent: -1, createdAt: -1 });

    res.json({
      success: true,
      count: loads.length,
      data: loads,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching loads' });
  }
}

export async function getLoadById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const load = await LoadRequest.findOne({ id });

    if (!load) {
      return res.status(404).json({ success: false, message: 'Load request not found' });
    }

    const offers = await DriverOffer.find({ loadRequestId: id });

    res.json({
      success: true,
      data: {
        ...load.toObject(),
        offers,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createLoad(req: Request, res: Response) {
  try {
    const loadData = req.body;
    const id = `load-${Date.now().toString().slice(-4)}`;

    const newLoad = await LoadRequest.create({
      ...loadData,
      id,
      status: 'open',
      offersCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Freight shipment request broadcasted successfully to matching drivers along the corridor',
      data: newLoad,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating load' });
  }
}

export async function updateLoadStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const load = await LoadRequest.findOne({ id });
    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    load.status = status;
    await load.save();

    res.json({ success: true, data: load });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

