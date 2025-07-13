'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type SensorHistoryChartProps = {
  sensorId: string
  selectedMeasure: string
  selectedTimeRange: string
}

export function SensorHistoryChart({
  sensorId,
  selectedMeasure,
  selectedTimeRange,
}: SensorHistoryChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/proxy?path=/api/sensors/${sensorId}/data`)
        const result = await res.json()

        const now = new Date()
        let cutoffDate = new Date()

        if (selectedTimeRange === 'Hoje') {
          cutoffDate.setHours(0, 0, 0, 0)
        } else if (selectedTimeRange === 'Últimos 7 dias') {
          cutoffDate.setDate(now.getDate() - 7)
        } else if (selectedTimeRange === 'Últimos 30 dias') {
          cutoffDate.setDate(now.getDate() - 30)
        }
        const filtered = result
          .filter((entry: any) => {
            const entryDate = new Date(entry.timestamp)
            return !isNaN(entryDate.getTime()) && entryDate >= cutoffDate
          })
          .map((entry: any) => ({
            time: new Date(entry.timestamp).toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            temperature: entry.temperature,
            humidity: entry.humidity,
            co2: entry.co2,
            tvoc: entry.tvoc,
          }))

        setData(filtered)
      } catch (err) {
        console.error(`Erro ao buscar dados do sensor ${sensorId}`, err)
      } finally {
        timeout = setTimeout(fetchData, 30000)
      }
    }

    fetchData()
    return () => clearTimeout(timeout)
  }, [sensorId, selectedMeasure, selectedTimeRange])

  const measureKeys = {
    Temperatura: 'temperature',
    Humidade: 'humidity',
    CO2: 'co2',
    TVOC: 'tvoc',
  }

  const measureUnits: Record<string, string> = {
    temperature: '°C',
    humidity: '%RH',
    co2: 'PPM',
    tvoc: 'PPB',
  }


  const renderArea = (key: string, color: string) => (
    <Area key={key} type="monotone" dataKey={key} stroke={color} fill={color} fillOpacity={0.2} />
  )

  const renderAreas = () => {
    if (selectedMeasure !== 'Todas') {
      const key = measureKeys[selectedMeasure as keyof typeof measureKeys]
      return renderArea(key, '#3b82f6')
    }

    return (
      <>
        {renderArea('temperature', '#3b82f6')}
        {renderArea('humidity', '#10b981')}
        {renderArea('co2', '#ef4444')}
        {renderArea('tvoc', '#f59e0b')}
      </>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow text-xs border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => {
            const unit = measureUnits[entry.dataKey] || ''
            return (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.value} {unit}
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }


  return (
    <Card className="w-full h-[280px]">
      <CardHeader>
        <CardTitle>Sensor {sensorId}</CardTitle>
      </CardHeader>
      <CardContent className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="time" tick={{ fontSize: 8 }}/>
            <YAxis
              tick={{ fontSize: 8 }}
              tickFormatter={(value) => {
                if (selectedMeasure !== 'Todas') {
                  const key = measureKeys[selectedMeasure as keyof typeof measureKeys]
                  return `${value} ${measureUnits[key]}`
                }

                // Quando for "Todas", escolher a métrica com maior valor
                const lastEntry = data[data.length - 1]
                if (!lastEntry) return value

                const dominant = ['co2', 'temperature', 'humidity', 'tvoc'].reduce((a, b) =>
                  (lastEntry[a] || 0) > (lastEntry[b] || 0) ? a : b
                )

                return `${value} ${measureUnits[dominant]}`
              }}
            />
            <Tooltip content={<CustomTooltip />}/>
            {renderAreas()}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SensorHistoryChart
