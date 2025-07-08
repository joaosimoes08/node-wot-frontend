"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LogEntry {
  timestamp: string;
  message: string;
}

interface Props {
  systemInfo: {
    hostname: string;
    platform: string;
    uptime: string;
  };
}

export function SettingsPage({ systemInfo }: Props) {
  const [format, setFormat] = useState<"txt" | "json">("txt");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/proxy?path=/api/logs/`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_BACK_API_KEY || "",
          },
        });
        if (!res.ok) throw new Error("Erro ao obter logs");
        const data: LogEntry[] = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("[Erro ao buscar logs]", error);
        toast.error("Erro ao buscar logs");
      }
    };

    fetchLogs();
  }, []);

  const exportLogs = async () => {
    try {
      const res = await fetch(
        `/api/proxy?path=/api/logs/export&format=${format}`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_BACK_API_KEY || "",
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao exportar logs");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logs.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Logs exportados como ${format.toUpperCase()}`);
    } catch (error) {
      console.error("[Erro na exportação]", error);
      toast.error("Erro ao exportar logs");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Informações do Sistema</h2>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p><strong>Hostname:</strong> {systemInfo.hostname}</p>
          <p><strong>Plataforma:</strong> Next.JS 15.3</p>
          <p><strong>Tempo de Atividade:</strong> {systemInfo.uptime}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold">Logs do Sistema</h2>
      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[200px] font-mono text-xs"
            value={
              logs.length > 0
                ? logs
                    .map((log) => `[${new Date(log.timestamp).toLocaleString()}] ${log.message}`)
                    .join("\n")
                : "Sem logs disponíveis."
            }
            readOnly
          />
          <div className="mt-4 flex items-center gap-4">
            <Select onValueChange={(v) => setFormat(v as "txt" | "json")} defaultValue="txt">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportLogs}>Exportar Logs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
