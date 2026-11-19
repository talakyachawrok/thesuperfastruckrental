import mongoose, { Document, Schema } from 'mongoose';

export type TruckType = 
  | 'Heavy Semi-Trailer'
  | 'Medium Box Truck'
  | 'Flatbed Truck'
  | 'Refrigerated (Reefer)'
  | 'Mini Truck / Pickup'
  | 'Container Carrier';

export interface ITruck extends Document {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  type: TruckType;
  capacityKg: number;
  capacityTons: number;
  volumeM3: number;
  lengthFt: number;
  ratePerKm: number;
  fixedBasePrice: number;
  currentLocation: string;
  availableDate: string;
  destinationsCovered: string[];
  isAvailable: boolean;
  returnTripMatch?: {
    isReturningEmpty: boolean;
    origin: string;
    destination: string;
    discountPercent: number;
    returnDate: string;
  };
  features: string[];
  image: string;
  rating: number;
  reviewsCount: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  driverRating: number;
  driverTripsCount: number;
  driverVerified: boolean;
  instantBooking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TruckSchema = new Schema<ITruck>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true, index: true },
    type: { 
      type: String, 
      enum: [
        'Heavy Semi-Trailer',
        'Medium Box Truck',
        'Flatbed Truck',
        'Refrigerated (Reefer)',
        'Mini Truck / Pickup',
        'Container Carrier'
      ],
      required: true,
      index: true
    },
    capacityKg: { type: Number, required: true },
    capacityTons: { type: Number, required: true },
    volumeM3: { type: Number, required: true },
    lengthFt: { type: Number, required: true },
    ratePerKm: { type: Number, required: true },
    fixedBasePrice: { type: Number, required: true },
    currentLocation: { type: String, required: true, index: true },
    availableDate: { type: String, required: true },
    destinationsCovered: [{ type: String }],
    isAvailable: { type: Boolean, default: true, index: true },
    returnTripMatch: {
      isReturningEmpty: { type: Boolean, default: false },
      origin: { type: String },
      destination: { type: String },
      discountPercent: { type: Number, default: 0 },
      returnDate: { type: String },
    },
    features: [{ type: String }],
    image: { type: String, required: true },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
    driverId: { type: String, required: true, index: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    driverAvatar: { type: String, default: '' },
    driverRating: { type: Number, default: 4.9 },
    driverTripsCount: { type: Number, default: 0 },
    driverVerified: { type: Boolean, default: true },
    instantBooking: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Truck = mongoose.models.Truck || mongoose.model<ITruck>('Truck', TruckSchema);

