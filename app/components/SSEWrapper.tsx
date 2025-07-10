'use client';

import { useSSE } from "@/hooks/useSSE";

export default function SSEWrapper() {
  useSSE();
  return null; // não precisa renderizar nada
}
