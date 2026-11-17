import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { errorMessage } from './errors';
import { getAuthToken } from './session';
import type { Account, RegisterInput, Role, Shop, ShopInput, Slot } from './types';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function apiBase() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:8080`;
  }
  return 'http://localhost:8080';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(data));
  }
  return data as T;
}

export function login(email: string, password: string) {
  return request<{ token: string; createdAt: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerAccount(input: RegisterInput) {
  return request<Account>('/api/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function fetchRoles() {
  return request<Role[]>('/api/roles');
}

export function fetchMe() {
  return request<Account>('/api/me');
}

export function fetchShops() {
  return request<Shop[]>('/api/barber-shops');
}

export function fetchShop(id: number | string) {
  return request<Shop>(`/api/barber-shops/${id}`);
}

export function fetchMonthSlots(shopId: number | string, month: number) {
  return request<Slot[]>(`/api/bookings/barber-shop/${shopId}/month/${month}`);
}

export function reserveSlot(id: number) {
  return request<Slot>(`/api/bookings/${id}`, { method: 'PATCH' });
}

export function fetchMyBookings() {
  return request<Slot[]>('/api/me/bookings');
}

export function fetchMyShops() {
  return request<Shop[]>('/api/me/barber-shops');
}

export function createShop(input: ShopInput) {
  return request<Shop>('/api/barber-shops', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function publishSlots(shopId: number, slots: { bookingStart: string; bookingEnd: string }[]) {
  return request<Slot[]>(`/api/bookings/barber-shop/${shopId}`, {
    method: 'POST',
    body: JSON.stringify(slots),
  });
}
