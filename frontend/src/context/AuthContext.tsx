import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => boolean;
  loginAsDemo: (demoRole: UserRole) => void;
  register: (user: Partial<User> & { name: string; email: string; role: UserRole; phone: string }) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('superfast_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.customer;
      }
    }
    // Default to Customer Demo so first visit has seamless rich experience
    return DEMO_USERS.customer;
  });

  const role = user?.role || 'customer';

  useEffect(() => {
    if (user) {
      localStorage.setItem('superfast_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('superfast_auth_user');
    }
  }, [user]);

  const login = (email: string, selectedRole: UserRole): boolean => {
    // Attempt backend login in parallel
    api.login(email, selectedRole).catch(err => {
      console.warn('[Auth API] Backend login queued/local:', err.message);
    });

    // If email matches one of the demo users, log in as that demo user
    const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }

    // Otherwise create session for entered email
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: selectedRole,
      phone: '+91 98540 ' + Math.floor(10000 + Math.random() * 90000),
      avatar: selectedRole === 'driver' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      companyName: selectedRole === 'customer' ? 'Brahmaputra Freight Traders' : 'Assam SuperFast Express',
      isVerified: true,
      city: selectedRole === 'customer' ? 'Guwahati, Assam' : 'Tinsukia, Assam',
    };
    setUser(newUser);
    return true;
  };

  const loginAsDemo = (demoRole: UserRole) => {
    api.demoLogin(demoRole).catch(err => {
      console.warn('[Auth API] Demo login sync:', err.message);
    });
    const demoUser = DEMO_USERS[demoRole];
    setUser(demoUser);
  };

  const register = (data: Partial<User> & { name: string; email: string; role: UserRole; phone: string }): boolean => {
    api.register(data).catch(err => {
      console.warn('[Auth API] Registration sync:', err.message);
    });

    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      companyName: data.companyName || (data.role === 'customer' ? 'Assam Tea & Goods Shipper' : 'Gogoi Logistics Partner'),
      avatar: data.avatar || (data.role === 'driver' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'),
      isVerified: data.role === 'customer',
      city: data.city || 'Tinsukia, Assam',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('superfast_token');
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

