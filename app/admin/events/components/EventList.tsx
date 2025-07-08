'use client'

import { useState } from 'react'

const mockEvents = [
  { timestamp: '2025-07-05 14:00', description: 'CO₂ elevado', severity: 'Grave' },
  { timestamp: '2025-07-05 13:00', description: 'Temperatura elevada', severity: 'Médio' },
  { timestamp: '2025-07-05 12:00', description: 'TVOC aceitável', severity: 'Leve' },
]

export function EventList({ sensor }: { sensor: string }) {
  const [dateFilter, setDateFilter] = useState('2025-07-05')

  const filtered = mockEvents.filter(e => e.timestamp.startsWith(dateFilter))

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-[300px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium text-lg">Últimos Eventos</h2>
        <input
          type="date"
          className="border rounded-md px-2 py-1 text-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      <ul className="space-y-2 text-sm">
        {filtered.map((event, idx) => (
          <li key={idx} className="border rounded p-2 flex justify-between items-center">
            <span>{event.timestamp}</span>
            <span>{event.description}</span>
            <span
              className={`text-xs font-bold ${
                event.severity === 'Grave'
                  ? 'text-red-500'
                  : event.severity === 'Médio'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              {event.severity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default EventList