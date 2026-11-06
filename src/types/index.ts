export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  companyName?: string;
  isVerified?: boolean;
  city?: string;
}

export type TruckType = 
  | 'Mini Truck / Pickup'
  | 'Medium Box Truck'
  | 'Heavy Semi-Trailer'
  | 'Flatbed Truck'
  | 'Refrigerated (Reefer)'
  | 'Container Carrier';

export interface Truck {
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
    discountPercent: number; // e.g. 35% off on empty return
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
}

export type CargoCategory = 
  | 'General Merchandise'
  | 'FMCG / Packaged Goods'
  | 'Heavy Machinery'
  | 'Furniture & Household'
  | 'Building Materials'
  | 'Agricultural Produce'
  | 'Electronics & Appliances'
  | 'Temperature Controlled / Cold Chain'
  | 'Automotive Parts';

export interface LoadRequest {
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
  volumeM3?: number;
  requiredTruckType: TruckType | 'Any Suitable';
  budgetMax: number;
  specialRequirements: string[];
  status: 'open' | 'bids_received' | 'booked' | 'in_transit' | 'delivered' | 'completed';
  offersCount: number;
  createdAt: string;
  isUrgent?: boolean;
}

export interface DriverOffer {
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
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TrackingMilestone {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Booking {
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
  cargoCategory: string;
  weightKg: number;
  finalPrice: number;
  status: 'confirmed' | 'loading' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'completed';
  pickupDate: string;
  estimatedDeliveryDate: string;
  currentLocationName?: string;
  distanceKm: number;
  createdAt: string;
  isReturnTripDeal: boolean;
  savingsAmount?: number;
  milestones: TrackingMilestone[];
  driverNotes?: string;
  ratingGiven?: number;
  reviewComment?: string;
}

export interface PlatformStats {
  activeTrucks: number;
  completedTrips: number;
  emptyMilesSavedKm: number;
  co2SavedTons: number;
  avgShipperSavingsPercent: number;
  totalShippers: number;
  totalDrivers: number;
  onTimeRatePercent: number;
}

