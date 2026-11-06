import React, { useState } from 'react';
import { LoadRequest, Truck } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X, DollarSign, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DriverOfferModalProps {
  load: LoadRequest;
  onClose: () => void;
}

export const DriverOfferModal: React.FC<DriverOfferModalProps> = ({ load, onClose }) => {
  const { user } = useAuth();
  const { trucks, submitDriverOffer } = useData();

  // Find a truck registered to this driver or default to first available
  const myTruck = trucks.find(t => t.driverId === user?.id) || trucks[0];

  const [offeredPrice, setOfferedPrice] = useState<number>(Math.round(load.budgetMax * 0.9));
  const [estimatedHours, setEstimatedHours] = useState<number>(12);
  const [message, setMessage] = useState<string>(
    `I am returning along the ${load.originCity} to ${load.destinationCity} corridor and have clean capacity. Ready for pickup on ${load.pickupDate}.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    submitDriverOffer({
      loadRequestId: load.id,
      driverId: user?.id || 'drv-01',
      driverName: user?.name || 'Marcus Vance',
      driverPhone: user?.phone || '+1 (555) 234-8891',
      driverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      driverRating: 4.95,
      truckId: myTruck.id,
      truckName: myTruck.name,
      truckType: myTruck.type,
      plateNumber: myTruck.plateNumber,
      offeredPrice,
      originalBudget: load.budgetMax,
      message,
      estimatedHours,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div>
            <h3 className="font-bold text-lg">Submit Freight Bid</h3>
            <p className="text-xs text-slate-400">
              Trip: {load.originCity} ➔ {load.destinationCity}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Load Summary Badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Cargo Type:</span>
              <strong className="text-slate-800 dark:text-slate-200">{load.cargoCategory}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weight & Req:</span>
              <strong className="text-slate-800 dark:text-slate-200">{load.weightKg.toLocaleString()} kg • {load.requiredTruckType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipper Ceiling Budget:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">${load.budgetMax.toLocaleString()}</strong>
            </div>
          </div>

          {/* Price Offer Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-brand-500" />
              Your Competitive Price Offer ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min={100}
                max={50000}
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tip: Bids lower than the shipper's budget have an 82% higher acceptance rate on return legs.
            </p>
          </div>

          {/* Transit Hours */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Estimated Transit Duration (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={168}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Vehicle info */}
          <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-navy-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Vehicle</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{myTruck.name} ({myTruck.plateNumber})</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 font-bold text-[10px]">
              {myTruck.type}
            </span>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Message to Shipper
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Transmitting Offer...</span>
              ) : (
                <>
                  <span>Send Offer to Shipper</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

