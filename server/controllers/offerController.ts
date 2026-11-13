import { Request, Response } from 'express';
import { DriverOffer } from '../models/DriverOffer';
import { LoadRequest } from '../models/LoadRequest';
import { Booking } from '../models/Booking';
import { Notification } from '../models/Notification';

export async function getAllOffers(req: Request, res: Response) {
  try {
    const { loadRequestId, driverId } = req.query;
    const query: any = {};

    if (loadRequestId) query.loadRequestId = loadRequestId;
    if (driverId) query.driverId = driverId;

    const offers = await DriverOffer.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching driver offers' });
  }
}

export async function submitOffer(req: Request, res: Response) {
  try {
    const offerData = req.body;
    const id = `off-${Date.now().toString().slice(-4)}`;

    const newOffer = await DriverOffer.create({
      ...offerData,
      id,
      status: 'pending',
    });

    // Increment offer count and update load status
    await LoadRequest.findOneAndUpdate(
      { id: offerData.loadRequestId },
      {
        $inc: { offersCount: 1 },
        $set: { status: 'bids_received' },
      }
    );

    // Create notification for shipper
    const load = await LoadRequest.findOne({ id: offerData.loadRequestId });
    if (load) {
      await Notification.create({
        id: `notif-${Date.now().toString().slice(-5)}`,
        userId: load.customerId,
        role: 'customer',
        title: 'New Price Bid Received',
        message: `${offerData.driverName} placed a bid of ₹${offerData.offeredPrice.toLocaleString()} on your ${load.originCity} to ${load.destinationCity} shipment.`,
        type: 'info',
        link: '/customer-dashboard',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your bid has been submitted to the shipper',
      data: newOffer,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error submitting offer' });
  }
}

export async function acceptOffer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const offer = await DriverOffer.findOne({ id });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const load = await LoadRequest.findOne({ id: offer.loadRequestId });
    if (!load) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }

    // 1. Mark this offer as accepted
    offer.status = 'accepted';
    await offer.save();

    // 2. Reject other offers for this load
    await DriverOffer.updateMany(
      { loadRequestId: offer.loadRequestId, id: { $ne: offer.id } },
      { $set: { status: 'rejected' } }
    );

    // 3. Mark load as booked
    load.status = 'booked';
    await load.save();

    // 4. Create confirmed booking
    const bookingRef = `SF-${Math.floor(1000 + Math.random() * 9000)}-AS`;
    const bookingId = `bk-${Date.now().toString().slice(-4)}`;

    const newBooking = await Booking.create({
      id: bookingId,
      bookingRef,
      loadRequestId: load.id,
      customerId: load.customerId,
      customerName: load.customerName,
      customerPhone: load.customerPhone,
      driverId: offer.driverId,
      driverName: offer.driverName,
      driverPhone: offer.driverPhone,
      driverAvatar: offer.driverAvatar,
      truckId: offer.truckId,
      truckName: offer.truckName,
      truckType: offer.truckType,
      plateNumber: offer.plateNumber,
      originCity: load.originCity,
      originAddress: load.originAddress,
      destinationCity: load.destinationCity,
      destinationAddress: load.destinationAddress,
      cargoCategory: load.cargoCategory,
      weightKg: load.weightKg,
      finalPrice: offer.offeredPrice,
      status: 'confirmed',
      pickupDate: load.pickupDate,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      currentLocationName: `Dispatched from ${load.originCity}`,
      distanceKm: 340,
      isReturnTripDeal: offer.offeredPrice < offer.originalBudget,
      savingsAmount: Math.max(0, offer.originalBudget - offer.offeredPrice),
      milestones: [
        {
          step: 1,
          title: 'Booking Confirmed & Driver Contract Signed',
          description: `Contract awarded to ${offer.driverName} (${offer.plateNumber}). Pre-trip inspection underway.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
        },
        {
          step: 2,
          title: 'Arrival & Cargo Loading',
          description: `Vehicle arrives at ${load.originAddress}. Goods inspected and bills of lading endorsed.`,
          timestamp: 'Pending Arrival',
          completed: false,
        },
        {
          step: 3,
          title: 'In Transit on Corridor',
          description: `En route along ${load.originCity} to ${load.destinationCity} corridor with live GPS telematics.`,
          timestamp: 'Pending Dispatch',
          completed: false,
        },
        {
          step: 4,
          title: 'Out for Final Delivery',
          description: `Vehicle arrives at ${load.destinationAddress} receiving depot.`,
          timestamp: 'Pending Delivery',
          completed: false,
        },
        {
          step: 5,
          title: 'Delivery Complete & POD Signed',
          description: 'Consignment handed over in full. Digital proof of delivery verified and escrow released.',
          timestamp: 'Pending Completion',
          completed: false,
        },
      ],
      driverNotes: `Trip initiated. Contact driver directly at ${offer.driverPhone}.`,
    });

    // Notify driver
    await Notification.create({
      id: `notif-${Date.now().toString().slice(-5)}`,
      userId: offer.driverId,
      role: 'driver',
      title: 'Congratulations! Your Bid Was Accepted',
      message: `Your offer for ₹${offer.offeredPrice.toLocaleString()} (${load.originCity} ➔ ${load.destinationCity}) was approved by the shipper. Ref: ${bookingRef}.`,
      type: 'success',
      link: '/driver-dashboard',
    });

    res.json({
      success: true,
      message: 'Offer accepted and confirmed booking created',
      data: {
        offer,
        booking: newBooking,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error accepting offer' });
  }
}

export async function rejectOffer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const offer = await DriverOffer.findOne({ id });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    offer.status = 'rejected';
    await offer.save();

    res.json({ success: true, message: 'Offer rejected', data: offer });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

