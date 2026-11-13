import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'info' | 'success' | 'warning' | 'alert';

export interface INotification extends Document {
  id: string;
  userId: string;
  role: 'customer' | 'driver' | 'admin' | 'all';
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, default: 'all' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'alert'], default: 'info' },
    read: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

