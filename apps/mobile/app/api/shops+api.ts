import { listShops } from '@/lib/handlers';

export function GET(request: Request) {
  return listShops(new URL(request.url));
}
