import { availabilityFor } from './availability';
import { SHOPS } from './shops';
import { isPastSlot, toMinutes, upcomingDate } from './time';
import type { Booking, BookingInput, BookingResult, BookingView, ShopFilters } from './types';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function viewOf(booking: Booking): BookingView | null {
  const shop = SHOPS.find((item) => item.id === booking.shopId);
  const service = shop?.services.find((item) => item.id === booking.serviceId);
  const barber = shop?.barbers.find((item) => item.id === booking.barberId);
  if (!shop || !service || !barber) {
    return null;
  }
  return {
    ...booking,
    shopName: shop.name,
    address: shop.address,
    neighborhood: shop.neighborhood,
    serviceName: service.name,
    barberName: barber.name,
    price: service.price,
    durationMin: service.durationMin,
  };
}

function compareBookings(a: Booking, b: Booking) {
  const byDate = a.date.localeCompare(b.date) || toMinutes(a.time) - toMinutes(b.time);
  return byDate;
}

export type Store = ReturnType<typeof createStore>;

export function createStore(options?: { seed?: boolean; now?: () => Date; bookings?: Booking[] }) {
  const now = options?.now ?? (() => new Date());
  const bookings: Booking[] = options?.bookings ? [...options.bookings] : [];

  if (options?.seed && bookings.length === 0) {
    const clock = now();
    bookings.push({
      id: 'seed-rivadavia',
      shopId: 'rivadavia',
      serviceId: 'corte',
      barberId: 'martin',
      date: upcomingDate(clock, 4, '17:15'),
      time: '17:15',
      guestName: 'Alex',
      status: 'confirmed',
      createdAt: clock.toISOString(),
    });
  }

  return {
    listShops(filters: ShopFilters = {}) {
      const query = filters.query ? normalize(filters.query.trim()) : '';
      const neighborhood = filters.neighborhood ? normalize(filters.neighborhood.trim()) : '';

      return SHOPS.filter((shop) => {
        if (neighborhood && normalize(shop.neighborhood) !== neighborhood) {
          return false;
        }
        if (!query) {
          return true;
        }
        const haystack = [
          shop.name,
          shop.neighborhood,
          shop.city,
          shop.address,
          shop.tagline,
          ...shop.services.map((service) => service.name),
          ...shop.barbers.map((barber) => barber.name),
        ]
          .map(normalize)
          .join(' ');
        return haystack.includes(query);
      });
    },

    getShop(id: string) {
      return SHOPS.find((shop) => shop.id === id) ?? null;
    },

    availability(shopId: string, date: string, serviceId: string, barberId?: string) {
      const shop = this.getShop(shopId);
      if (!shop) {
        return null;
      }
      const result = availabilityFor(shop, date, serviceId, bookings, now());
      if (!barberId) {
        return result;
      }
      return {
        ...result,
        slots: result.slots
          .filter((slot) => slot.barberIds.includes(barberId))
          .map((slot) => ({ time: slot.time, barberIds: [barberId] })),
      };
    },

    listBookings() {
      return bookings
        .map(viewOf)
        .filter((booking): booking is BookingView => booking !== null && booking.status === 'confirmed')
        .sort(compareBookings);
    },

    createBooking(input: BookingInput): BookingResult {
      const shop = input.shopId ? this.getShop(input.shopId) : null;
      const service = shop?.services.find((item) => item.id === input.serviceId);
      const barber = shop?.barbers.find((item) => item.id === input.barberId);
      const guestName = input.guestName?.trim() ?? '';

      if (!shop || !service || !barber) {
        return { ok: false, status: 400, error: 'Elegí barbería, servicio y barbero.' };
      }
      if (!input.date || !DATE.test(input.date) || !input.time || !TIME.test(input.time)) {
        return { ok: false, status: 400, error: 'Elegí un día y un horario válidos.' };
      }
      if (guestName.length < 2) {
        return { ok: false, status: 400, error: 'Decinos tu nombre para la reserva.' };
      }

      const clock = now();
      if (isPastSlot(input.date, input.time, clock)) {
        return { ok: false, status: 400, error: 'Ese horario ya pasó.' };
      }

      const slots = this.availability(shop.id, input.date, service.id, barber.id);
      const available = slots?.slots.some((slot) => slot.time === input.time);
      if (!slots || slots.closed) {
        return { ok: false, status: 400, error: 'El local no abre ese día.' };
      }
      if (!available) {
        return { ok: false, status: 409, error: 'Ese turno acaba de ocuparse. Elegí otro horario.' };
      }

      const booking: Booking = {
        id: `bk_${clock.getTime().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        shopId: shop.id,
        serviceId: service.id,
        barberId: barber.id,
        date: input.date,
        time: input.time,
        guestName,
        status: 'confirmed',
        createdAt: clock.toISOString(),
      };
      bookings.push(booking);
      const view = viewOf(booking);
      if (!view) {
        return { ok: false, status: 500, error: 'No pudimos guardar la reserva.' };
      }
      return { ok: true, booking: view };
    },

    cancelBooking(id: string): BookingResult {
      const booking = bookings.find((item) => item.id === id);
      if (!booking || booking.status !== 'confirmed') {
        return { ok: false, status: 404, error: 'No encontramos esa reserva.' };
      }
      booking.status = 'cancelled';
      const view = viewOf(booking);
      if (!view) {
        return { ok: false, status: 500, error: 'No pudimos cancelar la reserva.' };
      }
      return { ok: true, booking: view };
    },
  };
}

const STORE_KEY = '__rfshopStore';

export function getStore() {
  const globalStore = globalThis as typeof globalThis & { [STORE_KEY]?: Store };
  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = createStore({ seed: true });
  }
  return globalStore[STORE_KEY];
}
