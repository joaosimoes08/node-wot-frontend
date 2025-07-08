'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

interface DeviceDotProps {
  top: string
  left: string
  name: string
  board: string
  sensors: string[]
  temperature: number
  uptime: string
  link: string
}

export function DeviceDot({
  top,
  left,
  name,
  board,
  sensors,
  temperature,
  uptime,
  link,
}: DeviceDotProps) {
  const [hovered, setHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isRightSide = parseFloat(left) > 75 // tooltip muda se for zona direita

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHovered(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 100)
  }

  return (
    <div
      className="absolute z-20"
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative">
        <div className="w-4 h-4 bg-green-500 rounded-full shadow ring-2 ring-white animate-pulse" />
        {hovered && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRightSide ? 'right-6' : 'left-6'
            } bg-white text-black p-4 rounded-xl shadow-lg w-[230px] border border-gray-200 z-50`}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <p className="font-bold text-sm">{name}</p>
            <p className="text-sm text-gray-500 mb-2">{board}</p>
            <p className="text-sm"><strong>Sensores:</strong> {sensors.join(', ')}</p>
            <p className="text-sm"><strong>Temp:</strong> {temperature}°C</p>
            <p className="text-sm mb-2"><strong>Uptime:</strong> {uptime}</p>
            <Link href={link} className="text-sm text-blue-600 hover:underline">
              Executar comandos →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
export default DeviceDot