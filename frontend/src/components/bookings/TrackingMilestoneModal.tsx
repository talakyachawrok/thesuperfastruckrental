import React from 'react';
import { Booking } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Truck as TruckIcon, 
  ShieldCheck, 
  ChevronRight, 
  Phone,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TrackingMilestoneModalProps {
  booking: Booking;
  onClose: () => void;
}

export const TrackingMilestoneModal: React.FC<TrackingMilestoneModalProps> = ({ booking, onClose }) => {
  const { role } = useAuth();
  const { updateBookingMilestone } = useData();

  // Find next uncompleted milestone step
  const nextStep = booking.milestones.find(m => !m.completed)?.step;

  const handleAdvanceMilestone = () => {
    if (nextStep) {
      updateBookingMilestone(booking.id, nextStep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white">
                REF: {booking.bookingRef}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                booking.status === 'delivered' || booking.status === 'completed'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="font-extrabold text-xl mt-1">Live Shipment Tracking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Corridor visual */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Pickup</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{booking.originCity}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{booking.originAddress}</p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center px-4">
              <span className="text-[10px] font-semibold text-slate-400">{booking.distanceKm} km</span>
              <div className="w-24 h-0.5 bg-gradient-to-r from-brand-500 to-emerald-500 my-1 relative">
                <TruckIcon className="w-3.5 h-3.5 text-brand-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">In Transit</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:text-right">
              <div className="sm:order-2 w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="sm:order-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Destination</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{booking.destinationCity}</p>
                <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{booking.destinationAddress}</p>
              </div>
            </div>
          </div>

          {/* Current Status Banner */}
          {booking.currentLocationName && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-navy-800/80 border border-blue-200 dark:border-blue-900/40 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400">Live Telematics Location: </span>
                <strong className="text-blue-700 dark:text-blue-300 font-semibold">{booking.currentLocationName}</strong>
              </div>
            </div>
          )}

          {/* Milestones Vertical Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Transit Milestones
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-800">
              {booking.milestones.map((m) => (
                <div key={m.step} className="relative flex items-start gap-3">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    m.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : m.current
                      ? 'bg-brand-500 border-brand-500 text-white animate-pulse'
                      : 'bg-white dark:bg-navy-900 border-slate-300 dark:border-navy-700 text-slate-400'
                  }`}>
                    {m.completed ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <span className="text-[10px] font-bold">{m.step}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-xs font-bold ${m.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        {m.title}
                      </h5>
                      <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver & Truck Specs Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/40 border border-slate-200 dark:border-navy-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={booking.driverAvatar}
                alt={booking.driverName}
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-500"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                  <span>{booking.driverName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-slate-500 text-[11px]">{booking.truckName} ({booking.plateNumber})</p>
              </div>
            </div>

            <div className="text-right flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div>
                <span className="text-slate-400 block text-[10px]">Agreed Rate</span>
                <span className="text-base font-black text-brand-600 dark:text-brand-400">
                  ${booking.finalPrice.toLocaleString()}
                </span>
              </div>
              <a
                href={`tel:${booking.driverPhone}`}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-navy-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1 hover:bg-slate-300 transition-colors"
              >
                <Phone className="w-3 h-3 text-brand-500" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>

          {/* Driver Milestone Progression CTA (If Driver or Admin Persona) */}
          {(role === 'driver' || role === 'admin') && nextStep && (
            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-900 dark:text-brand-200 block">
                  Driver Milestone Action:
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Advance shipment to Step {nextStep} ({booking.milestones[nextStep - 1]?.title})
                </p>
              </div>
              <button
                onClick={handleAdvanceMilestone}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Advance Milestone</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-navy-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-navy-700 transition-colors"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};

