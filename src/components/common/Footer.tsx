import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Zap, Globe, Phone, Mail, MapPin, RotateCcw, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { resetAllData } = useData();

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Banner */}
        <div className="mb-14 p-8 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-950 border border-navy-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Eliminate Empty Return Miles Today
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Save up to 40% on freight or fill your truck's backhaul in minutes with SuperFast AI route matching.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/post-load"
              className="px-5 py-3 rounded-xl font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 transition-all text-sm"
            >
              Post a Load Free
            </Link>
            <Link
              to="/trucks"
              className="px-5 py-3 rounded-xl font-semibold bg-navy-700 hover:bg-navy-600 text-white border border-navy-600 transition-all text-sm"
            >
              Browse Fleet
            </Link>
          </div>
        </div>

        {/* 4 Column Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5 transform -scale-x-100" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SUPER<span className="text-brand-500">FAST</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The next-generation freight marketplace connecting shippers directly with verified truck operators. Specializing in discounted empty-return matches and instant dispatch logistics.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Fleets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-brand-400" />
                <span>Nationwide Coverage</span>
              </div>
            </div>
          </div>

          {/* Column 1: For Shippers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Shippers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/post-load" className="hover:text-brand-400 transition-colors">
                  Post Freight Load
                </Link>
              </li>
              <li>
                <Link to="/trucks" className="hover:text-brand-400 transition-colors">
                  Instant Truck Booking
                </Link>
              </li>
              <li>
                <Link to="/trucks?filter=return_only" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span>Empty Return Deals</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">35% OFF</span>
                </Link>
              </li>
              <li>
                <Link to="/customer-dashboard" className="hover:text-brand-400 transition-colors">
                  Shipper Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Truckers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Truck Owners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/driver-dashboard" className="hover:text-brand-400 transition-colors">
                  Browse Matching Loads
                </Link>
              </li>
              <li>
                <Link to="/auth?role=driver&tab=register" className="hover:text-brand-400 transition-colors">
                  Register Your Fleet
                </Link>
              </li>
              <li>
                <Link to="/driver-dashboard" className="hover:text-brand-400 transition-colors">
                  Driver Earnings Portal
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-brand-400 transition-colors">
                  Fleet Admin Oversight
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Demo Reset */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Dispatch & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>1-800-SUPERFAST</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>dispatch@superfast.io</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Chicago, IL & Nationwide</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetAllData}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-400 bg-navy-800 hover:bg-navy-700 px-3 py-1.5 rounded-lg border border-navy-700 transition-all"
                  title="Reset all mock trucks, loads and bids"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Sandbox</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SuperFast Logistics Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Carrier Standards</span>
            <span className="hover:text-slate-300 cursor-pointer">API Docs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

