import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole, TruckType } from '../types';
import { 
  Truck, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, loginAsDemo } = useAuth();
  const { addToast } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL query params
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';

  const [mode, setMode] = useState<'login' | 'register'>(initialTab);
  const [role, setRole] = useState<UserRole>(initialRole);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [truckType, setTruckType] = useState<TruckType>('Heavy Semi-Trailer');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    login(email, role);
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Signed in successfully as ${role.toUpperCase()}.`,
    });

    if (role === 'driver') navigate('/driver-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/customer-dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone) return;

    register({
      name,
      email,
      role,
      phone,
      companyName,
    });

    addToast({
      type: 'success',
      title: 'Account Created Successfully!',
      message: `Welcome to SuperFast! Your ${role} profile is ready.`,
    });

    if (role === 'driver') navigate('/driver-dashboard');
    else navigate('/customer-dashboard');
  };

  const handleDemoLogin = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    addToast({
      type: 'info',
      title: 'Instant Demo Access',
      message: `Switched session to ${demoRole.toUpperCase()} demo account.`,
    });

    if (demoRole === 'driver') navigate('/driver-dashboard');
    else if (demoRole === 'admin') navigate('/admin-dashboard');
    else navigate('/customer-dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Top Quick Demo Access Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white border border-navy-700 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              1-Click Instant Demo Evaluation
            </span>
            <span className="text-[10px] text-slate-400">No typing needed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="px-2.5 py-2 rounded-xl bg-navy-950 hover:bg-brand-500 text-white text-xs font-bold border border-navy-700 transition-all text-center"
            >
              Shipper / Customer
            </button>
            <button
              onClick={() => handleDemoLogin('driver')}
              className="px-2.5 py-2 rounded-xl bg-navy-950 hover:bg-brand-500 text-white text-xs font-bold border border-navy-700 transition-all text-center"
            >
              Truck Driver / Fleet
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="px-2.5 py-2 rounded-xl bg-navy-950 hover:bg-brand-500 text-white text-xs font-bold border border-navy-700 transition-all text-center"
            >
              Logistics Admin
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-6 h-6 transform -scale-x-100" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-2">
              {mode === 'login' ? 'Sign In to SuperFast' : 'Create SuperFast Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' 
                ? 'Enter your credentials to access your dispatch dashboard.' 
                : 'Connect with verified carriers or discover loads with discounted return rates.'}
            </p>
          </div>

          {/* Role Selector Pill */}
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 grid grid-cols-2">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'customer'
                  ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Shipper / Cargo Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'driver'
                  ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Truck Driver / Fleet
            </button>
          </div>

          {/* Mode Switch (Login vs Register) */}
          <div className="flex justify-center gap-6 border-b border-slate-100 dark:border-navy-800 pb-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`pb-1 transition-all ${
                mode === 'login' ? 'border-b-2 border-brand-500 text-brand-500' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`pb-1 transition-all ${
                mode === 'register' ? 'border-b-2 border-brand-500 text-brand-500' : 'text-slate-400'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. shipper@apexdemo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => addToast({ type: 'info', title: 'Demo Password', message: 'Any password works in sandbox demo mode!' })}
                    className="text-[11px] text-brand-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In as {role === 'driver' ? 'Driver Partner' : 'Shipper'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Company / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Miller Hauling LLC"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              {role === 'driver' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Vehicle Classification
                  </label>
                  <select
                    value={truckType}
                    onChange={(e) => setTruckType(e.target.value as TruckType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white"
                  >
                    <option value="Heavy Semi-Trailer">Heavy Semi-Trailer (22T)</option>
                    <option value="Medium Box Truck">Medium Box Truck (6.5T)</option>
                    <option value="Flatbed Truck">Flatbed Truck (24T)</option>
                    <option value="Refrigerated (Reefer)">Refrigerated Reefer (19T)</option>
                    <option value="Mini Truck / Pickup">Mini Truck / Pickup (3.2T)</option>
                    <option value="Container Carrier">Container Carrier (26T)</option>
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-brand-500 rounded border-slate-300"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  I agree to SuperFast Carrier & Shipper Terms of Service and Escrow Rules.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Registration</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
