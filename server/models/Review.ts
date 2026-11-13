import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  id: string;
  bookingId: string;
  truckId: string;
  driverId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, index: true },
    truckId: { type: String, required: true, index: true },
    driverId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

