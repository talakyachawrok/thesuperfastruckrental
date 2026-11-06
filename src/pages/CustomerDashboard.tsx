import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { LoadRequest, Booking } from '../types';
import { TrackingMilestoneModal } from '../components/bookings/TrackingMilestoneModal';
import { OffersComparisonModal } from '../components/loads/OffersComparisonModal';
import { 
  Package, 
  Truck, 
  DollarSign, 
  Sparkles, 
  PlusCircle, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Eye, 
  RotateCcw
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { loads, offers, bookings } = useData();

  const [activeTab, setActiveTab] = useState<'bookings' | 'loads' | 'completed'>('bookings');
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<Booking | null>(null);
  const [selectedLoadForOffers, setSelectedLoadForOffers] = useState<LoadRequest | null>(null);

  // Customer specific items
  const myLoads = loads.filter(l => l.customerId === user?.id || l.customerEmail === user?.email || l.customerName === user?.name);
  // Also fallback to all loads if none matched so demo always shows data
  const displayedLoads = myLoads.length > 0 ? myLoads : loads;

  const activeBookings = bookings.filter(b => b.status !== 'delivered' && b.status !== 'completed');
  const completedBookings = bookings.filter(b => b.status === 'delivered' || b.status === 'completed');

  // Stats calculation
  const totalSpent = bookings.reduce((sum, b) => sum + b.finalPrice, 0);
  const totalSaved = bookings.reduce((sum, b) => sum + (b.savingsAmount || 0), 0);

  // Offers for selected load
  const offersForSelectedLoad = selectedLoadForOffers 
    ? offers.filter(o => o.loadRequestId === selectedLoadForOffers.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
                Shipper Portal
              </span>
              <span className="text-xs text-slate-400">• {user?.companyName || 'Apex Distribution'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Welcome back, {user?.name || 'Sarah'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your freight dispatch, live telematic tracking, and driver quote comparisons.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/trucks"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Trucks</span>
          </Link>
          <Link
            to="/post-load"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Cargo Load</span>
          </Link>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active In-Transit</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {activeBookings.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Posted Cargo Loads</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {displayedLoads.length}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Backhaul Savings</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${totalSaved.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Freight Volume</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              ${totalSpent.toLocaleString()}
            </div>
          </div>
        </div>

      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Active Bookings & Live Tracking</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-500/10 text-brand-500 font-extrabold">
            {activeBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('loads')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'loads'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>My Freight Requests & Quotes</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300 font-extrabold">
            {displayedLoads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Delivery History & PODs</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300 font-extrabold">
            {completedBookings.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT: ACTIVE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {activeBookings.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6">
              <Truck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-white">No active shipments in transit</h3>
              <p className="text-xs text-slate-500 mt-1">Book an available vehicle or accept a bid to track freight in real-time.</p>
              <Link to="/trucks" className="mt-3 inline-block px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white">
                Find Available Trucks
              </Link>
            </div>
          ) : (
            activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-brand-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-brand-500 text-white">
                      {b.bookingRef}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {b.cargoCategory} • {(b.weightKg / 1000).toFixed(1)}T
                    </span>
                    {b.isReturnTripDeal && (
                      <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        Return Deal
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Guaranteed Rate:</span>
                    <span className="text-xl font-black text-brand-600 dark:text-brand-400">
                      ${b.finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Corridor & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* Origin & Dest */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-100 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      <span>{b.originCity} ➔ {b.destinationCity}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Pickup: {b.pickupDate}</p>
                  </div>

                  {/* Driver preview */}
                  <div className="flex items-center gap-3">
                    <img
                      src={b.driverAvatar}
                      alt={b.driverName}
                      className="w-10 h-10 rounded-full object-cover border border-brand-500"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                        <span>{b.driverName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-slate-400">{b.truckName} ({b.plateNumber})</p>
                    </div>
                  </div>

                  {/* Tracking Button */}
                  <div className="flex justify-start md:justify-end">
                    <button
                      onClick={() => setSelectedBookingForTracking(b)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white dark:bg-brand-500 dark:hover:bg-brand-600 flex items-center gap-2 shadow-md transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Live Telematics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Location indicator */}
                {b.currentLocationName && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800 text-[11px] flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span>Last Telematics Ping: <strong className="font-semibold text-slate-900 dark:text-white">{b.currentLocationName}</strong></span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: MY FREIGHT REQUESTS */}
      {activeTab === 'loads' && (
        <div className="space-y-4">
          {displayedLoads.map((load) => {
            const hasOffers = load.offersCount > 0;
            return (
              <div
                key={load.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-brand-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {load.cargoCategory}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      load.status === 'booked'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : load.status === 'bids_received'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {load.status.replace('_', ' ')}
                    </span>
                    {load.isUrgent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500 text-white">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Ceiling Budget:</span>
                    <span className="text-lg font-black text-brand-600 dark:text-brand-400">
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
                    <p className="text-[11px] text-slate-400">Date: {load.pickupDate} • Weight: {(load.weightKg / 1000).toFixed(1)}T</p>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <p className="line-clamp-2">{load.goodsDescription}</p>
                  </div>

                  <div className="flex justify-start md:justify-end">
                    {hasOffers ? (
                      <button
                        onClick={() => setSelectedLoadForOffers(load)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Compare {load.offersCount} Driver Bids</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Waiting for driver backhaul bids...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: COMPLETED SHIPMENTS */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                    {b.bookingRef}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Delivered & Signed POD
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  ${b.finalPrice.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>Route: {b.originCity} ➔ {b.destinationCity}</span>
                <span>Driver: {b.driverName} ({b.truckName})</span>
                {b.reviewComment && (
                  <span className="italic text-slate-500 dark:text-slate-400">"{b.reviewComment}"</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {selectedBookingForTracking && (
        <TrackingMilestoneModal
          booking={selectedBookingForTracking}
          onClose={() => setSelectedBookingForTracking(null)}
        />
      )}

      {selectedLoadForOffers && (
        <OffersComparisonModal
          load={selectedLoadForOffers}
          offers={offersForSelectedLoad}
          onClose={() => setSelectedLoadForOffers(null)}
        />
      )}

    </div>
  );
};
