import { createBooking, listBookings } from '@/lib/handlers';
import type { BookingInput } from '@/lib/types';

export function GET() {
  return listBookings();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as BookingInput | null;
  return createBooking(body);
}
