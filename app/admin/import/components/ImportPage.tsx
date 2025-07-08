"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Papa from "papaparse";

type ImportedRecord = {
  _id: string;
  temperature: number;
  humidity: number;
  co2: number;
  tvoc: number;
  lastModified: string;
};

export function ImportPage() {
  const [data, setData] = useState<ImportedRecord[]>([]);
  const [fileName, setFileName] = useState("");

  const validateRecord = (record: any): boolean => {
    const requiredFields = ["_id", "temperature", "humidity", "co2", "tvoc", "lastModified"];
    for (const field of requiredFields) {
      if (!(field in record)) return false;
    }

    return (
      !isNaN(Number(record.temperature)) &&
      !isNaN(Number(record.humidity)) &&
      !isNaN(Number(record.co2)) &&
      !isNaN(Number(record.tvoc))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (file.type === "application/json") {
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          const records = Array.isArray(json) ? json : [json];
          const valid = records.every(validateRecord);

          if (!valid) {
            toast.error("Dados inválidos no ficheiro JSON.");
            return;
          }

          setData(records);
        } catch (err) {
          toast.error("JSON inválido.");
        }
      };
      reader.readAsText(file);
    } else if (file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsed = result.data as any[];
          const valid = parsed.every(validateRecord);

          if (!valid) {
            toast.error("Dados inválidos no ficheiro CSV.");
            return;
          }

          setData(parsed);
        },
      });
    } else {
      toast.error("Formato de ficheiro não suportado.");
    }
  };

  const handleImport = () => {
    console.log("Importing data:", data);
    toast.success("Importação concluída com sucesso.");
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Importar Dados</h1>

      <input
        type="file"
        accept=".json, .csv"
        onChange={handleFileUpload}
        className="block w-full border rounded-md p-2"
      />

      {fileName && (
        <p className="text-sm text-muted-foreground">
          Ficheiro selecionado: <strong>{fileName}</strong>
        </p>
      )}

      {data.length > 0 && (
        <Card>
          <CardContent className="p-4 overflow-auto max-h-[500px]">
            <pre className="text-sm bg-muted rounded-md p-3">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {data.length > 0 && (
        <Button onClick={handleImport}>Importar para a Base de Dados</Button>
      )}
    </div>
  );
}
export default ImportPage