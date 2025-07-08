'use client'

import SensorTrayCard from './SensorTrayCard'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

type SensorData = {
  sensorId: string
  temperature: number
  humidity: number
  co2: number
  tvoc: number
  date: string
}

type LocationMap = Record<string, number>

export function SensorTrayList() {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [locations, setLocations] = useState<LocationMap>({})
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchData()
    const interval = setTimeout(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const dataRes = await fetch('/api/proxy?path=/api/sensors/data')
      const data: SensorData[] = await dataRes.json()

      const latestBySensor: Record<string, SensorData> = {}
      for (const entry of data) {
        const existing = latestBySensor[entry.sensorId]
        if (!existing || new Date(entry.date) > new Date(existing.date)) {
          latestBySensor[entry.sensorId] = entry
        }
      }

      setSensorData(Object.values(latestBySensor))

      const locMap: LocationMap = {}
      for (const sensor of Object.values(latestBySensor)) {
        const res = await fetch(`/api/proxy?path=/api/sensors/${sensor.sensorId}/location`)
        const loc = await res.json()
        const match = /Buffet (\d+)/.exec(loc.location)
        if (match) {
          locMap[sensor.sensorId] = parseInt(match[1])
        }
      }
      setLocations(locMap)
    } catch (err) {
      console.error('Erro ao buscar dados dos sensores ou localizações', err)
    }
  }

  const orderedSensors = sensorData
    .filter((d) => locations[d.sensorId] !== undefined)
    .sort((a, b) => (locations[a.sensorId] ?? 0) - (locations[b.sensorId] ?? 0))

  const traysPerPage = 1
  const pageSensors = orderedSensors.slice(currentPage * traysPerPage, (currentPage + 1) * traysPerPage)

  return (
    <div className="w-full space-y-2">
      <div className="w-full">
        {pageSensors.map((sensor) => (
          <SensorTrayCard
            key={sensor.sensorId}
            trayNumber={locations[sensor.sensorId] || 0}
            data={sensor}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}>
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                (prev + 1 < Math.ceil(orderedSensors.length / traysPerPage) ? prev + 1 : prev)
              )
            }
          >
            →
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SensorTrayList
