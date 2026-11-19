import React from 'react';
import { Truck } from '../../types';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Calendar, 
  Phone, 
  Sparkles, 
  Zap, 
  Truck as TruckIcon,
  Ruler,
  Weight,
  Box
} from 'lucide-react';

interface TruckDetailModalProps {
  truck: Truck;
  onClose: () => void;
  onBook: () => void;
}

export const TruckDetailModal: React.FC<TruckDetailModalProps> = ({ truck, onClose, onBook }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Truck Image Header */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={truck.image}
            alt={truck.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-navy-900/80 text-white hover:bg-navy-900 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {truck.returnTripMatch?.isReturningEmpty && (
            <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Empty Return Match • {truck.returnTripMatch.discountPercent}% Off</span>
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                {truck.type}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {truck.name}
              </h2>
              <p className="text-xs text-slate-300">
                Plate: {truck.plateNumber} • Chassis Model: {truck.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300">Standard rate from</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-400">
                ${truck.ratePerKm.toFixed(2)}<span className="text-xs text-slate-300 font-normal">/km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Key Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                <Weight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Max Payload</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{truck.capacityTons} Tons</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Cargo Volume</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{truck.volumeM3} m³</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Ruler className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Deck Length</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{truck.lengthFt} Feet</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Fleet Score</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{truck.rating} ({truck.reviewsCount})</p>
              </div>
            </div>
          </div>

          {/* Driver Card & Route info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Driver Profile */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Assigned Truck Operator
              </span>
              <div className="flex items-center gap-3.5 mt-3">
                <img
                  src={truck.driverAvatar}
                  alt={truck.driverName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {truck.driverName}
                    </h4>
                    {truck.driverVerified && (
                      <span title="FMCSA & Identity Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {truck.driverTripsCount}+ SuperFast Trips • {truck.driverRating} ★ Rating
                  </p>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {truck.driverPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Route & Corridor */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200 dark:border-navy-700">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Active Freight Corridor
              </span>
              <div className="mt-2.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Staged At: <strong className="font-semibold">{truck.currentLocation}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Available From: <strong className="font-semibold">{truck.availableDate}</strong></span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {truck.destinationsCovered.map((dest, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-navy-700 text-[11px] text-slate-700 dark:text-slate-300">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Vehicle Features */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Equipment & Handling Features
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {truck.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 p-2 rounded-xl bg-slate-100/70 dark:bg-navy-800/80"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-200 dark:border-navy-700 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Fixed Base Booking Rate</span>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                ${truck.fixedBasePrice} <span className="text-xs font-normal text-slate-500">+ mileage</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onBook}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Book This Truck</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
