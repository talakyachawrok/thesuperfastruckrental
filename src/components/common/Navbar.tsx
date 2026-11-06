import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Truck, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  PlusCircle, 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetAllData } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleRoleChange = (newRole: 'customer' | 'driver' | 'admin') => {
    switchRole(newRole);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    if (newRole === 'customer') navigate('/customer-dashboard');
    if (newRole === 'driver') navigate('/driver-dashboard');
    if (newRole === 'admin') navigate('/admin-dashboard');
  };

  const getDashboardPath = () => {
    if (role === 'driver') return '/driver-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    return '/customer-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-navy-950/90 border-b border-slate-200/80 dark:border-navy-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6 transform -scale-x-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-navy-900 dark:text-white flex items-center">
                SUPER<span className="text-brand-500">FAST</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 -mt-1">
                Truck & Cargo Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/trucks"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/trucks')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100/70 dark:hover:bg-navy-900'
              }`}
            >
              Find Trucks
            </Link>

            <Link
              to="/post-load"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/post-load')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100/70 dark:hover:bg-navy-900'
              }`}
            >
              <span>Post Load</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                Shippers
              </span>
            </Link>

            <Link
              to="/trucks?filter=return_only"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Empty Return Deals</span>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-full">
                -35%
              </span>
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.includes('dashboard')
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100/70 dark:hover:bg-navy-900'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500/50 transition-all"
                title="Switch test persona"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Role:</span>
                <span className="font-bold uppercase text-brand-600 dark:text-brand-400">
                  {role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-navy-800">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => handleRoleChange('customer')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-navy-800 ${
                      role === 'customer' ? 'font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Shipper / Customer</span>
                    {role === 'customer' && <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('driver')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-navy-800 ${
                      role === 'driver' ? 'font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Truck Driver / Fleet</span>
                    {role === 'driver' && <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-navy-800 ${
                      role === 'admin' ? 'font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Logistics Admin</span>
                    {role === 'admin' && <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <div className="border-t border-slate-100 dark:border-navy-800 mt-1 pt-1 px-3">
                    <button
                      onClick={() => {
                        resetAllData();
                        setRoleDropdownOpen(false);
                      }}
                      className="text-[11px] text-slate-500 hover:text-brand-600 flex items-center gap-1.5 py-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/50 transition-colors"
              aria-label="Toggle color mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-navy-700" />}
            </button>

            {/* User Account / Auth CTA */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-brand-500/50 bg-slate-50 dark:bg-navy-900 transition-all"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-brand-500/40"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Join SuperFast</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Theme + Menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300"
              aria-label="Toggle color mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-navy-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-navy-800">
            <span className="text-xs text-slate-500 font-semibold uppercase">Switch Persona:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`px-2 py-1 text-xs rounded font-medium ${role === 'customer' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300'}`}
              >
                Shipper
              </button>
              <button
                onClick={() => handleRoleChange('driver')}
                className={`px-2 py-1 text-xs rounded font-medium ${role === 'driver' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300'}`}
              >
                Driver
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2 py-1 text-xs rounded font-medium ${role === 'admin' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/trucks"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              Find Trucks
            </Link>
            <Link
              to="/post-load"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              Post Cargo Load
            </Link>
            <Link
              to="/trucks?filter=return_only"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              Empty Return Deals (-35%)
            </Link>
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              My Dashboard ({role})
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-500 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-500 text-white font-bold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

