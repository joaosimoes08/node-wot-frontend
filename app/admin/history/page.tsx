'use client'

import { useEffect, useState } from 'react'
import SensorHistoryChart from './components/SensorHistoryChart'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MEASURES = ['Todas', 'Temperatura', 'Humidade', 'CO2', 'TVOC']
const TIME_RANGES = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias']

export default function HistoryPage() {
  const [selectedMeasure, setSelectedMeasure] = useState('Todas')
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hoje')
  const [currentPage, setCurrentPage] = useState(0)
  const [sensors, setSensors] = useState<string[]>([])

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch('/api/proxy?path=/api/sensors/ids')
        const result = await res.json()
        setSensors(result.map((s: any) => s.sensorId))
      } catch (err) {
        console.error('Erro ao buscar sensores', err)
      }
    }

    fetchSensors()
  }, [])

  const sensorsPerPage = 4
  const startIndex = currentPage * sensorsPerPage
  const paginatedSensors = sensors.slice(startIndex, startIndex + sensorsPerPage)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Histórico dos Sensores</h2>
        <div className="flex gap-4">
          <Select value={selectedMeasure} onValueChange={setSelectedMeasure}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo de dado" />
            </SelectTrigger>
            <SelectContent>
              {MEASURES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Intervalo de tempo" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedSensors.map((sensorId) => (
          <SensorHistoryChart
            key={sensorId}
            sensorId={sensorId}
            selectedMeasure={selectedMeasure}
            selectedTimeRange={selectedTimeRange}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0}>
          ←
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={startIndex + sensorsPerPage >= sensors.length}
        >
          →
        </Button>
      </div>
    </div>
  )
}
