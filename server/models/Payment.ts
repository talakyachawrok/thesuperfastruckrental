import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus = 'pending' | 'held_in_escrow' | 'released' | 'refunded' | 'failed';

export interface IPayment extends Document {
  id: string;
  bookingId: string;
  customerId: string;
  driverId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionRef: string;
  escrowStatus: string;
  releasedAt?: Date;
  refundedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    driverId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'held_in_escrow', 'released', 'refunded', 'failed'],
      default: 'held_in_escrow',
      index: true,
    },
    paymentMethod: { type: String, default: 'SuperFast Escrow' },
    transactionRef: { type: String, required: true, unique: true },
    escrowStatus: { type: String, default: 'Held securely until digital POD confirmation' },
    releasedAt: { type: Date },
    refundedAt: { type: Date },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

