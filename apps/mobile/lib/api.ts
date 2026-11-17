import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { Availability, BookingInput, BookingView, Shop } from './types';

function apiBase() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'web') {
    return '';
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri}`;
  }
  return 'http://localhost:8081';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'No pudimos completar la solicitud.');
  }
  return data;
}

export function fetchShops(query: string, neighborhood: string) {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set('q', query.trim());
  }
  if (neighborhood) {
    params.set('neighborhood', neighborhood);
  }
  const queryString = params.toString();
  const suffix = queryString ? `?${queryString}` : '';
  return request<{ shops: Shop[] }>(`/api/shops${suffix}`);
}

export function fetchShop(id: string) {
  return request<{ shop: Shop }>(`/api/shops/${id}`);
}

export function fetchAvailability(id: string, date: string, serviceId: string, barberId: string) {
  const params = new URLSearchParams({ date, serviceId, barberId });
  return request<Availability>(`/api/shops/${id}/availability?${params.toString()}`);
}

export function fetchBookings() {
  return request<{ bookings: BookingView[] }>('/api/bookings');
}

export function createReservation(input: BookingInput) {
  return request<{ booking: BookingView }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function cancelReservation(id: string) {
  return request<{ booking: BookingView }>(`/api/bookings/${id}`, { method: 'DELETE' });
}
