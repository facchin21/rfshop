import { getStore, type Store } from './store';
import type { BookingInput } from './types';

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function createHandlers(store: Store) {
  return {
    listShops(url: URL) {
      const query = url.searchParams.get('q') ?? undefined;
      const neighborhood = url.searchParams.get('neighborhood') ?? undefined;
      const shops = store.listShops({ query, neighborhood });
      return json({ shops });
    },

    getShop(id?: string) {
      if (!id) {
        return json({ error: 'Falta la barbería.' }, 400);
      }
      const shop = store.getShop(id);
      if (!shop) {
        return json({ error: 'No encontramos esa barbería.' }, 404);
      }
      return json({ shop });
    },

    availability(id: string | undefined, url: URL) {
      if (!id) {
        return json({ error: 'Falta la barbería.' }, 400);
      }
      const date = url.searchParams.get('date') ?? '';
      const serviceId = url.searchParams.get('serviceId') ?? '';
      const barberId = url.searchParams.get('barberId') ?? undefined;
      if (!date || !serviceId) {
        return json({ error: 'Elegí día y servicio.' }, 400);
      }
      const availability = store.availability(id, date, serviceId, barberId);
      if (!availability) {
        return json({ error: 'No encontramos esa barbería.' }, 404);
      }
      return json(availability);
    },

    listBookings() {
      return json({ bookings: store.listBookings() });
    },

    createBooking(input: BookingInput | null) {
      if (!input || typeof input !== 'object') {
        return json({ error: 'La reserva está incompleta.' }, 400);
      }
      const result = store.createBooking(input);
      if (!result.ok) {
        return json({ error: result.error }, result.status);
      }
      return json({ booking: result.booking }, 201);
    },

    cancelBooking(id?: string) {
      if (!id) {
        return json({ error: 'Falta la reserva.' }, 400);
      }
      const result = store.cancelBooking(id);
      if (!result.ok) {
        return json({ error: result.error }, result.status);
      }
      return json({ booking: result.booking });
    },
  };
}

function handlers() {
  return createHandlers(getStore());
}

export function listShops(url: URL) {
  return handlers().listShops(url);
}

export function getShop(id?: string) {
  return handlers().getShop(id);
}

export function availability(id: string | undefined, url: URL) {
  return handlers().availability(id, url);
}

export function listBookings() {
  return handlers().listBookings();
}

export function createBooking(input: BookingInput | null) {
  return handlers().createBooking(input);
}

export function cancelBooking(id?: string) {
  return handlers().cancelBooking(id);
}
