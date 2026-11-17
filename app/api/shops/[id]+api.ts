import { getShop } from '@/lib/handlers';

export function GET(_request: Request, params: { id?: string }) {
  return getShop(params.id);
}
