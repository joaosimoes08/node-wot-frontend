'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SensorActions() {
  const [page, setPage] = useState(0);

  const actions = [
    {
      label: 'Ligar Motor',
      content: (
        <div className="flex flex-col items-center justify-center gap-4">
          <Select>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecionar sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="esp32-a">ESP32-A</SelectItem>
              <SelectItem value="esp32-b">ESP32-B</SelectItem>
              <SelectItem value="esp32-c">ESP32-C</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-2">
            <Button variant="default">Ligar</Button>
            <Button variant="secondary">Desligar</Button>
            <Button variant="destructive">Reiniciar</Button>
          </div>
        </div>
      ),
    },
    {
      label: 'Comando Direto',
      content: (
        <div className="text-sm text-muted-foreground text-center">
          Em breve: interface para envio direto de comandos.
        </div>
      ),
    },
    {
      label: 'Ver Estado',
      content: (
        <div className="text-sm text-muted-foreground text-center">
          Em breve: ver estado atual de cada sensor.
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between items-center text-center p-4">
      <h2 className="font-semibold text-lg mb-2">{actions[page].label}</h2>

      <div className="flex-1 flex items-center justify-center w-full">
        {actions[page].content}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((prev) => (prev === 0 ? actions.length - 1 : prev - 1))}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((prev) => (prev === actions.length - 1 ? 0 : prev + 1))}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
export default SensorActions