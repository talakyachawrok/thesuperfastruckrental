import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TruckCard } from '../components/trucks/TruckCard';
import { POPULAR_CITIES } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Sparkles, 
  RotateCcw, 
  Truck as TruckIcon, 
  SlidersHorizontal,
  MapPin,
  Check
} from 'lucide-react';

export const TruckListingPage: React.FC = () => {
  const { trucks } = useData();
  const [searchParams] = useSearchParams();

  // Initial filter values from query parameters if any
  const initialFilter = searchParams.get('filter');
  const initialOrigin = searchParams.get('origin') || '';
  const initialDestination = searchParams.get('destination') || '';

  const [searchCity, setSearchCity] = useState(initialOrigin || initialDestination || '');
  const [selectedType, setSelectedType] = useState('All');
  const [onlyReturnDeals, setOnlyReturnDeals] = useState(initialFilter === 'return_only');
  const [onlyInstantBooking, setOnlyInstantBooking] = useState(false);
  const [maxRatePerKm, setMaxRatePerKm] = useState<number>(3.5);
  const [minTonnage, setMinTonnage] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rate_asc' | 'rating_desc' | 'capacity_desc'>('rate_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter trucks
  const filteredTrucks = useMemo(() => {
    return trucks.filter(truck => {
      // City search: matches current location or covered destinations
      if (searchCity.trim()) {
        const query = searchCity.toLowerCase();
        const matchesOrigin = truck.currentLocation.toLowerCase().includes(query);
        const matchesDest = truck.destinationsCovered.some(d => d.toLowerCase().includes(query));
        const matchesReturn = truck.returnTripMatch && (
          truck.returnTripMatch.origin.toLowerCase().includes(query) ||
          truck.returnTripMatch.destination.toLowerCase().includes(query)
        );
        if (!matchesOrigin && !matchesDest && !matchesReturn) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'All' && truck.type !== selectedType) {
        return false;
      }

      // Empty Return Deals
      if (onlyReturnDeals && !truck.returnTripMatch?.isReturningEmpty) {
        return false;
      }

      // Instant booking
      if (onlyInstantBooking && !truck.instantBooking) {
        return false;
      }

      // Max rate per km
      if (truck.ratePerKm > maxRatePerKm) {
        return false;
      }

      // Min tonnage
      if (truck.capacityTons < minTonnage) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rate_asc') return a.ratePerKm - b.ratePerKm;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'capacity_desc') return b.capacityKg - a.capacityKg;
      return 0;
    });
  }, [trucks, searchCity, selectedType, onlyReturnDeals, onlyInstantBooking, maxRatePerKm, minTonnage, sortBy]);

  const resetFilters = () => {
    setSearchCity('');
    setSelectedType('All');
    setOnlyReturnDeals(false);
    setOnlyInstantBooking(false);
    setMaxRatePerKm(3.5);
    setMinTonnage(0);
    setSortBy('rate_asc');
  };

  const hasActiveFilters = searchCity || selectedType !== 'All' || onlyReturnDeals || onlyInstantBooking || minTonnage > 0 || maxRatePerKm < 3.5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-navy-800">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Available Fleet
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Truck Directory & Direct Booking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare rates, inspect equipment details, and book verified trucks traveling matching freight corridors.
          </p>
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredTrucks.length}</strong> vehicles
          </span>
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-navy-900 text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-navy-900 text-brand-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Truck Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search by City */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Search City / Corridor
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Chicago, Atlanta, Dallas..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Quick Return Trip Special Filter */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyReturnDeals}
                onChange={(e) => setOnlyReturnDeals(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Empty Return Deals Only
              </span>
            </label>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 pl-6 leading-tight">
              Shows trucks traveling empty return backhauls with up to 40% discount.
            </p>
          </div>

          {/* Vehicle Classification */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vehicle Classification
            </label>
            <div className="space-y-1">
              {[
                'All',
                'Heavy Semi-Trailer',
                'Medium Box Truck',
                'Flatbed Truck',
                'Refrigerated (Reefer)',
                'Mini Truck / Pickup',
                'Container Carrier'
              ].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedType === type
                      ? 'bg-brand-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  <span>{type}</span>
                  {selectedType === type && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Rate per KM slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Max Rate / km:</span>
              <span className="text-brand-500 font-bold">${maxRatePerKm.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={1.2}
              max={3.5}
              step={0.1}
              value={maxRatePerKm}
              onChange={(e) => setMaxRatePerKm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Minimum Tonnage slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Min Payload Capacity:</span>
              <span className="text-blue-500 font-bold">{minTonnage} Tons</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={minTonnage}
              onChange={(e) => setMinTonnage(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Instant booking checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={onlyInstantBooking}
              onChange={(e) => setOnlyInstantBooking(e.target.checked)}
              className="w-4 h-4 text-brand-500 rounded border-slate-300 focus:ring-brand-500"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Instant Booking Guaranteed
            </span>
          </label>

          {/* Sorting */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-navy-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Sort Vehicles By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="rate_asc">Rate: Lowest to Highest</option>
              <option value="rating_desc">Highest Driver Rating</option>
              <option value="capacity_desc">Highest Payload Capacity</option>
            </select>
          </div>

        </aside>

        {/* TRUCK RESULTS */}
        <main className="lg:col-span-3">
          {filteredTrucks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-8 space-y-4">
              <TruckIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                No trucks match your selected filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing city criteria, or exploring other vehicle categories.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white shadow-md hover:bg-brand-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} viewMode="list" />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
