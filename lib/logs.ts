// Ficheiro: lib/logs.ts

let logs: string[] = [];

export function criarLog(mensagem: string) {
  const timestamp = new Date().toISOString();
  logs.push(`[${timestamp}] ${mensagem}`);
}

// Mock inicial (caso queiras testar)
logs.push("[2025-07-06 12:01] Sistema iniciado.");
logs.push("[2025-07-06 12:02] Conexão estabelecida com MongoDB.");
logs.push("[2025-07-06 12:03] Leitura de sensor: Temperatura = 22ºC.");

export function obterLogs(): string[] {
  return logs;
}

export function limparLogs() {
  logs = [];
}
