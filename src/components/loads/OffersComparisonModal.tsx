import React from 'react';
import { LoadRequest, DriverOffer } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Star, ShieldCheck, Clock, CheckCircle2, DollarSign, Truck as TruckIcon, Phone } from 'lucide-react';

interface OffersComparisonModalProps {
  load: LoadRequest;
  offers: DriverOffer[];
  onClose: () => void;
}

export const OffersComparisonModal: React.FC<OffersComparisonModalProps> = ({ load, offers, onClose }) => {
  const { acceptOffer } = useData();

  const handleAccept = (offerId: string) => {
    acceptOffer(offerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white uppercase">
                {load.offersCount} Bids Received
              </span>
              <h3 className="font-bold text-lg">Compare Driver Offers</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Route: {load.originCity} ➔ {load.destinationCity} (Max Budget: ${load.budgetMax.toLocaleString()})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No bids submitted yet for this load
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Verified drivers traveling matching corridors have been notified. Check back shortly!
              </p>
            </div>
          ) : (
            offers.map((offer) => {
              const savings = load.budgetMax - offer.offeredPrice;
              const isSavings = savings > 0;

              return (
                <div
                  key={offer.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    offer.status === 'accepted'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-navy-700 bg-slate-50/60 dark:bg-navy-800/40 hover:border-brand-500/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-navy-700">
                    
                    {/* Driver details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.driverAvatar}
                        alt={offer.driverName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-brand-500"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {offer.driverName}
                          </h4>
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {offer.driverRating}
                          </span>
                          <span>•</span>
                          <span>{offer.truckType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Bid */}
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                        ${offer.offeredPrice.toLocaleString()}
                      </div>
                      {isSavings ? (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          Saves you ${savings.toLocaleString()}!
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Within budget</span>
                      )}
                    </div>

                  </div>

                  {/* Body Message & Duration */}
                  <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                    <p className="italic bg-white dark:bg-navy-900 p-2.5 rounded-xl border border-slate-100 dark:border-navy-800">
                      "{offer.message}"
                    </p>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        Est. Transit: {offer.estimatedHours} Hours
                      </span>
                      <span>Vehicle: {offer.truckName} ({offer.plateNumber})</span>
                    </div>
                  </div>

                  {/* Accept CTA */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-brand-500" /> {offer.driverPhone}
                    </span>
                    {offer.status === 'accepted' ? (
                      <span className="px-4 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Offer Accepted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAccept(offer.id)}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Confirm Booking</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

