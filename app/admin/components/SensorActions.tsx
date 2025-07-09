'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SensorActions() {
  const [page, setPage] = useState(0);
  const [selectedSensor, setSelectedSensor] = useState('');

  const handleCurrentData = async () => {
    if (!selectedSensor) {
      console.error("Nenhum sensor selecionado!");
      return;
    }

    const sensorId = selectedSensor.replace("wot:dev:", "");

    try {
      const res = await fetch(`https://api.buffetanalyzer.systems/api/wot/getCurrentData`, {
        method: 'GET',
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`Erro ${res.status}: ${text}`);
        return;
      }

      const data = await res.json();
      console.log("Dados recebidos:", data);
    } catch (e) {
      console.error("Falhei:", e.message || e);
    }
  };


  const handleCloseBuffet = async () => {

      try {

        const res = await fetch(`https://api.buffetanalyzer.systems/api/wot/closeBuffet`, {
          method: 'POST',
        })

        if (!res.ok) throw new Error()

        console.log(`Comando 'closeBuffet' enviado com sucesso!`)
      } catch (e) {
        console.error("Falhei")
      }
  }

    const handleOpenBuffet = async () => {

      try {

        const res = await fetch(`https://api.buffetanalyzer.systems/api/wot/openBuffet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) throw new Error()

        console.log(`Comando 'openBuffet' enviado com sucesso!`)
      } catch (e) {
        console.error("Falhei")
      }
  }

  const actions = [
    {
      label: 'Receber Dados Recentes',
      content: (
        <div className="flex flex-col items-center justify-center gap-4">
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecionar sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wot:dev:buffet-food-quality-analyzer-01">wot:dev:buffet-food-quality-analyzer-01</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-2">
            <Button variant="default" onClick={handleCurrentData}>Pedir</Button>
          </div>
        </div>
      ),
    },
    {
      label: 'Fechar Buffet',
      content: (
        <div className="flex flex-col items-center justify-center gap-4">
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecionar sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wot:dev:buffet-food-quality-analyzer-01">wot:dev:buffet-food-quality-analyzer-01</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-2">
            <Button variant="default" onClick={handleCloseBuffet}>Fechar</Button>
          </div>
        </div>
      ),
    },
    {
      label: 'Abrir Buffet',
      content: (
        <div className="flex flex-col items-center justify-center gap-4">
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecionar sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wot:dev:buffet-food-quality-analyzer-01">wot:dev:buffet-food-quality-analyzer-01</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-2">
            <Button variant="default" onClick={handleOpenBuffet}>Abrir</Button>
          </div>
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