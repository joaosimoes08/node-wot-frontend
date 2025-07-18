'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { useState, useMemo, useEffect } from 'react'

const metricUnits: Record<string, string> = {
  temperature: '°C',
  humidity: '%RH',
  co2: 'PPM',
  tvoc: 'PPB'
}

function formatTimestamp(timestamp: string) {
  const d = new Date(timestamp)
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function SensorChart() {
  const [controller, setController] = useState('Todos')
  const [metric, setMetric] = useState('Todas')
  const [range, setRange] = useState('Último dia')
  const [sensorData, setSensorData] = useState<any[]>([])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const fetchSensorData = async () => {
      try {
        const res = await fetch('/api/proxy?path=/api/sensors/data')
        const data = await res.json()
        console.log(data)
        setSensorData(data)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
      } finally {
        timeout = setTimeout(fetchSensorData, 30000)
      }
    }

    fetchSensorData()

    return () => clearTimeout(timeout)
  }, [])

  const controllers = ['Todos', ...Array.from(new Set(sensorData.map(d => d.sensorId)))]
  const metrics = ['Todas', 'temperature', 'humidity', 'co2', 'tvoc']
  const ranges = ['Último dia', '7 dias', 'Mês', 'Ano']

  const filtered = useMemo(() => {
    const now = new Date()
    let rangeStart = new Date(now)
    if (range === '7 dias') rangeStart.setDate(now.getDate() - 7)
    else if (range === 'Mês') rangeStart.setMonth(now.getMonth() - 1)
    else if (range === 'Ano') rangeStart.setFullYear(now.getFullYear() - 1)
    else rangeStart.setDate(now.getDate() - 1)

    return sensorData.filter((d) => {
      const t = new Date(d.timestamp)
      const dentro = t >= rangeStart
      const controllerOk = controller === 'Todos' || d.sensorId === controller
      const metricOk = metric === 'Todas' || metric in d
      return dentro && controllerOk && metricOk
    })
  }, [sensorData, controller, metric, range])

  const chartData = useMemo(() => {
    return filtered.map((d) => ({
      timestamp: formatTimestamp(d.date),
      sensor: d.sensorId,
      ...d
    }))
  }, [filtered])

  const activeMetrics = metric === 'Todas' ? ['temperature', 'humidity', 'co2', 'tvoc'] : [metric]
  const colors: Record<string, string> = {
    temperature: '#f97316',
    humidity: '#06b6d4',
    co2: '#f43f5e',
    tvoc: '#10b981'
  }

  const dominantMetric = useMemo(() => {
  if (metric !== 'Todas') return metric

  const maxByMetric: Record<string, number> = {
    temperature: 0,
    humidity: 0,
    co2: 0,
    tvoc: 0
  }

  for (const d of chartData) {
    for (const m of Object.keys(maxByMetric)) {
      if (typeof d[m] === 'number' && d[m] > maxByMetric[m]) {
        maxByMetric[m] = d[m]
      }
    }
  }

  // Escolhe a métrica com maior valor máximo
  return Object.entries(maxByMetric).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
}, [metric, chartData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow text-xs border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => {
            const unit = metricUnits[entry.dataKey] || ''
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
    <div className="space-y-2 w-full">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <Select value={controller} onValueChange={setController}>
            <SelectTrigger className="w-[130px] text-xs">
              <SelectValue placeholder="Controlador" />
            </SelectTrigger>
            <SelectContent>
              {controllers.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[130px] text-xs">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[130px] text-xs">
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legenda à direita */}
        <div className="text-xs text-muted-foreground flex flex-wrap justify-end gap-2">
          {activeMetrics.map((m) => (
            <span key={m} className="whitespace-nowrap">
              {m.charAt(0).toUpperCase() + m.slice(1)} - {metricUnits[m]}
            </span>
          ))}
        </div>
      </div>


      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }}/>
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                const unit = metricUnits[dominantMetric]
                return `${value} ${unit}`
              }}
            />
            <Tooltip content={<CustomTooltip />}/>
            {activeMetrics.map((m) => (
              <Area
                key={m}
                type="monotone"
                dataKey={m}
                stroke={colors[m]}
                fill={colors[m]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SensorChart
