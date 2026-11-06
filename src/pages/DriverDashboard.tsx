import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { LoadRequest, Booking, Truck } from '../types';
import { DriverOfferModal } from '../components/loads/DriverOfferModal';
import { TrackingMilestoneModal } from '../components/bookings/TrackingMilestoneModal';
import { 
  Truck as TruckIcon, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Scale, 
  Box, 
  ChevronRight,
  TrendingUp,
  Settings,
  Phone
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { loads, trucks, bookings, toggleTruckAvailability, addNewTruck, updateBookingMilestone } = useData();

  // Find driver's truck or default to first
  const myTruck = trucks.find(t => t.driverId === user?.id) || trucks[0];

  const [activeTab, setActiveTab] = useState<'loads' | 'trips' | 'truck' | 'earnings'>('loads');
  const [selectedLoadForOffer, setSelectedLoadForOffer] = useState<LoadRequest | null>(null);
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<Booking | null>(null);

  // Return route toggle state
  const [isReturningEmpty, setIsReturningEmpty] = useState(myTruck?.returnTripMatch?.isReturningEmpty ?? true);
  const [emptyReturnOrigin, setEmptyReturnOrigin] = useState('Chicago, IL');
  const [emptyReturnDest, setEmptyReturnDest] = useState('Atlanta, GA');

  // Filter loads that are open or bids_received
  const availableLoads = loads.filter(l => l.status === 'open' || l.status === 'bids_received');
  
  // Driver's active bookings
  const myBookings = bookings.filter(b => b.driverId === myTruck.driverId || b.driverName === user?.name || b.truckId === myTruck.id);
  const activeTrips = myBookings.filter(b => b.status !== 'delivered' && b.status !== 'completed');
  const completedTrips = myBookings.filter(b => b.status === 'delivered' || b.status === 'completed');

  // Calculate earnings
  const totalEarnings = myBookings.reduce((sum, b) => sum + b.finalPrice, 0);

  // Modal for new truck registration
  const [showAddTruckModal, setShowAddTruckModal] = useState(false);
  const [newTruckName, setNewTruckName] = useState('Peterbilt 579 Ultra');
  const [newTruckModel, setNewTruckModel] = useState('579 Aero SmartHaul');
  const [newTruckPlate, setNewTruckPlate] = useState('IL-9920-TR');
  const [newTruckType, setNewTruckType] = useState<Truck['type']>('Heavy Semi-Trailer');
  const [newTruckTons, setNewTruckTons] = useState<number>(22);
  const [newTruckRate, setNewTruckRate] = useState<number>(2.50);

  const handleRegisterTruck = (e: React.FormEvent) => {
    e.preventDefault();
    addNewTruck({
      name: newTruckName,
      model: newTruckModel,
      plateNumber: newTruckPlate,
      type: newTruckType,
      capacityKg: newTruckTons * 1000,
      capacityTons: newTruckTons,
      volumeM3: 90,
      lengthFt: 53,
      ratePerKm: newTruckRate,
      fixedBasePrice: 450,
      currentLocation: 'Chicago, IL',
      availableDate: new Date().toISOString().split('T')[0],
      destinationsCovered: ['Atlanta, GA', 'Dallas, TX', 'Detroit, MI'],
      isAvailable: true,
      features: ['Air Suspension', 'GPS Telematics', 'Heavy Duty Straps'],
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
      driverId: user?.id || 'drv-01',
      driverName: user?.name || 'Marcus Vance',
      driverPhone: user?.phone || '+1 (555) 234-8891',
      driverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      driverRating: 4.95,
      driverTripsCount: 312,
      driverVerified: true,
      instantBooking: true,
    });
    setShowAddTruckModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Driver Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || myTruck.driverAvatar}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
                Carrier Partner
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified CDL & FMCSA</span>
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {user?.name || myTruck.driverName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned Vehicle: <strong className="text-slate-800 dark:text-slate-200">{myTruck.name}</strong> ({myTruck.plateNumber}) • {myTruck.capacityTons}T Payload
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => toggleTruckAvailability(myTruck.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              myTruck.isAvailable
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${myTruck.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            <span>{myTruck.isAvailable ? 'Status: Accepting Loads' : 'Status: Off Duty / Paused'}</span>
          </button>

          <button
            onClick={() => setShowAddTruckModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white dark:bg-navy-800 dark:hover:bg-navy-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-brand-400" />
            <span>Add Vehicle</span>
          </button>
        </div>

      </div>

      {/* QUICK RETURN ROUTE BROADCAST CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 text-white border border-navy-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Deadhead Return Trip Optimizer
              </h3>
              <p className="text-xs text-slate-400">
                Travelling back empty? Broadcast your backhaul route to automatically rank at the top of shipper searches.
              </p>
            </div>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-navy-950/80 px-3 py-1.5 rounded-xl border border-navy-700">
            <input
              type="checkbox"
              checked={isReturningEmpty}
              onChange={(e) => setIsReturningEmpty(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded border-navy-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-emerald-400">
              {isReturningEmpty ? 'Empty Return Active' : 'Enable Return Matching'}
            </span>
          </label>
        </div>

        {isReturningEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Departure (Empty Staging)</span>
              <input
                type="text"
                value={emptyReturnOrigin}
                onChange={(e) => setEmptyReturnOrigin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white font-semibold"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Destination Base</span>
              <input
                type="text"
                value={emptyReturnDest}
                onChange={(e) => setEmptyReturnDest(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-navy-950 border border-navy-700 text-white font-semibold"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[11px] font-bold text-emerald-400 block">35% Discount Applied</span>
                <span className="text-[10px] text-slate-400">Guarantees high shipper click-through</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matching Open Loads</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {availableLoads.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <TruckIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Active Trips</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {activeTrips.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Trip Revenue</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deadhead Miles Saved</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {(myTruck.driverTripsCount * 280).toLocaleString()} km
            </div>
          </div>
        </div>

      </div>

      {/* DASHBOARD TABS */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('loads')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'loads'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Available Cargo Loads to Haul</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-500/10 text-brand-500 font-extrabold">
            {availableLoads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'trips'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Active Bookings & Milestone Updates</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300 font-extrabold">
            {activeTrips.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('truck')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'truck'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>My Truck & Fleet Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'earnings'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Earnings & Payouts</span>
        </button>
      </div>

      {/* TAB CONTENT: AVAILABLE MATCHING LOADS */}
      {activeTab === 'loads' && (
        <div className="space-y-4">
          {availableLoads.map((load) => (
            <div
              key={load.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-brand-500/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {load.cargoCategory}
                  </span>
                  <span className="text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Req: {load.requiredTruckType}
                  </span>
                  {load.isUrgent && (
                    <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded">
                      Urgent Load
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Shipper Ceiling Budget:</span>
                  <span className="text-xl font-black text-brand-600 dark:text-brand-400">
                    ${load.budgetMax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span>{load.originCity} ➔ {load.destinationCity}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pickup: {load.pickupDate} • Weight: {(load.weightKg / 1000).toFixed(1)}T
                  </p>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="line-clamp-2">{load.goodsDescription}</p>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button
                    onClick={() => setSelectedLoadForOffer(load)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Submit Competitive Bid</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: ACTIVE ASSIGNED TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          {activeTrips.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6">
              <TruckIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-white">No current trips assigned</h3>
              <p className="text-xs text-slate-500 mt-1">Submit bids on available shipper loads above to secure trips.</p>
            </div>
          ) : (
            activeTrips.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-brand-500 text-white">
                      TRIP: {b.bookingRef}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Shipper: {b.customerName}
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    Payout: ${b.finalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      <span>{b.originCity} ➔ {b.destinationCity}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Current Status: <strong className="uppercase text-blue-500">{b.status}</strong></p>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span>Shipper Phone: {b.customerPhone}</span>
                  </div>

                  <div className="flex justify-start md:justify-end gap-2">
                    <button
                      onClick={() => setSelectedBookingForTracking(b)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white dark:bg-brand-500 dark:hover:bg-brand-600 flex items-center gap-1.5 transition-all"
                    >
                      <span>Update Trip Milestones</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: VEHICLE & FLEET SPECS */}
      {activeTab === 'truck' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Primary Registered Hauler</h3>
              <p className="text-xs text-slate-500">Commercial equipment and telematics configuration</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
              Active Fleet Vehicle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 rounded-2xl overflow-hidden bg-slate-900">
              <img src={myTruck.image} alt={myTruck.name} className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{myTruck.name}</h4>
              <p className="text-xs text-slate-500">Chassis: {myTruck.model} • License Plate: {myTruck.plateNumber}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 block font-bold">MAX PAYLOAD</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{myTruck.capacityTons} Tons</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 block font-bold">VOLUME</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{myTruck.volumeM3} m³</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 block font-bold">RATE</span>
                  <span className="text-sm font-bold text-brand-500">${myTruck.ratePerKm}/km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Gross Platform Revenue</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${totalEarnings.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">100% Guaranteed payout via Escrow</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Completed Deliveries</span>
              <div className="text-3xl font-black text-blue-500 mt-1">
                {completedTrips.length + 14} Trips
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Average rating: 4.95 ★</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Next Scheduled Payout</span>
              <div className="text-3xl font-black text-emerald-500 mt-1">
                $1,850.00
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Direct deposit on Monday</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR NEW TRUCK REGISTRATION */}
      {showAddTruckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Register Fleet Vehicle</h3>
            <form onSubmit={handleRegisterTruck} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Truck Model Name</label>
                <input
                  type="text"
                  value={newTruckName}
                  onChange={(e) => setNewTruckName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={newTruckPlate}
                    onChange={(e) => setNewTruckPlate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Capacity (Tons)</label>
                  <input
                    type="number"
                    value={newTruckTons}
                    onChange={(e) => setNewTruckTons(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rate per KM ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={newTruckRate}
                  onChange={(e) => setNewTruckRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTruckModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRIVER OFFER MODAL */}
      {selectedLoadForOffer && (
        <DriverOfferModal
          load={selectedLoadForOffer}
          onClose={() => setSelectedLoadForOffer(null)}
        />
      )}

      {/* TRACKING MILESTONES MODAL */}
      {selectedBookingForTracking && (
        <TrackingMilestoneModal
          booking={selectedBookingForTracking}
          onClose={() => setSelectedBookingForTracking(null)}
        />
      )}

    </div>
  );
};
