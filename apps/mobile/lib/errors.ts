export function errorMessage(data: unknown, fallback = 'No pudimos completar la solicitud.') {
  if (Array.isArray(data)) {
    const lines = data.map((item) => String(item)).filter(Boolean);
    return lines.length > 0 ? lines.join('\n') : fallback;
  }
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}
