import mongoose, { Document, Schema } from 'mongoose';
import { TruckType } from './Truck';

export type CargoCategory = 
  | 'General Merchandise'
  | 'FMCG / Packaged Goods'
  | 'Agricultural Produce'
  | 'Industrial Equipment'
  | 'Construction Materials'
  | 'Electronics & Appliances'
  | 'Temperature Controlled / Cold Chain'
  | 'Heavy Machinery'
  | 'Automotive Parts';

export type LoadStatus = 'open' | 'bids_received' | 'booked' | 'in_transit' | 'completed' | 'cancelled';

export interface ILoadRequest extends Document {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  originCity: string;
  originAddress: string;
  destinationCity: string;
  destinationAddress: string;
  pickupDate: string;
  cargoCategory: CargoCategory;
  goodsDescription: string;
  weightKg: number;
  volumeM3: number;
  requiredTruckType: TruckType | 'Any Suitable';
  budgetMax: number;
  specialRequirements: string[];
  status: LoadStatus;
  offersCount: number;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LoadRequestSchema = new Schema<ILoadRequest>(
  {
    id: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    originCity: { type: String, required: true, index: true },
    originAddress: { type: String, required: true },
    destinationCity: { type: String, required: true, index: true },
    destinationAddress: { type: String, required: true },
    pickupDate: { type: String, required: true },
    cargoCategory: { type: String, required: true },
    goodsDescription: { type: String, required: true },
    weightKg: { type: Number, required: true },
    volumeM3: { type: Number, required: true },
    requiredTruckType: { type: String, required: true },
    budgetMax: { type: Number, required: true },
    specialRequirements: [{ type: String }],
    status: { 
      type: String, 
      enum: ['open', 'bids_received', 'booked', 'in_transit', 'completed', 'cancelled'], 
      default: 'open',
      index: true 
    },
    offersCount: { type: Number, default: 0 },
    isUrgent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const LoadRequest = mongoose.models.LoadRequest || mongoose.model<ILoadRequest>('LoadRequest', LoadRequestSchema);

