import React, { createContext, useContext, useState, useEffect } from 'react';
import { Truck, LoadRequest, DriverOffer, Booking, PlatformStats } from '../types';
import { 
  INITIAL_TRUCKS, 
  INITIAL_LOAD_REQUESTS, 
  INITIAL_OFFERS, 
  INITIAL_BOOKINGS, 
  INITIAL_STATS 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface DataContextType {
  trucks: Truck[];
  loads: LoadRequest[];
  offers: DriverOffer[];
  bookings: Booking[];
  stats: PlatformStats;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  createLoadRequest: (loadData: Omit<LoadRequest, 'id' | 'createdAt' | 'status' | 'offersCount'>) => LoadRequest;
  submitDriverOffer: (offerData: Omit<DriverOffer, 'id' | 'createdAt' | 'status'>) => void;
  acceptOffer: (offerId: string) => Booking | null;
  bookTruckDirectly: (truckId: string, bookingDetails: {
    originCity: string;
    originAddress: string;
    destinationCity: string;
    destinationAddress: string;
    cargoCategory: string;
    weightKg: number;
    pickupDate: string;
    estimatedDeliveryDate: string;
    customerNotes?: string;
  }) => Booking | null;
  updateBookingMilestone: (bookingId: string, nextMilestoneStep: number) => void;
  toggleTruckAvailability: (truckId: string) => void;
  addNewTruck: (truck: Omit<Truck, 'id' | 'rating' | 'reviewsCount'>) => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trucks, setTrucks] = useState<Truck[]>(() => {
    const saved = localStorage.getItem('superfast_trucks');
    return saved ? JSON.parse(saved) : INITIAL_TRUCKS;
  });

  const [loads, setLoads] = useState<LoadRequest[]>(() => {
    const saved = localStorage.getItem('superfast_loads');
    return saved ? JSON.parse(saved) : INITIAL_LOAD_REQUESTS;
  });

  const [offers, setOffers] = useState<DriverOffer[]>(() => {
    const saved = localStorage.getItem('superfast_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('superfast_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [stats, setStats] = useState<PlatformStats>(() => {
    const saved = localStorage.getItem('superfast_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('superfast_trucks', JSON.stringify(trucks));
  }, [trucks]);

  useEffect(() => {
    localStorage.setItem('superfast_loads', JSON.stringify(loads));
  }, [loads]);

  useEffect(() => {
    localStorage.setItem('superfast_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('superfast_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('superfast_stats', JSON.stringify(stats));
  }, [stats]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { ...toast, id }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF6500', '#1E3E62', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  const createLoadRequest = (loadData: Omit<LoadRequest, 'id' | 'createdAt' | 'status' | 'offersCount'>): LoadRequest => {
    const newLoad: LoadRequest = {
      ...loadData,
      id: `load-${Date.now().toString().slice(-4)}`,
      status: 'open',
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };

    setLoads(prev => [newLoad, ...prev]);
    setStats(prev => ({ ...prev, activeTrucks: prev.activeTrucks }));

    addToast({
      type: 'success',
      title: 'Load Posted Successfully!',
      message: `Your cargo from ${newLoad.originCity} to ${newLoad.destinationCity} is now broadcasted to verified truckers.`,
    });
    triggerConfetti();

    return newLoad;
  };

  const submitDriverOffer = (offerData: Omit<DriverOffer, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: DriverOffer = {
      ...offerData,
      id: `off-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOffers(prev => [newOffer, ...prev]);

    // Update load request offer count and status
    setLoads(prev => prev.map(l => {
      if (l.id === offerData.loadRequestId) {
        return {
          ...l,
          offersCount: l.offersCount + 1,
          status: 'bids_received'
        };
      }
      return l;
    }));

    addToast({
      type: 'success',
      title: 'Offer Submitted to Shipper!',
      message: `Your quote of $${offerData.offeredPrice.toLocaleString()} has been sent to ${offerData.driverName}.`,
    });
  };

  const acceptOffer = (offerId: string): Booking | null => {
    const targetOffer = offers.find(o => o.id === offerId);
    if (!targetOffer) return null;

    const targetLoad = loads.find(l => l.id === targetOffer.loadRequestId);
    if (!targetLoad) return null;

    // Mark offer as accepted
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'accepted' } : o));

    // Mark load as booked
    setLoads(prev => prev.map(l => l.id === targetLoad.id ? { ...l, status: 'booked' } : l));

    // Calculate simulated savings if under budget
    const savings = Math.max(0, targetLoad.budgetMax - targetOffer.offeredPrice);

    // Create Booking
    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      bookingRef: `SF-${Math.floor(1000 + Math.random() * 9000)}-${targetLoad.destinationCity.slice(0, 2).toUpperCase()}`,
      loadRequestId: targetLoad.id,
      customerId: targetLoad.customerId,
      customerName: targetLoad.customerName,
      customerPhone: targetLoad.customerPhone,
      driverId: targetOffer.driverId,
      driverName: targetOffer.driverName,
      driverPhone: targetOffer.driverPhone,
      driverAvatar: targetOffer.driverAvatar,
      truckId: targetOffer.truckId,
      truckName: targetOffer.truckName,
      truckType: targetOffer.truckType,
      plateNumber: targetOffer.plateNumber,
      originCity: targetLoad.originCity,
      originAddress: targetLoad.originAddress,
      destinationCity: targetLoad.destinationCity,
      destinationAddress: targetLoad.destinationAddress,
      cargoCategory: targetLoad.cargoCategory,
      weightKg: targetLoad.weightKg,
      finalPrice: targetOffer.offeredPrice,
      status: 'confirmed',
      pickupDate: targetLoad.pickupDate,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      currentLocationName: `Dispatched from ${targetLoad.originCity}`,
      distanceKm: Math.floor(250 + Math.random() * 600),
      createdAt: new Date().toISOString(),
      isReturnTripDeal: targetOffer.offeredPrice < targetLoad.budgetMax,
      savingsAmount: savings,
      milestones: [
        {
          step: 1,
          title: 'Offer Accepted & Booking Confirmed',
          description: `Contract locked at $${targetOffer.offeredPrice.toLocaleString()}. Escrow held safely.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          step: 2,
          title: 'Vehicle Dispatched & Loading',
          description: `Driver ${targetOffer.driverName} scheduled for pickup on ${targetLoad.pickupDate}.`,
          timestamp: 'Scheduled',
          completed: false,
        },
        {
          step: 3,
          title: 'In Transit along Route',
          description: 'Live GPS monitoring and corridor status updates.',
          timestamp: 'Upcoming',
          completed: false,
        },
        {
          step: 4,
          title: 'Out for Final Delivery',
          description: `Arrival at ${targetLoad.destinationCity}.`,
          timestamp: 'Upcoming',
          completed: false,
        },
        {
          step: 5,
          title: 'Cargo Delivered & POD Signed',
          description: 'Inspection complete, recipient signed proof of delivery.',
          timestamp: 'Pending Delivery',
          completed: false,
        }
      ],
      driverNotes: targetOffer.message,
    };

    setBookings(prev => [newBooking, ...prev]);
    setStats(prev => ({
      ...prev,
      completedTrips: prev.completedTrips + 1,
      emptyMilesSavedKm: prev.emptyMilesSavedKm + 380,
      co2SavedTons: prev.co2SavedTons + 1.2,
    }));

    addToast({
      type: 'success',
      title: 'Booking Confirmed!',
      message: `You accepted ${targetOffer.driverName}'s offer for $${targetOffer.offeredPrice.toLocaleString()}. Trip ID: ${newBooking.bookingRef}`,
    });
    triggerConfetti();

    return newBooking;
  };

  const bookTruckDirectly = (truckId: string, details: {
    originCity: string;
    originAddress: string;
    destinationCity: string;
    destinationAddress: string;
    cargoCategory: string;
    weightKg: number;
    pickupDate: string;
    estimatedDeliveryDate: string;
    customerNotes?: string;
  }): Booking | null => {
    const truck = trucks.find(t => t.id === truckId);
    if (!truck) return null;

    const baseDistance = 380;
    const finalPrice = Math.round(truck.fixedBasePrice + baseDistance * truck.ratePerKm * (truck.returnTripMatch?.isReturningEmpty ? (1 - truck.returnTripMatch.discountPercent / 100) : 1));
    const savings = truck.returnTripMatch?.isReturningEmpty 
      ? Math.round(baseDistance * truck.ratePerKm * (truck.returnTripMatch.discountPercent / 100))
      : 0;

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      bookingRef: `SF-${Math.floor(1000 + Math.random() * 9000)}-${details.destinationCity.slice(0, 2).toUpperCase()}`,
      loadRequestId: `load-direct-${Date.now().toString().slice(-4)}`,
      customerId: 'usr-cust-1',
      customerName: 'Sarah Jenkins (Apex Distribution)',
      customerPhone: '+1 (555) 765-4321',
      driverId: truck.driverId,
      driverName: truck.driverName,
      driverPhone: truck.driverPhone,
      driverAvatar: truck.driverAvatar,
      truckId: truck.id,
      truckName: truck.name,
      truckType: truck.type,
      plateNumber: truck.plateNumber,
      originCity: details.originCity,
      originAddress: details.originAddress,
      destinationCity: details.destinationCity,
      destinationAddress: details.destinationAddress,
      cargoCategory: details.cargoCategory,
      weightKg: details.weightKg,
      finalPrice,
      status: 'confirmed',
      pickupDate: details.pickupDate,
      estimatedDeliveryDate: details.estimatedDeliveryDate,
      currentLocationName: `Dispatched from ${truck.currentLocation}`,
      distanceKm: baseDistance,
      createdAt: new Date().toISOString(),
      isReturnTripDeal: !!truck.returnTripMatch?.isReturningEmpty,
      savingsAmount: savings,
      milestones: [
        {
          step: 1,
          title: 'Direct Reservation Confirmed',
          description: `Secured with ${truck.driverName}. Vehicle reserved exclusively.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          step: 2,
          title: 'Pre-trip Inspection & Dispatch',
          description: `Vehicle en route to pickup address in ${details.originCity}.`,
          timestamp: 'Scheduled',
          completed: false,
        },
        {
          step: 3,
          title: 'In Transit',
          description: 'Safe transport with live telematic speed and route telemetry.',
          timestamp: 'Upcoming',
          completed: false,
        },
        {
          step: 4,
          title: 'Out for Delivery',
          description: `Arrival expected in ${details.destinationCity}.`,
          timestamp: 'Upcoming',
          completed: false,
        },
        {
          step: 5,
          title: 'Delivered & Completed',
          description: 'POD verified by recipient.',
          timestamp: 'Pending Delivery',
          completed: false,
        }
      ],
      driverNotes: details.customerNotes || 'Direct customer booking verified.',
    };

    setBookings(prev => [newBooking, ...prev]);

    addToast({
      type: 'success',
      title: 'Truck Booked Directly!',
      message: `Your booking with ${truck.driverName} (${truck.name}) has been confirmed!`,
    });
    triggerConfetti();

    return newBooking;
  };

  const updateBookingMilestone = (bookingId: string, nextMilestoneStep: number) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id !== bookingId) return booking;

      const updatedMilestones = booking.milestones.map(m => {
        if (m.step < nextMilestoneStep) {
          return { ...m, completed: true, current: false };
        }
        if (m.step === nextMilestoneStep) {
          return { 
            ...m, 
            completed: true, 
            current: true, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          };
        }
        return { ...m, completed: false, current: false };
      });

      let newStatus: Booking['status'] = booking.status;
      if (nextMilestoneStep === 2) newStatus = 'loading';
      if (nextMilestoneStep === 3) newStatus = 'in_transit';
      if (nextMilestoneStep === 4) newStatus = 'out_for_delivery';
      if (nextMilestoneStep >= 5) newStatus = 'delivered';

      return {
        ...booking,
        status: newStatus,
        milestones: updatedMilestones,
        currentLocationName: nextMilestoneStep >= 5 ? `Delivered at ${booking.destinationCity}` : `In Transit towards ${booking.destinationCity}`
      };
    }));

    addToast({
      type: 'info',
      title: 'Trip Milestone Updated',
      message: `Booking progress successfully moved to step ${nextMilestoneStep}.`,
    });
  };

  const toggleTruckAvailability = (truckId: string) => {
    setTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        const nextAvail = !t.isAvailable;
        addToast({
          type: 'info',
          title: 'Availability Updated',
          message: `${t.name} is now ${nextAvail ? 'AVAILABLE for bookings' : 'PAUSED / OFF DUTY'}.`,
        });
        return { ...t, isAvailable: nextAvail };
      }
      return t;
    }));
  };

  const addNewTruck = (truckData: Omit<Truck, 'id' | 'rating' | 'reviewsCount'>) => {
    const newTruck: Truck = {
      ...truckData,
      id: `trk-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 1,
    };

    setTrucks(prev => [newTruck, ...prev]);
    setStats(prev => ({ ...prev, activeTrucks: prev.activeTrucks + 1 }));

    addToast({
      type: 'success',
      title: 'Truck Registered!',
      message: `${newTruck.name} (${newTruck.plateNumber}) is now listed in the SuperFast fleet.`,
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('superfast_trucks');
    localStorage.removeItem('superfast_loads');
    localStorage.removeItem('superfast_offers');
    localStorage.removeItem('superfast_bookings');
    localStorage.removeItem('superfast_stats');

    setTrucks(INITIAL_TRUCKS);
    setLoads(INITIAL_LOAD_REQUESTS);
    setOffers(INITIAL_OFFERS);
    setBookings(INITIAL_BOOKINGS);
    setStats(INITIAL_STATS);

    addToast({
      type: 'info',
      title: 'Demo Data Restored',
      message: 'All vehicles, quotes, and sample shipments have been refreshed to pristine factory state.',
    });
  };

  return (
    <DataContext.Provider
      value={{
        trucks,
        loads,
        offers,
        bookings,
        stats,
        toasts,
        addToast,
        removeToast,
        createLoadRequest,
        submitDriverOffer,
        acceptOffer,
        bookTruckDirectly,
        updateBookingMilestone,
        toggleTruckAvailability,
        addNewTruck,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

