import React, { useState } from 'react';
import { Truck, CargoCategory } from '../../types';
import { useData } from '../../context/DataContext';
import { POPULAR_CITIES } from '../../data/mockData';
import { X, CheckCircle, ShieldCheck, MapPin, Calendar, Scale, DollarSign, Truck as TruckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  truck: Truck;
  onClose: () => void;
}

const CARGO_OPTIONS: CargoCategory[] = [
  'General Merchandise',
  'FMCG / Packaged Goods',
  'Heavy Machinery',
  'Furniture & Household',
  'Building Materials',
  'Agricultural Produce',
  'Electronics & Appliances',
  'Temperature Controlled / Cold Chain',
  'Automotive Parts'
];

export const BookingModal: React.FC<BookingModalProps> = ({ truck, onClose }) => {
  const { bookTruckDirectly } = useData();
  const navigate = useNavigate();

  const [originCity, setOriginCity] = useState(truck.returnTripMatch?.origin || truck.currentLocation);
  const [originAddress, setOriginAddress] = useState('Central Logistics Park, Sector 4');
  const [destinationCity, setDestinationCity] = useState(truck.returnTripMatch?.destination || (truck.destinationsCovered[0] || 'Atlanta, GA'));
  const [destinationAddress, setDestinationAddress] = useState('Industrial Commercial Zone, Dock 12');
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('General Merchandise');
  const [weightKg, setWeightKg] = useState<number>(Math.min(truck.capacityKg, 5000));
  const [pickupDate, setPickupDate] = useState(truck.availableDate || '2026-11-08');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing calculations
  const distanceKm = 420;
  const standardPrice = Math.round(truck.fixedBasePrice + distanceKm * truck.ratePerKm);
  const discountMultiplier = truck.returnTripMatch?.isReturningEmpty 
    ? (1 - truck.returnTripMatch.discountPercent / 100) 
    : 1;
  const finalPrice = Math.round(standardPrice * discountMultiplier);
  const savings = standardPrice - finalPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const booking = bookTruckDirectly(truck.id, {
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      cargoCategory,
      weightKg,
      pickupDate,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      customerNotes: notes,
    });

    if (booking) {
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        navigate('/customer-dashboard');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Direct Vehicle Reservation</h3>
              <p className="text-xs text-slate-400">
                Reserving <span className="text-white font-semibold">{truck.name}</span> with Driver {truck.driverName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Empty Return Notice if applicable */}
          {truck.returnTripMatch?.isReturningEmpty && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Empty Return Match Discount Applied ({truck.returnTripMatch.discountPercent}% OFF)
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                Save ${savings}
              </span>
            </div>
          )}

          {/* Route details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                Pickup Location
              </label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                placeholder="Pickup address / facility"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                className="w-full mt-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Destination Location
              </label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                placeholder="Delivery address / warehouse"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="w-full mt-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Cargo & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cargo Category
              </label>
              <select
                value={cargoCategory}
                onChange={(e) => setCargoCategory(e.target.value as CargoCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CARGO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                Weight (kg) - Max: {truck.capacityKg.toLocaleString()} kg
              </label>
              <input
                type="number"
                max={truck.capacityKg}
                min={100}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Instructions or Cargo Specifications (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Handle with care, forklift loading on site, temperature requirement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Transparent Price Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Base reservation & handling:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">${truck.fixedBasePrice}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Standard line-haul rate (~{distanceKm} km):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">${Math.round(distanceKm * truck.ratePerKm)}</span>
            </div>
            {truck.returnTripMatch?.isReturningEmpty && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Empty backhaul optimization savings:</span>
                <span>-${savings}</span>
              </div>
            )}
            <div className="border-t border-slate-200 dark:border-navy-800 pt-2 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Estimated Guaranteed Total:</span>
                <p className="text-[10px] text-slate-400">Includes fuel surcharge, insurance & driver toll fees</p>
              </div>
              <span className="text-2xl font-black text-brand-500">
                ${finalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>SuperFast Escrow: Payment is held safely and only released when delivery POD is confirmed.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <span>Confirm & Lock Rate</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

