'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import DeviceDot from './components/DeviceDot'

interface SensorLocation {
  _id: string
  data: {
    location: {
      value: string
    }
  }
}

interface DeviceInfo {
  name: string
  board: string
  sensors: string[]
  temperature: number
  uptime: string
}

interface Sensor extends DeviceInfo {
  id: string
  location: string
}

const buffetCoordinates: Record<string, { top: string; left: string }> = {
  'Buffet 1': { top: '25%', left: '24%' },
  'Buffet 2': { top: '25%', left: '40%' },
  'Buffet 3': { top: '25%', left: '56%' },
  'Buffet 4': { top: '25%', left: '72%' },
  'Buffet 5': { top: '25%', left: '84%' },
  'Buffet 6': { top: '49%', left: '84%' },
  'Buffet 7': { top: '72%', left: '84%' },
  'Buffet 8': { top: '72%', left: '72%' },
  'Buffet 9': { top: '72%', left: '55%' },
  'Buffet 10': { top: '72%', left: '38%' },
  'Buffet 11': { top: '72%', left: '21%' },
}

const deviceMockData: Record<string, DeviceInfo> = {
  'wot:dev:buffet-food-quality-analyzer-01': {
    name: 'buffet-food-quality-analyzer-01',
    board: 'ESP32-S3-DEV',
    sensors: ['temperature', 'humidity', 'co2', 'tvoc'],
    temperature: 22,
    uptime: '2h 15min',
  },
  'wot:dev:buffet-food-quality-analyzer-02': {
    name: 'buffet-food-quality-analyzer-02',
    board: 'ESP32-S3-DEV',
    sensors: ['temperature', 'humidity', 'co2', 'tvoc'],
    temperature: 24,
    uptime: '1h 42min',
  },
  'wot:dev:buffet-food-quality-analyzer-03': {
    name: 'buffet-food-quality-analyzer-03',
    board: 'ESP32-S3-DEV',
    sensors: ['temperature', 'humidity', 'co2', 'tvoc'],
    temperature: 24,
    uptime: '1h 42min',
  },
}

export default function DispositivosPage() {
  const [sensors, setSensors] = useState<Sensor[]>([])

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const resIds = await fetch('/api/proxy?path=/api/sensors/ids')
        const rawIds = await resIds.json()

        const locationFetches = rawIds.map(async (item: { sensorId: string }) => {
          const sensorId = item.sensorId

          const res = await fetch(`/api/proxy?path=/api/sensors/${sensorId}/location`)
          if (!res.ok) {
            console.error(`Erro ao buscar localização para ${sensorId}`)
            return null
          }
          const loc = await res.json()

          return {
            id: sensorId,
            location: loc.location,
            ...deviceMockData[sensorId],
          }
        })

        const combined = (await Promise.all(locationFetches)).filter(Boolean) as Sensor[]
        setSensors(combined)
      } catch (error) {
        console.error('Erro ao carregar sensores:', error)
      }
    }

    fetchSensorData()
  }, [])

  return (
    <div className="w-full p-4">
      <div className="relative w-full max-w-6xl mx-auto mt-[70px] mb-6 rounded-xl shadow border overflow-hidden">
        <Image
          src="/images/blueprint.png"
          alt="Planta do Restaurante"
          width={1200}
          height={800}
          className="w-full h-auto object-contain rounded-xl"
        />
        {sensors.map((sensor) => {
          const coords = buffetCoordinates[sensor.location]
          if (!coords) return null

          return (
            <DeviceDot
              key={sensor.id}
              top={coords.top}
              left={coords.left}
              name={sensor.name}
              board={sensor.board}
              sensors={sensor.sensors}
              temperature={sensor.temperature}
              uptime={sensor.uptime}
              link={`/admin/commands`}
            />
          )
        })}
      </div>
    </div>
  )
}