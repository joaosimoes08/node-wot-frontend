// lib/callBackend.ts
export async function callBackend<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const BACK_API_URL = process.env.BACK_API_URL;
  const BACK_API_KEY = process.env.BACK_API_KEY;

  if (!BACK_API_URL || !BACK_API_KEY) {
    throw new Error('BACK_API_URL ou BACK_API_KEY não estão definidas');
  }

  const res = await fetch(`${BACK_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BACK_API_KEY,
      ...(options.headers || {}),
    },
    cache: 'no-store', // força a não usar cache
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao chamar API: ${res.status} - ${text}`);
  }

  return res.json();
}
