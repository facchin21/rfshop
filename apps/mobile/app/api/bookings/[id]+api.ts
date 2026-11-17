import { cancelBooking } from '@/lib/handlers';

export function DELETE(_request: Request, params: { id?: string }) {
  return cancelBooking(params.id);
}
