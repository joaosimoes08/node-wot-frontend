'use client'

import { useState } from 'react'
import EventDonutChart from './components/EventDonutChart'
import EventList from './components/EventList'
import EventCreator from './components/EventCreator'

const sensors = ['ESP32-A', 'ESP32-B', 'ESP32-C']

export default function EventsPage() {
  const [selectedSensor, setSelectedSensor] = useState(sensors[0])

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestão de Eventos</h1>
        <select
          className="border px-4 py-2 rounded-md text-sm"
          value={selectedSensor}
          onChange={(e) => setSelectedSensor(e.target.value)}
        >
          {sensors.map((sensor) => (
            <option key={sensor} value={sensor}>
              {sensor}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventDonutChart sensor={selectedSensor} />
        <EventList sensor={selectedSensor} />
      </div>

      <EventCreator sensor={selectedSensor} />
    </div>
  )
}