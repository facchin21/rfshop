import { availability } from '@/lib/handlers';

export function GET(request: Request, params: { id?: string }) {
  return availability(params.id, new URL(request.url));
}
