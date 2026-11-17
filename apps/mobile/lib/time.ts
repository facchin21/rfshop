const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const BUENOS_AIRES_OFFSET_MS = 3 * 60 * 60 * 1000;

export function buenosAiresParts(date: Date) {
  const shifted = new Date(date.getTime() - BUENOS_AIRES_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),
  };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function todayISO(now = new Date()) {
  const parts = buenosAiresParts(now);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayIndex(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function nextWeekdayOnOrAfter(iso: string, weekday: number) {
  const delta = (weekday - weekdayIndex(iso) + 7) % 7;
  return addDays(iso, delta);
}

export function toMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function fromMinutes(total: number) {
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

export function isPastSlot(iso: string, time: string, now = new Date()) {
  const [hour, minute] = time.split(':').map(Number);
  const [year, month, day] = iso.split('-').map(Number);
  const slotUtc = Date.UTC(year, month - 1, day, hour + 3, minute, 0);
  return slotUtc <= now.getTime();
}

export function upcomingDate(now: Date, weekday: number, time: string) {
  const today = todayISO(now);
  let date = nextWeekdayOnOrAfter(today, weekday);
  if (isPastSlot(date, time, now)) {
    date = addDays(date, 7);
  }
  return date;
}

export function formatAppointment(iso: string, time: string) {
  const day = Number(iso.slice(8, 10));
  const month = MONTHS[Number(iso.slice(5, 7)) - 1];
  const weekday = WEEKDAYS[weekdayIndex(iso)];
  const label = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day} de ${month}`;
  return `${label} · ${time}`;
}

export function formatDayChip(iso: string, now = new Date()) {
  if (iso === todayISO(now)) {
    return { label: 'Hoy', day: iso.slice(8, 10) };
  }
  return {
    label: WEEKDAYS_SHORT[weekdayIndex(iso)],
    day: iso.slice(8, 10),
  };
}

export function upcomingDates(count: number, now = new Date()) {
  const today = todayISO(now);
  return Array.from({ length: count }, (_, index) => addDays(today, index));
}
