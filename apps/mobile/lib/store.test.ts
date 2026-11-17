import { createHandlers } from './handlers';
import { createStore } from './store';

const THURSDAY_NOON = new Date('2026-11-19T15:00:00.000Z');
const THURSDAY_NIGHT = new Date('2026-11-20T00:30:00.000Z');

function storeAt(now: Date, seed = false) {
  return createStore({ seed, now: () => now });
}

describe('barberías', () => {
  it('busca por barrio, servicio y sin acentos', () => {
    const store = storeAt(THURSDAY_NOON);
    expect(store.listShops({ query: 'palermo' })).toHaveLength(1);
    expect(store.listShops({ query: 'barba' })).toHaveLength(6);
    expect(store.listShops({ neighborhood: 'San Telmo' })[0]?.id).toBe('old-school');
    expect(store.listShops({ query: 'rivadavia', neighborhood: 'Palermo' })).toHaveLength(0);
  });
});

describe('disponibilidad', () => {
  it('cierra el domingo y ofrece a los barberos libres', () => {
    const store = storeAt(THURSDAY_NOON);
    const sunday = store.availability('rivadavia', '2026-11-22', 'corte');
    expect(sunday?.closed).toBe(true);
    expect(sunday?.reason).toBe('closed');
    expect(sunday?.slots).toHaveLength(0);

    const thursday = store.availability('rivadavia', '2026-11-19', 'corte');
    const slot = thursday?.slots.find((item) => item.time === '17:15');
    expect(slot?.barberIds).toEqual(['martin', 'luisa']);
    expect(thursday?.slots.some((item) => item.time === '11:00')).toBe(false);
    expect(thursday?.slots.some((item) => item.time === '19:45')).toBe(false);

    const afterClose = storeAt(THURSDAY_NIGHT).availability('rivadavia', '2026-11-19', 'corte');
    expect(afterClose?.reason).toBe('past');
    expect(afterClose?.slots).toHaveLength(0);
  });

  it('bloquea solo al barbero ocupado durante la duración del servicio', () => {
    const store = storeAt(THURSDAY_NOON);
    const created = store.createBooking({
      shopId: 'rivadavia',
      serviceId: 'combo',
      barberId: 'martin',
      date: '2026-11-19',
      time: '17:00',
      guestName: 'Ana',
    });
    expect(created.ok).toBe(true);

    const martin = store.availability('rivadavia', '2026-11-19', 'corte', 'martin');
    const luisa = store.availability('rivadavia', '2026-11-19', 'corte', 'luisa');
    expect(martin?.slots.some((item) => item.time === '17:15')).toBe(false);
    expect(martin?.slots.some((item) => item.time === '18:00')).toBe(true);
    expect(luisa?.slots.some((item) => item.time === '17:15')).toBe(true);
  });
});

describe('reservas', () => {
  it('confirma, rechaza el turno ocupado y lo libera al cancelar', async () => {
    const store = storeAt(THURSDAY_NOON);
    const handlers = createHandlers(store);
    const response = await handlers.createBooking({
      shopId: 'norte',
      serviceId: 'fade',
      barberId: 'nico',
      date: '2026-11-19',
      time: '18:00',
      guestName: '  Ana  ',
    });
    expect(response.status).toBe(201);
    const body = (await response.json()) as { booking: { id: string; guestName: string } };
    expect(body.booking.guestName).toBe('Ana');

    const conflict = store.createBooking({
      shopId: 'norte',
      serviceId: 'corte',
      barberId: 'nico',
      date: '2026-11-19',
      time: '18:15',
      guestName: 'Leo',
    });
    expect(conflict.ok).toBe(false);
    if (!conflict.ok) {
      expect(conflict.status).toBe(409);
    }

    const cancelled = await handlers.cancelBooking(body.booking.id);
    expect(cancelled.status).toBe(200);
    const again = store.createBooking({
      shopId: 'norte',
      serviceId: 'corte',
      barberId: 'nico',
      date: '2026-11-19',
      time: '18:15',
      guestName: 'Leo',
    });
    expect(again.ok).toBe(true);
  });

  it('rechaza horarios pasados, días cerrados y nombres vacíos', () => {
    const store = storeAt(THURSDAY_NOON);
    const past = store.createBooking({
      shopId: 'rivadavia',
      serviceId: 'corte',
      barberId: 'martin',
      date: '2026-11-19',
      time: '11:00',
      guestName: 'Ana',
    });
    expect(past.ok).toBe(false);

    const closed = store.createBooking({
      shopId: 'rivadavia',
      serviceId: 'corte',
      barberId: 'martin',
      date: '2026-11-22',
      time: '12:00',
      guestName: 'Ana',
    });
    expect(closed.ok).toBe(false);
    if (!closed.ok) {
      expect(closed.error).toMatch(/no abre/);
    }

    const nameless = store.createBooking({
      shopId: 'rivadavia',
      serviceId: 'corte',
      barberId: 'martin',
      date: '2026-11-19',
      time: '18:00',
      guestName: ' ',
    });
    expect(nameless.ok).toBe(false);
  });

  it('deja una reserva de ejemplo en el próximo jueves a las 17:15', () => {
    const midday = storeAt(THURSDAY_NOON, true).listBookings()[0];
    expect(midday?.date).toBe('2026-11-19');
    expect(midday?.time).toBe('17:15');
    expect(midday?.shopName).toBe('Barber Rivadavia');

    const evening = storeAt(THURSDAY_NIGHT, true).listBookings()[0];
    expect(evening?.date).toBe('2026-11-26');
  });
});
