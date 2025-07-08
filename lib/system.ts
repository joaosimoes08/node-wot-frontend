import os from "os";

export function getSystemInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: formatUptime(os.uptime()),
  };
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
