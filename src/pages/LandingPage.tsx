import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { POPULAR_CITIES } from '../data/mockData';
import { TruckCard } from '../components/trucks/TruckCard';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Scale, 
  RotateCcw,
  Star,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { trucks, stats } = useData();
  const navigate = useNavigate();

  // Search widget state
  const [origin, setOrigin] = useState('Chicago, IL');
  const [destination, setDestination] = useState('Atlanta, GA');
  const [date, setDate] = useState('2026-11-08');
  const [truckType, setTruckType] = useState('All Vehicle Types');

  // How it works role toggle
  const [worksRole, setWorksRole] = useState<'shipper' | 'driver'>('shipper');

  // Interactive Freight Calculator state
  const [calcDistance, setCalcDistance] = useState<number>(450);
  const [calcWeightTons, setCalcWeightTons] = useState<number>(10);
  const [calcTruckType, setCalcTruckType] = useState<'Heavy Semi-Trailer' | 'Medium Box Truck' | 'Refrigerated (Reefer)' | 'Flatbed Truck'>('Heavy Semi-Trailer');

  // Calculation rates
  const getRatePerKm = () => {
    switch (calcTruckType) {
      case 'Refrigerated (Reefer)': return 2.85;
      case 'Flatbed Truck': return 2.70;
      case 'Medium Box Truck': return 1.85;
      default: return 2.45;
    }
  };
  const standardEstimate = Math.round(350 + calcDistance * getRatePerKm() * (1 + calcWeightTons * 0.02));
  const returnDealEstimate = Math.round(standardEstimate * 0.65); // 35% discount

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/trucks?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  const featuredTrucks = trucks.slice(0, 3);
  const emptyReturnTrucks = trucks.filter(t => t.returnTripMatch?.isReturningEmpty);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner">
              <Sparkles className="w-4 h-4 text-brand-500 animate-spin-slow" />
              <span>AI-Powered Logistics & Return Route Exchange</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Transport Goods Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-amber-300">
                Zero Empty Return Miles.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              SuperFast connects shippers directly with verified truck owners and drivers on matching routes. Compare prices, post freight loads, and slash shipping costs by up to 40% on backhaul routes.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/post-load"
                className="px-6 py-3.5 rounded-xl font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/30 hover:scale-105 transition-all text-sm flex items-center gap-2"
              >
                <span>Post Freight Load</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/trucks"
                className="px-6 py-3.5 rounded-xl font-bold bg-navy-800/90 hover:bg-navy-700 text-white border border-navy-700 hover:scale-105 transition-all text-sm flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-brand-400" />
                <span>Browse Available Trucks</span>
              </Link>
            </div>

          </div>

          {/* SEARCH & FILTER WIDGET */}
          <div className="mt-12 max-w-5xl mx-auto bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border border-slate-200 dark:border-navy-700 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-900 dark:text-white">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Pickup City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    Pickup City
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Destination City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Destination City
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Loading Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    Loading Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Truck Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    Vehicle Type
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="All Vehicle Types">All Vehicle Types</option>
                    <option value="Heavy Semi-Trailer">Heavy Semi-Trailer (22T)</option>
                    <option value="Medium Box Truck">Medium Box Truck (6.5T)</option>
                    <option value="Flatbed Truck">Flatbed Truck (24T)</option>
                    <option value="Refrigerated (Reefer)">Refrigerated Reefer (19T)</option>
                    <option value="Mini Truck / Pickup">Mini Truck / Pickup (3.2T)</option>
                    <option value="Container Carrier">Container Carrier (26T)</option>
                  </select>
                </div>

              </div>

              {/* Search Submit Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Showing instant verified carrier availability & backhaul deals</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Trucks & Compare</span>
                </button>
              </div>

            </form>
          </div>

          {/* REAL-TIME STATS TICKER */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 backdrop-blur-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-brand-400">
                {stats.activeTrucks.toLocaleString()}+
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Verified Trucks Available</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 backdrop-blur-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {stats.onTimeRatePercent}%
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">On-Time Delivery Rate</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 backdrop-blur-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">
                {stats.avgShipperSavingsPercent}%
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Avg Shipper Cost Savings</p>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 backdrop-blur-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-blue-400">
                {(stats.emptyMilesSavedKm / 1000).toFixed(0)}k km
              </span>
              <p className="text-xs text-slate-400 mt-1 font-medium">Empty Miles Eliminated</p>
            </div>
          </div>

        </div>
      </section>

      {/* EMPTY RETURN TRIP OPTIMIZER SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-900/20 via-navy-900 to-navy-950 border border-emerald-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>The SuperFast Advantage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Why Pay Full Price When A Truck Is Already Heading Your Way Empty?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Over 30% of commercial trucks on highways return completely empty after dropping off their primary load. SuperFast matches these return routes with shippers heading the exact same direction, turning deadhead miles into massive discounts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Shippers Save Up To 40%</h5>
                    <p className="text-[11px] text-slate-400">Lock discounted rates on return trips with full insurance coverage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Truckers Boost Revenue</h5>
                    <p className="text-[11px] text-slate-400">Earn up to $2,500 additional profit per backhaul instead of burning diesel empty.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/trucks?filter=return_only"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Today's Empty Return Specials</span>
                </Link>
              </div>
            </div>

            {/* Visual Route comparison card */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-700/80 shadow-2xl space-y-3">
                <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                  Live Backhaul Corridor Deal
                </span>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      CHI
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">Chicago, IL</span>
                      <p className="text-[10px] text-slate-400">Empty Return</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-xs font-bold text-white">Atlanta, GA</span>
                      <p className="text-[10px] text-slate-400">Destination</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                      ATL
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 line-through block text-[11px]">$2,450 Standard</span>
                    <span className="text-lg font-black text-emerald-400">$1,590 Return Rate</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
                    Save $860 (35% OFF)
                  </span>
                </div>

                <Link
                  to="/trucks?filter=return_only"
                  className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold text-center block transition-colors"
                >
                  Reserve This Backhaul Match
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUCK FLEET CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Fleet Capabilities
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Specialized Trucks for Any Freight
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            From urban parcel sprints to heavy industrial 53ft haulers, choose the perfect vehicle tailored to your cargo dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/trucks"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white transition-all text-sm shadow-md"
          >
            <span>Explore All Available Trucks & Rates</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW SUPERFAST WORKS (DUAL VIEW) */}
      <section className="bg-slate-100/70 dark:bg-navy-900/60 py-16 border-y border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              How SuperFast Marketplace Works
            </h2>
            
            {/* Role switch toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-navy-800 border border-slate-300 dark:border-navy-700">
              <button
                onClick={() => setWorksRole('shipper')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  worksRole === 'shipper'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                For Shippers / Cargo Owners
              </button>
              <button
                onClick={() => setWorksRole('driver')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  worksRole === 'driver'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                For Truck Drivers & Fleets
              </button>
            </div>
          </div>

          {worksRole === 'shipper' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Post Your Load or Pick a Truck
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Enter pickup/drop locations, cargo weight, and specifications. Receive instant driver bids or reserve an available truck directly with guaranteed pricing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Compare Bids & Lock Escrow
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Review verified driver ratings, truck types, and return-route discounts. Accept the best offer and secure the trip with our zero-risk payment hold.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live Telematics & Delivery
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monitor milestone progress from dispatch to final drop-off. Sign digital POD (Proof of Delivery) once cargo is inspected in perfect condition.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Register Fleet & Set Routes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Add your vehicle specifications, payload tonnage, and regular corridors. Toggle "Returning Empty" whenever you have deadhead miles.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Discover Loads & Submit Quotes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Receive instant notifications for loads matching your destination. Submit competitive offers tailored to your vehicle capacity.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Haul, Update & Get Paid Fast
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Update trip milestones on your driver dashboard. Upload delivery signatures for same-day payout directly to your bank account.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* INTERACTIVE ROUTE COST CALCULATOR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-navy-800">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Transparent Freight Estimator
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Calculate Instant Route Rates
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Live market corridor averages
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Estimated Distance:</span>
                  <span className="text-brand-500 text-sm">{calcDistance} km</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={25}
                  value={calcDistance}
                  onChange={(e) => setCalcDistance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50 km (Metro)</span>
                  <span>1,000 km (Regional)</span>
                  <span>2,500 km (Cross-Country)</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Cargo Weight (Payload):</span>
                  <span className="text-blue-500 text-sm">{calcWeightTons} Tons</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={26}
                  step={1}
                  value={calcWeightTons}
                  onChange={(e) => setCalcWeightTons(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Ton</span>
                  <span>12 Tons</span>
                  <span>26 Tons (Full Load)</span>
                </div>
              </div>

              {/* Vehicle Type radio buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Required Vehicle Classification:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Heavy Semi-Trailer', 'Medium Box Truck', 'Refrigerated (Reefer)', 'Flatbed Truck'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCalcTruckType(type)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        calcTruckType === type
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300'
                          : 'border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Price Preview Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Standard Market Rate
                </span>
                <div className="text-2xl font-bold text-slate-300 mt-0.5 line-through decoration-rose-500">
                  ${standardEstimate.toLocaleString()}
                </div>

                <div className="mt-4 pt-4 border-t border-navy-800">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SuperFast Empty Return Match</span>
                  </div>
                  <div className="text-4xl font-black text-brand-400 mt-1">
                    ${returnDealEstimate.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-300 font-semibold mt-1">
                    Estimated savings: ${(standardEstimate - returnDealEstimate).toLocaleString()} (35% OFF)
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-slate-400">
                  Includes driver handling, base staging, fuel index & 24/7 telematics monitoring.
                </p>
                <Link
                  to="/post-load"
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-center block text-xs shadow-lg shadow-brand-500/20 transition-all"
                >
                  Post This Load to Marketplace
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS & TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Loved By Industry Leaders
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            What Shippers & Drivers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "We ship 15 tons of consumer packaged goods weekly between Chicago and Atlanta. By tapping into SuperFast return trucks, our freight expenditure dropped by $3,200 per month."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-navy-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Sarah J"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-slate-400">Logistics Director, Apex Distribution</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "As an owner-operator with a 53ft reefer, driving home empty was killing my margins. Now I just broadcast my return schedule on SuperFast and get matched within 20 minutes."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-navy-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Marcus Vance"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Vance</h4>
                <p className="text-[10px] text-slate-400">Fleet Owner, Vance Heavy Haul LLC</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "The digital escrow protection and milestone updates give us total peace of mind for fragile machinery shipments. SuperFast is leagues ahead of traditional brokers."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-navy-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="David Chen"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">David Chen</h4>
                <p className="text-[10px] text-slate-400">Operations VP, Titanium Fabrications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Streamline Your Freight Operations?
            </h2>
            <p className="text-sm sm:text-base text-brand-50 font-normal">
              Join thousands of businesses and truck drivers saving money and optimizing empty return corridors every single day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/post-load"
                className="px-7 py-3.5 rounded-xl font-extrabold bg-navy-950 hover:bg-navy-900 text-white shadow-xl transition-all text-sm"
              >
                Post Freight Request
              </Link>
              <Link
                to="/trucks"
                className="px-7 py-3.5 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all text-sm"
              >
                Browse Fleet Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
