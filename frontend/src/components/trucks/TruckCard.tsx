import React, { useState } from 'react';
import { Truck } from '../../types';
import {
  Star,
  MapPin,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronRight,
  Calendar,
  Weight,
  Box
} from 'lucide-react';
import { BookingModal } from './BookingModal';
import { TruckDetailModal } from './TruckDetailModal';

interface TruckCardProps {
  truck: Truck;
  viewMode?: 'grid' | 'list';
}

export const TruckCard: React.FC<TruckCardProps> = ({ truck, viewMode = 'grid' }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const isReturnDeal = truck.returnTripMatch?.isReturningEmpty;

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5 hover:border-brand-500/50 hover:shadow-xl transition-all group">

          {/* Image */}
          <div className="relative w-full md:w-56 h-40 rounded-xl overflow-hidden shrink-0 bg-slate-900">
            <img
              src={truck.image}
              alt={truck.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isReturnDeal && (
              <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                <span>{truck.returnTripMatch?.discountPercent}% Return Deal</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-navy-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded">
              {truck.type}
            </div>
          </div>

          {/* Center Info */}
          <div className="flex-1 min-w-0 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {truck.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/50">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{truck.rating}</span>
                <span className="text-slate-400 text-[10px]">({truck.reviewsCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                {truck.currentLocation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Avail: {truck.availableDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-emerald-500" />
                {truck.capacityTons}T Payload
              </span>
            </div>

            {/* Empty return corridor text */}
            {isReturnDeal && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                Empty backhaul route: {truck.returnTripMatch?.origin} ➔ {truck.returnTripMatch?.destination}
              </p>
            )}

            {/* Driver Avatar */}
            <div className="flex items-center gap-2 pt-1">
              <img
                src={truck.driverAvatar}
                alt={truck.driverName}
                className="w-6 h-6 rounded-full object-cover border border-brand-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {truck.driverName}
              </span>
              {truck.driverVerified && (
                <span title="Verified Carrier">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              )}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="w-full md:w-44 flex md:flex-col justify-between items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-navy-800 pt-3 md:pt-0 md:pl-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
              <div className="text-xl font-black text-brand-600 dark:text-brand-400">
                ${truck.ratePerKm.toFixed(2)}<span className="text-xs font-normal text-slate-500">/km</span>
              </div>
              <span className="text-[10px] text-slate-400">Base: ${truck.fixedBasePrice}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetailModal(true)}
                className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
              >
                Specs
              </button>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
            </div>
          </div>

        </div>

        {showBookingModal && (
          <BookingModal truck={truck} onClose={() => setShowBookingModal(false)} />
        )}
        {showDetailModal && (
          <TruckDetailModal
            truck={truck}
            onClose={() => setShowDetailModal(false)}
            onBook={() => {
              setShowDetailModal(false);
              setShowBookingModal(true);
            }}
          />
        )}
      </>
    );
  }

  // Grid view (Default)
  return (
    <>
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col group">

        {/* Top Image */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          <img
            src={truck.image}
            alt={truck.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-80" />

          {/* Discount Ribbon */}
          {isReturnDeal && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>{truck.returnTripMatch?.discountPercent}% Empty Return</span>
            </div>
          )}

          {/* Truck Category Badge */}
          <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-sm text-brand-400 text-xs font-bold px-2.5 py-0.5 rounded-lg border border-navy-700">
            {truck.type}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-navy-900/90 backdrop-blur-sm text-slate-800 dark:text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{truck.rating}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
              {truck.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Plate: {truck.plateNumber} • {truck.model}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-navy-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Weight className="w-3.5 h-3.5 text-slate-400" />
              <span>{truck.capacityTons}T Payload</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Box className="w-3.5 h-3.5 text-slate-400" />
              <span>{truck.volumeM3} m³ Volume</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span className="truncate">{truck.currentLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{truck.availableDate}</span>
            </div>
          </div>

          {/* Driver preview */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="flex items-center gap-2">
              <img
                src={truck.driverAvatar}
                alt={truck.driverName}
                className="w-7 h-7 rounded-full object-cover border border-brand-500"
              />
              <div>
                <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                  <span>{truck.driverName}</span>
                  {truck.driverVerified && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                </div>
                <span className="text-[10px] text-slate-400">{truck.driverTripsCount} Trips</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                ${truck.ratePerKm.toFixed(2)}<span className="text-[10px] font-normal text-slate-400">/km</span>
              </div>
              <span className="text-[10px] text-slate-400">Base: ${truck.fixedBasePrice}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setShowDetailModal(true)}
              className="flex-1 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 rounded-xl transition-colors"
            >
              Specs
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>

        </div>

      </div>

      {showBookingModal && (
        <BookingModal truck={truck} onClose={() => setShowBookingModal(false)} />
      )}
      {showDetailModal && (
        <TruckDetailModal
          truck={truck}
          onClose={() => setShowDetailModal(false)}
          onBook={() => {
            setShowDetailModal(false);
            setShowBookingModal(true);
          }}
        />
      )}
    </>
  );
};
