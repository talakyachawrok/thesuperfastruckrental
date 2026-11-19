import { Truck, LoadRequest, DriverOffer, Booking, PlatformStats, User, UserRole } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('superfast_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Health & Database Diagnostics
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse<{
        success: boolean;
        database: { connected: boolean; status: string; message: string };
      }>(res);
    } catch {
      return null;
    }
  },

  // Auth Endpoints
  async register(data: { name: string; email: string; role: UserRole; phone: string; companyName?: string; city?: string; password?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleResponse<{ success: boolean; token: string; user: User }>(res);
    if (result.token) localStorage.setItem('superfast_token', result.token);
    return result;
  },

  async login(email: string, role?: UserRole, password?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password }),
    });
    const result = await handleResponse<{ success: boolean; token: string; user: User }>(res);
    if (result.token) localStorage.setItem('superfast_token', result.token);
    return result;
  },

  async demoLogin(role: UserRole) {
    const res = await fetch(`${API_BASE}/auth/demo/${role}`, {
      method: 'POST',
    });
    const result = await handleResponse<{ success: boolean; token: string; user: User }>(res);
    if (result.token) localStorage.setItem('superfast_token', result.token);
    return result;
  },

  // Trucks
  async getTrucks(params?: Record<string, any>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/trucks${qs}`);
    return await handleResponse<{ success: boolean; count: number; data: Truck[] }>(res);
  },

  async getTruckById(id: string) {
    const res = await fetch(`${API_BASE}/trucks/${id}`);
    return await handleResponse<{ success: boolean; data: Truck }>(res);
  },

  async createTruck(truckData: Partial<Truck>) {
    const res = await fetch(`${API_BASE}/trucks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(truckData),
    });
    return await handleResponse<{ success: boolean; data: Truck }>(res);
  },

  async toggleTruckAvailability(id: string) {
    const res = await fetch(`${API_BASE}/trucks/${id}/availability`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; data: Truck }>(res);
  },

  // Load Requests
  async getLoads(params?: Record<string, any>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/loads${qs}`);
    return await handleResponse<{ success: boolean; count: number; data: LoadRequest[] }>(res);
  },

  async createLoad(loadData: Partial<LoadRequest>) {
    const res = await fetch(`${API_BASE}/loads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(loadData),
    });
    return await handleResponse<{ success: boolean; data: LoadRequest }>(res);
  },

  // Driver Offers
  async getOffers(params?: Record<string, any>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/offers${qs}`);
    return await handleResponse<{ success: boolean; count: number; data: DriverOffer[] }>(res);
  },

  async submitOffer(offerData: Partial<DriverOffer>) {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(offerData),
    });
    return await handleResponse<{ success: boolean; data: DriverOffer }>(res);
  },

  async acceptOffer(offerId: string) {
    const res = await fetch(`${API_BASE}/offers/${offerId}/accept`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; data: { offer: DriverOffer; booking: Booking } }>(res);
  },

  async rejectOffer(offerId: string) {
    const res = await fetch(`${API_BASE}/offers/${offerId}/reject`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; data: DriverOffer }>(res);
  },

  // Bookings
  async getBookings(params?: Record<string, any>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/bookings${qs}`);
    return await handleResponse<{ success: boolean; count: number; data: Booking[] }>(res);
  },

  async createDirectBooking(truckId: string, bookingDetails: any) {
    const res = await fetch(`${API_BASE}/bookings/direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ truckId, bookingDetails }),
    });
    return await handleResponse<{ success: boolean; data: Booking }>(res);
  },

  async updateBookingMilestone(bookingId: string, nextMilestoneStep: number) {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/milestone`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ nextMilestoneStep }),
    });
    return await handleResponse<{ success: boolean; data: Booking }>(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; data: PlatformStats & { totalGMV: number; platformRevenue: number } }>(res);
  },

  async getPendingDrivers() {
    const res = await fetch(`${API_BASE}/admin/pending-drivers`, {
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; data: any[] }>(res);
  },

  async approveDriver(id: string, name: string) {
    const res = await fetch(`${API_BASE}/admin/approve-driver/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name }),
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  },

  async resetSeed() {
    const res = await fetch(`${API_BASE}/admin/reset-seed`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  },
};

