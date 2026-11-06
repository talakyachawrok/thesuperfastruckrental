import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { TrackingMilestoneModal } from '../components/bookings/TrackingMilestoneModal';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Search,
  Eye,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { trucks, loads, bookings, stats, resetAllData, addToast } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'bookings' | 'trucks'>('overview');
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Driver verification dummy queue
  const [pendingDrivers, setPendingDrivers] = useState([
    {
      id: 'p-drv-1',
      name: 'Travis Sterling',
      email: 'travis.sterling@logistics.com',
      vehicle: 'Kenworth T680 (2024)',
      dotNumber: 'USDOT-3991204',
      status: 'pending',
    },
    {
      id: 'p-drv-2',
      name: 'Monique Laurent',
      email: 'monique@laurentfreight.com',
      vehicle: 'Volvo VNL 760 Reefer',
      dotNumber: 'USDOT-4102948',
      status: 'pending',
    }
  ]);

  const handleApproveDriver = (id: string, name: string) => {
    setPendingDrivers(prev => prev.filter(d => d.id !== id));
    addToast({
      type: 'success',
      title: 'Carrier Approved & Verified',
      message: `${name} has been vetted and granted CDL verified status on the marketplace.`,
    });
  };

  const totalGMV = bookings.reduce((sum, b) => sum + b.finalPrice, 0) + 48200;
  const platformRevenue = Math.round(totalGMV * 0.08); // 8% marketplace take rate

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-950 text-brand-500 flex items-center justify-center font-black text-xl border-2 border-brand-500 shadow-md">
            ADM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                SuperAdmin Console
              </span>
              <span className="text-xs text-slate-400">• SuperFast HQ Dispatch Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Marketplace Command Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time oversight of carriers, shipper freight posts, dispute-free escrow, and return backhaul metrics.
            </p>
          </div>
        </div>

        <button
          onClick={resetAllData}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-500" />
          <span>Reset Platform Mock Data</span>
        </button>
      </div>

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${totalGMV.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">+18.4% month-over-month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketplace Platform Fee (8%)</span>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
            ${platformRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automated escrow distribution</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Drivers Active</span>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {stats.totalDrivers.toLocaleString()} Fleets
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{pendingDrivers.length} Pending verification</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Empty Miles Saved</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {stats.emptyMilesSavedKm.toLocaleString()} km
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold mt-1">{stats.co2SavedTons} Tons CO2 prevented</p>
        </div>

      </div>

      {/* ADMIN TABS */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Platform Oversight
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'drivers'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Carrier Compliance Queue</span>
          {pendingDrivers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-black">
              {pendingDrivers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Live System Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('trucks')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'trucks'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Fleet Inventory ({trucks.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Freight Corridor Activity Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { corridor: 'Chicago, IL ➔ Atlanta, GA', volume: '1,420 Tons', growth: '+28%', share: 85 },
                { corridor: 'Dallas, TX ➔ Houston, TX', volume: '980 Tons', growth: '+19%', share: 65 },
                { corridor: 'Los Angeles, CA ➔ Phoenix, AZ', volume: '840 Tons', growth: '+14%', share: 55 },
                { corridor: 'Philadelphia, PA ➔ New York, NY', volume: '620 Tons', growth: '+34%', share: 45 },
              ].map(item => (
                <div key={item.corridor} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{item.corridor}</span>
                    <span className="text-brand-500">{item.volume} ({item.growth})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-navy-800 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              System Health & Telematics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold">GPS Telematics Ingestion</span>
                <span className="font-bold text-emerald-600">Operational (99.9%)</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-300 font-semibold">Escrow Multi-Sig Hold</span>
                <span className="font-bold text-blue-600">Secure ($48,200 held)</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-500/20 flex items-center justify-between">
                <span className="text-purple-800 dark:text-purple-300 font-semibold">Return Route Optimizer</span>
                <span className="font-bold text-purple-600">35% Avg Discount</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CARRIER VERIFICATION */}
      {activeTab === 'drivers' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Carrier Onboarding & DOT Compliance Reviews
          </h3>
          {pendingDrivers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              All carrier verification requests have been processed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDrivers.map(d => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-navy-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{d.name}</h4>
                    <p className="text-xs text-slate-500">{d.email} • {d.vehicle}</p>
                    <span className="text-[11px] font-mono font-bold text-brand-500">{d.dotNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveDriver(d.id, d.name)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Carrier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.map(b => (
            <div
              key={b.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-brand-500">{b.bookingRef}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {b.originCity} ➔ {b.destinationCity}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shipper: {b.customerName} • Carrier: {b.driverName} ({b.truckName})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  ${b.finalPrice.toLocaleString()}
                </span>
                <button
                  onClick={() => setSelectedBookingForTracking(b)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white dark:bg-navy-800 dark:hover:bg-navy-700 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: FLEET */}
      {activeTab === 'trucks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trucks.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center gap-4"
            >
              <img src={t.image} alt={t.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{t.name}</h4>
                <p className="text-[11px] text-slate-500">Plate: {t.plateNumber} • {t.type}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span>{t.capacityTons}T Payload</span>
                  <span>•</span>
                  <span>Driver: {t.driverName}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 text-slate-600'}`}>
                {t.isAvailable ? 'Active' : 'Off-Duty'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TRACKING MODAL */}
      {selectedBookingForTracking && (
        <TrackingMilestoneModal
          booking={selectedBookingForTracking}
          onClose={() => setSelectedBookingForTracking(null)}
        />
      )}

    </div>
  );
};
