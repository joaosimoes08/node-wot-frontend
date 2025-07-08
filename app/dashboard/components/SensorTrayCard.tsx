'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FaTemperatureHigh, FaTint, FaLungs, FaLeaf } from 'react-icons/fa'
import TrayFoodSelector from './TrayFoodSelector'
import { useState } from 'react'

interface SensorTrayCardProps {
  trayNumber: number
  data: {
    temperature: number
    humidity: number
    co2: number
    tvoc: number
  }
}

export function SensorTrayCard({ trayNumber, data }: SensorTrayCardProps) {
  const [selectedFood, setSelectedFood] = useState('')
  return (
    <Card className="w-full h-fit p-2 text-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-medium">Tabuleiro {trayNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-2 pb-2">
        <Label className="flex items-center gap-2">
          <FaTemperatureHigh /> Temperatura:{' '}
          <span className={`ml-auto ${data.temperature > 40 ? 'text-red-500' : 'text-green-600'}`}>
            {data.temperature} ºC
          </span>
        </Label>
        <Label className="flex items-center gap-2">
          <FaTint /> Humidade:
          <span className="ml-auto">{data.humidity} %</span>
        </Label>
        <Label className="flex items-center gap-2">
          <FaLungs /> CO₂:
          <span className={`ml-auto ${data.co2 > 1000 ? 'text-red-500' : 'text-green-600'}`}>
            {data.co2} ppm
          </span>
        </Label>
        <Label className="flex items-center gap-2">
          <FaLeaf /> TVOC:
          <span className="ml-auto text-green-600">{data.tvoc} ppb</span>
        </Label>

        <div className="pt-2">
          <TrayFoodSelector
            value={selectedFood}
            onChange={(v) => setSelectedFood(v)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
export default SensorTrayCard