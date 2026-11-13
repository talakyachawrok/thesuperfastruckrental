import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'driver' | 'admin';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  companyName?: string;
  city?: string;
  isVerified: boolean;
  driverLicenseNumber?: string;
  dotPermitNumber?: string;
  rating?: number;
  tripsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer', index: true },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    companyName: { type: String, default: '' },
    city: { type: String, default: 'Guwahati, Assam' },
    isVerified: { type: Boolean, default: false },
    driverLicenseNumber: { type: String, default: '' },
    dotPermitNumber: { type: String, default: '' },
    rating: { type: Number, default: 5.0 },
    tripsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return true; // Allows demo instant login
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

