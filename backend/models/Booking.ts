import mongoose, { Document, Schema } from 'mongoose';
import { TruckType } from './Truck';
import { CargoCategory } from './LoadRequest';

export type BookingStatus = 
  | 'confirmed'
  | 'driver_assigned'
  | 'at_pickup'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface ITrackingMilestone {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface IBooking extends Document {
  id: string;
  bookingRef: string;
  loadRequestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  truckId: string;
  truckName: string;
  truckType: TruckType;
  plateNumber: string;
  originCity: string;
  originAddress: string;
  destinationCity: string;
  destinationAddress: string;
  cargoCategory: CargoCategory;
  weightKg: number;
  finalPrice: number;
  status: BookingStatus;
  pickupDate: string;
  estimatedDeliveryDate: string;
  currentLocationName?: string;
  distanceKm?: number;
  isReturnTripDeal?: boolean;
  savingsAmount?: number;
  milestones: ITrackingMilestone[];
  driverNotes?: string;
  ratingGiven?: number;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<ITrackingMilestone>(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: String, required: true },
    completed: { type: Boolean, default: false },
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingRef: { type: String, required: true, unique: true, index: true },
    loadRequestId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    driverId: { type: String, required: true, index: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    driverAvatar: { type: String, default: '' },
    truckId: { type: String, required: true },
    truckName: { type: String, required: true },
    truckType: { type: String, required: true },
    plateNumber: { type: String, required: true },
    originCity: { type: String, required: true, index: true },
    originAddress: { type: String, required: true },
    destinationCity: { type: String, required: true, index: true },
    destinationAddress: { type: String, required: true },
    cargoCategory: { type: String, required: true },
    weightKg: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: [
        'confirmed',
        'driver_assigned',
        'at_pickup',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'completed',
        'cancelled'
      ],
      default: 'confirmed',
      index: true 
    },
    pickupDate: { type: String, required: true },
    estimatedDeliveryDate: { type: String, required: true },
    currentLocationName: { type: String, default: '' },
    distanceKm: { type: Number, default: 350 },
    isReturnTripDeal: { type: Boolean, default: false },
    savingsAmount: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
    driverNotes: { type: String, default: '' },
    ratingGiven: { type: Number },
    reviewComment: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

