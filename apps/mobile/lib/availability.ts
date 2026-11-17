import { fromMinutes, isPastSlot, toMinutes, weekdayIndex } from './time';
import type { Availability, Booking, Shop } from './types';

const SLOT_STEP_MIN = 15;

export function intervalsOverlap(startA: number, durationA: number, startB: number, durationB: number) {
  return startA < startB + durationB && startB < startA + durationA;
}

export function availabilityFor(shop: Shop, date: string, serviceId: string, bookings: Booking[], now = new Date()): Availability {
  const service = shop.services.find((item) => item.id === serviceId);
  if (!service) {
    return { date, closed: false, slots: [], reason: 'full' };
  }

  if (shop.closedWeekdays.includes(weekdayIndex(date))) {
    return { date, closed: true, slots: [], reason: 'closed' };
  }

  const dayBookings = bookings.filter(
    (booking) => booking.status === 'confirmed' && booking.shopId === shop.id && booking.date === date,
  );

  const open = shop.openHour * 60;
  const close = shop.closeHour * 60;
  const slots = [];
  let pastCount = 0;
  let upcomingCount = 0;

  for (let start = open; start + service.durationMin <= close; start += SLOT_STEP_MIN) {
    const time = fromMinutes(start);
    if (isPastSlot(date, time, now)) {
      pastCount += 1;
      continue;
    }
    upcomingCount += 1;

    const barberIds = shop.barbers
      .filter((barber) => {
        return !dayBookings.some((booking) => {
          if (booking.barberId !== barber.id) {
            return false;
          }
          const bookedService = shop.services.find((item) => item.id === booking.serviceId);
          const duration = bookedService?.durationMin ?? 30;
          return intervalsOverlap(start, service.durationMin, toMinutes(booking.time), duration);
        });
      })
      .map((barber) => barber.id);

    if (barberIds.length > 0) {
      slots.push({ time, barberIds });
    }
  }

  if (slots.length > 0) {
    return { date, closed: false, slots, reason: 'ok' };
  }
  if (pastCount > 0 && upcomingCount === 0) {
    return { date, closed: false, slots, reason: 'past' };
  }
  return { date, closed: false, slots, reason: 'full' };
}
