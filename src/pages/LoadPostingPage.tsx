import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CargoCategory, TruckType } from '../types';
import { POPULAR_CITIES } from '../data/mockData';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Scale, 
  Truck as TruckIcon, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const CARGO_CATEGORIES: CargoCategory[] = [
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

const TRUCK_TYPES: (TruckType | 'Any Suitable')[] = [
  'Any Suitable',
  'Mini Truck / Pickup',
  'Medium Box Truck',
  'Heavy Semi-Trailer',
  'Flatbed Truck',
  'Refrigerated (Reefer)',
  'Container Carrier'
];

export const LoadPostingPage: React.FC = () => {
  const { createLoadRequest } = useData();
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [originCity, setOriginCity] = useState('Chicago, IL');
  const [originAddress, setOriginAddress] = useState('2400 W Fulton St, Facility Gate 2');
  const [destinationCity, setDestinationCity] = useState('Atlanta, GA');
  const [destinationAddress, setDestinationAddress] = useState('1500 Southland Circle NW, Receiving Dock');
  const [pickupDate, setPickupDate] = useState('2026-11-09');
  const [isUrgent, setIsUrgent] = useState(false);

  // Step 2: Cargo
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('FMCG / Packaged Goods');
  const [goodsDescription, setGoodsDescription] = useState('18 Pallets of packaged consumer goods, stretch wrapped and labelled.');
  const [weightKg, setWeightKg] = useState<number>(12000);
  const [volumeM3, setVolumeM3] = useState<number>(55);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([
    'Hydraulic Liftgate',
    'Proof of Delivery required'
  ]);

  // Step 3: Truck & Budget
  const [requiredTruckType, setRequiredTruckType] = useState<TruckType | 'Any Suitable'>('Heavy Semi-Trailer');
  const [budgetMax, setBudgetMax] = useState<number>(1950);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 765-4321');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'sarah.jenkins@apexdemo.com');
  const [customerName, setCustomerName] = useState(user?.name || 'Sarah Jenkins');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle special requirement tags
  const toggleRequirement = (req: string) => {
    if (specialRequirements.includes(req)) {
      setSpecialRequirements(prev => prev.filter(r => r !== req));
    } else {
      setSpecialRequirements(prev => [...prev, req]);
    }
  };

  // Recommended truck recommendation based on weight
  const getRecommendedTruck = (): TruckType => {
    if (cargoCategory === 'Temperature Controlled / Cold Chain') return 'Refrigerated (Reefer)';
    if (cargoCategory === 'Heavy Machinery') return 'Flatbed Truck';
    if (weightKg <= 3000) return 'Mini Truck / Pickup';
    if (weightKg <= 8000) return 'Medium Box Truck';
    return 'Heavy Semi-Trailer';
  };

  const recommendedTruck = getRecommendedTruck();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Make sure persona is customer to see the posted load
    if (role !== 'customer') {
      switchRole('customer');
    }

    createLoadRequest({
      customerId: user?.id || 'usr-cust-1',
      customerName,
      customerPhone,
      customerEmail,
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      pickupDate,
      cargoCategory,
      goodsDescription,
      weightKg,
      volumeM3,
      requiredTruckType,
      budgetMax,
      specialRequirements,
      isUrgent,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/customer-dashboard');
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
          Shipper Freight Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Post Cargo & Receive Competitive Bids
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Broadcast your shipment details to thousands of verified truckers. Drivers travelling return routes will compete with discounted quotes.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="max-w-2xl mx-auto flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-navy-800 -translate-y-1/2 -z-0" />
        
        <div className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer`} onClick={() => setStep(1)}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            step >= 1 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
          }`}>
            1
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Route & Date</span>
        </div>

        <div className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer`} onClick={() => setStep(2)}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            step >= 2 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
          }`}>
            2
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Cargo Specs</span>
        </div>

        <div className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer`} onClick={() => setStep(3)}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            step >= 3 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
          }`}>
            3
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Truck & Budget</span>
        </div>
      </div>

      {/* Main Grid: Form + Live Recommendation Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FORM CONTAINER */}
        <div className="lg:col-span-8 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleNext} className="space-y-6">
            
            {/* STEP 1: ROUTE & TIMING */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 1: Origin, Destination & Loading Date
                  </h3>
                  <p className="text-xs text-slate-500">Specify exactly where drivers should pick up and drop off.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      Pickup City
                    </label>
                    <select
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Pickup address / Warehouse / Facility"
                      value={originAddress}
                      onChange={(e) => setOriginAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Destination */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      Destination City
                    </label>
                    <select
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Delivery address / Distribution center"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>

                {/* Pickup Date & Urgent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      Loading Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 w-full">
                      <input
                        type="checkbox"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                          Urgent Dispatch Tag
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400">
                          Prioritizes listing for drivers within 30 miles.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <span>Next: Cargo Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CARGO SPECS */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 2: Cargo Specifications & Handling
                  </h3>
                  <p className="text-xs text-slate-500">Provide weight and dimensions so truckers can verify axle payload.</p>
                </div>

                {/* Cargo Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Cargo Classification
                  </label>
                  <select
                    value={cargoCategory}
                    onChange={(e) => setCargoCategory(e.target.value as CargoCategory)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CARGO_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Goods description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Detailed Goods Description & Packaging
                  </label>
                  <textarea
                    rows={3}
                    value={goodsDescription}
                    onChange={(e) => setGoodsDescription(e.target.value)}
                    placeholder="e.g. 15 shrink-wrapped pallets, fragile electronic circuitry, need pallet jack."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                {/* Weight & Volume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-brand-500" />
                      Total Weight (kg)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={35000}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400">Equivalent to {(weightKg / 1000).toFixed(1)} Metric Tons</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-500" />
                      Estimated Volume (m³)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={volumeM3}
                      onChange={(e) => setVolumeM3(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Special Requirements Chips */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Special Equipment or Handling Requirements
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Hydraulic Liftgate',
                      'Pallet Jack Onboard',
                      'Temperature Controlled',
                      'Proof of Delivery required',
                      'Fragile Handling',
                      'Heavy Tarpaulins',
                      'Dual Driver Non-Stop'
                    ].map(req => {
                      const isSelected = specialRequirements.includes(req);
                      return (
                        <button
                          key={req}
                          type="button"
                          onClick={() => toggleRequirement(req)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSelected
                              ? 'bg-brand-500 text-white border-brand-500 font-bold'
                              : 'bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-brand-500/50'
                          }`}
                        >
                          {req}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  >
                    Back to Route
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <span>Next: Vehicle & Budget</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VEHICLE & BUDGET */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 3: Vehicle Preference & Budget Ceiling
                  </h3>
                  <p className="text-xs text-slate-500">Drivers will bid competitive offers against your maximum budget.</p>
                </div>

                {/* Required Truck Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Required Vehicle Classification
                  </label>
                  <select
                    value={requiredTruckType}
                    onChange={(e) => setRequiredTruckType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Maximum Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                    Maximum Willing Budget ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min={100}
                      max={50000}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 text-base font-bold rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Drivers often offer 15-35% below ceiling for matching backhaul routes.</span>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Shipper Contact Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Dispatch Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  >
                    Back to Cargo
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Broadcasting to Truckers...</span>
                    ) : (
                      <>
                        <span>Broadcast Load Request</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* SIDEBAR INTELLIGENT ROUTE PREVIEW */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-5 rounded-3xl bg-navy-950 text-white border border-navy-800 shadow-xl space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">
              AI Route Intelligence
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Route Corridor:</span>
                <span className="font-bold text-white">{originCity} ➔ {destinationCity}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Loading Date:</span>
                <span className="font-bold text-white">{pickupDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Payload Weight:</span>
                <span className="font-bold text-white">{(weightKg / 1000).toFixed(1)} Tons</span>
              </div>
            </div>

            {/* Smart Vehicle Recommendation */}
            <div className="p-3.5 rounded-2xl bg-navy-900 border border-navy-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" />
                Algorithm Recommendation
              </span>
              <div className="text-sm font-bold text-brand-400">
                {recommendedTruck}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Optimized for {(weightKg / 1000).toFixed(1)}T payload and {cargoCategory}.
              </p>
            </div>

            {/* Empty Return Market Rate */}
            <div className="pt-2 border-t border-navy-800 space-y-1">
              <span className="text-xs text-slate-400">Expected Competitive Bid Range:</span>
              <div className="text-2xl font-black text-emerald-400">
                ${Math.round(budgetMax * 0.75).toLocaleString()} - ${Math.round(budgetMax * 0.9).toLocaleString()}
              </div>
              <p className="text-[10px] text-emerald-300">
                Matching return drivers can save you up to ${(budgetMax * 0.25).toFixed(0)}!
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-navy-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>SuperFast Guaranteed: Drivers are FMCSA verified and carry \$100k+ cargo insurance.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
