import mongoose, { Document, Schema } from 'mongoose';
import { TruckType } from './Truck';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface IDriverOffer extends Document {
  id: string;
  loadRequestId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  driverRating: number;
  truckId: string;
  truckName: string;
  truckType: TruckType;
  plateNumber: string;
  offeredPrice: number;
  originalBudget: number;
  message: string;
  estimatedHours: number;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DriverOfferSchema = new Schema<IDriverOffer>(
  {
    id: { type: String, required: true, unique: true, index: true },
    loadRequestId: { type: String, required: true, index: true },
    driverId: { type: String, required: true, index: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    driverAvatar: { type: String, default: '' },
    driverRating: { type: Number, default: 4.9 },
    truckId: { type: String, required: true },
    truckName: { type: String, required: true },
    truckType: { type: String, required: true },
    plateNumber: { type: String, required: true },
    offeredPrice: { type: Number, required: true },
    originalBudget: { type: Number, required: true },
    message: { type: String, default: '' },
    estimatedHours: { type: Number, default: 8 },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'], 
      default: 'pending',
      index: true 
    },
  },
  {
    timestamps: true,
  }
);

export const DriverOffer = mongoose.models.DriverOffer || mongoose.model<IDriverOffer>('DriverOffer', DriverOfferSchema);

