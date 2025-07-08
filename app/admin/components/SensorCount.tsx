'use client'

import { useEffect, useState } from 'react'

export function SensorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/proxy?path=/api/sensors/location')
      .then(res => res.json())
      .then(data => setCount(data.length))
      .catch(err => console.error('[Erro ao buscar quantidade de sensores]', err))
  }, [])

  return (
    <span>
      Total de sensores: <strong>{count !== null ? count : '...'}</strong>
    </span>
  )
}

export default SensorCount
