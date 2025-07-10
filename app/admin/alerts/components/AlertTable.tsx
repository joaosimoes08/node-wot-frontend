"use client"

import { useEffect, useState } from "react"



export function AlertTable() {
  const [alerts, setAlerts] = useState<any[]>([])

    useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`/api/proxy?path=/api/alerts`)
        const data = await res.json()
        setAlerts(data)
      } catch (err) {
        console.error("Erro ao buscar alertas", err)
      }
    }

    fetchAlerts()
  }, [])

  if (alerts.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Alertas Ativos</h2>
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Sensor</th>
              <th className="px-4 py-2">Métrica</th>
              <th className="px-4 py-2">Condição</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Toast</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{a.alertId}</td>
                <td className="px-4 py-2">{a.sensorId}</td>
                <td className="px-4 py-2">{a.metric}</td>
                <td className="px-4 py-2">{a.condition}</td>
                <td className="px-4 py-2">{a.threshold}</td>
                <td className="px-4 py-2">{a.sendEmail ? "✅" : "❌"}</td>
                <td className="px-4 py-2">{a.sendToast ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default AlertTable
