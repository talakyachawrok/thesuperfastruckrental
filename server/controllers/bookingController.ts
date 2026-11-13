import { Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Truck } from '../models/Truck';
import { Notification } from '../models/Notification';

export async function getAllBookings(req: Request, res: Response) {
  try {
    const { customerId, driverId, status } = req.query;
    const query: any = {};

    if (customerId) query.customerId = customerId;
    if (driverId) query.driverId = driverId;
    if (status) query.status = status;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching bookings' });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createDirectBooking(req: Request, res: Response) {
  try {
    const { truckId, bookingDetails } = req.body;

    const truck = await Truck.findOne({ id: truckId });
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }

    const baseDistance = 380;
    const standardPrice = Math.round(truck.fixedBasePrice + baseDistance * truck.ratePerKm);
    const discountMultiplier = truck.returnTripMatch?.isReturningEmpty
      ? 1 - truck.returnTripMatch.discountPercent / 100
      : 1;
    const finalPrice = Math.round(standardPrice * discountMultiplier);
    const savingsAmount = truck.returnTripMatch?.isReturningEmpty
      ? Math.round(baseDistance * truck.ratePerKm * (truck.returnTripMatch.discountPercent / 100))
      : 0;

    const bookingId = `bk-${Date.now().toString().slice(-4)}`;
    const bookingRef = `SF-${Math.floor(1000 + Math.random() * 9000)}-AS`;

    const newBooking = await Booking.create({
      id: bookingId,
      bookingRef,
      loadRequestId: `load-direct-${Date.now().toString().slice(-4)}`,
      customerId: bookingDetails.customerId || 'usr-cust-1',
      customerName: bookingDetails.customerName || 'Priyanka Barua (Brahmaputra Tea & Trading Co.)',
      customerPhone: bookingDetails.customerPhone || '+91 94351 88990',
      driverId: truck.driverId,
      driverName: truck.driverName,
      driverPhone: truck.driverPhone,
      driverAvatar: truck.driverAvatar,
      truckId: truck.id,
      truckName: truck.name,
      truckType: truck.type,
      plateNumber: truck.plateNumber,
      originCity: bookingDetails.originCity,
      originAddress: bookingDetails.originAddress,
      destinationCity: bookingDetails.destinationCity,
      destinationAddress: bookingDetails.destinationAddress,
      cargoCategory: bookingDetails.cargoCategory,
      weightKg: bookingDetails.weightKg,
      finalPrice,
      status: 'confirmed',
      pickupDate: bookingDetails.pickupDate,
      estimatedDeliveryDate: bookingDetails.estimatedDeliveryDate,
      currentLocationName: `Dispatched from ${bookingDetails.originCity}`,
      distanceKm: baseDistance,
      isReturnTripDeal: Boolean(truck.returnTripMatch?.isReturningEmpty),
      savingsAmount,
      milestones: [
        {
          step: 1,
          title: 'Direct Reservation Confirmed',
          description: `Instant booking confirmed with ${truck.driverName} (${truck.plateNumber}). Rate locked: ₹${finalPrice.toLocaleString()}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
        },
        {
          step: 2,
          title: 'Dispatch & Arrival at Pickup',
          description: `Vehicle en route to ${bookingDetails.originAddress}.`,
          timestamp: 'Scheduled for Pickup Date',
          completed: false,
        },
        {
          step: 3,
          title: 'In Transit along Corridor',
          description: `Dispatched along ${bookingDetails.originCity} to ${bookingDetails.destinationCity} corridor with live telematic tracking.`,
          timestamp: 'Pending Departure',
          completed: false,
        },
        {
          step: 4,
          title: 'Out for Final Delivery',
          description: `Vehicle arrives at ${bookingDetails.destinationAddress}.`,
          timestamp: 'Pending Delivery',
          completed: false,
        },
        {
          step: 5,
          title: 'Delivery Complete & Escrow Released',
          description: 'Recipient verified cargo and signed digital proof of delivery.',
          timestamp: 'Pending Completion',
          completed: false,
        },
      ],
      driverNotes: bookingDetails.notes || 'Direct marketplace reservation.',
    });

    // Notify driver
    await Notification.create({
      id: `notif-${Date.now().toString().slice(-5)}`,
      userId: truck.driverId,
      role: 'driver',
      title: 'New Instant Booking Reserved',
      message: `${newBooking.customerName} booked your truck for ${newBooking.originCity} ➔ ${newBooking.destinationCity}. Ref: ${bookingRef}.`,
      type: 'success',
      link: '/driver-dashboard',
    });

    res.status(201).json({
      success: true,
      message: 'Direct truck reservation confirmed successfully',
      data: newBooking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating booking' });
  }
}

export async function updateBookingMilestone(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nextMilestoneStep } = req.body;

    const booking = await Booking.findOne({ id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updatedMilestones = booking.milestones.map((m) => {
      if (m.step <= nextMilestoneStep) {
        return {
          ...m.toObject(),
          completed: true,
          current: m.step === nextMilestoneStep,
          timestamp: m.completed
            ? m.timestamp
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return {
        ...m.toObject(),
        completed: false,
        current: false,
      };
    });

    let newStatus: BookingStatus = booking.status;
    let currentLocationName = booking.currentLocationName;

    if (nextMilestoneStep === 2) {
      newStatus = 'at_pickup';
      currentLocationName = `At pickup location: ${booking.originAddress}`;
    } else if (nextMilestoneStep === 3) {
      newStatus = 'in_transit';
      currentLocationName = `En route along ${booking.originCity} to ${booking.destinationCity} highway`;
    } else if (nextMilestoneStep === 4) {
      newStatus = 'out_for_delivery';
      currentLocationName = `Approaching destination: ${booking.destinationAddress}`;
    } else if (nextMilestoneStep === 5) {
      newStatus = 'completed';
      currentLocationName = `Delivered at ${booking.destinationCity}`;
    }

    booking.milestones = updatedMilestones as any;
    booking.status = newStatus;
    booking.currentLocationName = currentLocationName;
    await booking.save();

    res.json({
      success: true,
      message: `Trip milestone advanced to Step ${nextMilestoneStep}`,
      data: booking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating milestone' });
  }
}

