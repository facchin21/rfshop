export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

export type Barber = {
  id: string;
  name: string;
  specialty: string;
};

export type Shop = {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  accent: string;
  monogram: string;
  tagline: string;
  about: string;
  openHour: number;
  closeHour: number;
  closedWeekdays: number[];
  services: Service[];
  barbers: Barber[];
};

export type BookingStatus = 'confirmed' | 'cancelled';

export type Booking = {
  id: string;
  shopId: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  guestName: string;
  status: BookingStatus;
  createdAt: string;
};

export type BookingView = Booking & {
  shopName: string;
  address: string;
  neighborhood: string;
  serviceName: string;
  barberName: string;
  price: number;
  durationMin: number;
};

export type TimeSlot = {
  time: string;
  barberIds: string[];
};

export type Availability = {
  date: string;
  closed: boolean;
  slots: TimeSlot[];
  reason: 'ok' | 'closed' | 'past' | 'full';
};

export type ShopFilters = {
  query?: string;
  neighborhood?: string;
};

export type BookingInput = {
  shopId?: string;
  serviceId?: string;
  barberId?: string;
  date?: string;
  time?: string;
  guestName?: string;
};

export type BookingResult =
  | { ok: true; booking: BookingView }
  | { ok: false; status: number; error: string };
