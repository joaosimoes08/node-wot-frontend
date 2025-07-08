"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type SensorEntry = {
  sensorId: string
  [key: string]: any
}

export function AlertForm() {
  const [name, setName] = useState("")
  const [sensor, setSensor] = useState("")
  const [metric, setMetric] = useState("")
  const [condition, setCondition] = useState(">")
  const [threshold, setThreshold] = useState("")
  const [sendEmail, setSendEmail] = useState(false)
  const [sendToast, setSendToast] = useState(false)
  const [sensorIds, setSensorIds] = useState<string[]>([])
  const [metrics, setMetrics] = useState<string[]>([])

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch(`/api/proxy?path=/api/sensors/ids`)
        const data: SensorEntry[] = await res.json()

        const uniqueSensorIds = Array.from(
          new Set(data.map((entry) => entry.sensorId))
        )
        setSensorIds(uniqueSensorIds)

        const allMetrics = new Set<string>()
        data.forEach((entry: any) => {
          Object.keys(entry).forEach((key) => {
            if (key !== "sensorId" && key !== "lastModified" && key !== "_id" && key !== "date" && key !== "deviceType") {
              allMetrics.add(key)
              allMetrics.delete("location")
              allMetrics.add("temperature")
              allMetrics.add("humidity")
              allMetrics.add("co2")
              allMetrics.add("tvoc")
            }
          })
        })
        setMetrics(Array.from(allMetrics))
      } catch (err) {
        console.error("Erro ao carregar sensores:", err)
        toast.error("Erro ao obter sensores.")
      }
    }

    fetchSensorData()
  }, [])

  const handleSubmit = async () => {
    const alert = {
      sensorId: sensor,
      metric: metric,
      condition: condition,
      threshold: Number(threshold),
      sendEmail,
      sendToast
    }

    try {
      const res = await fetch(`/api/proxy?path=/api/alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alert),
      })

      if (!res.ok) throw new Error("Erro ao guardar alerta.")
      toast.success("Alerta guardado com sucesso.")
    } catch (err) {
      console.error(err)
      toast.error("Erro ao guardar alerta.")
    }
  }

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <div className="space-y-4">
        <label className="block font-semibold">Nome do Alerta</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block font-semibold">Sensor</label>
          <Select value={sensor} onValueChange={setSensor}>
            <SelectTrigger><SelectValue placeholder="Selecionar Sensor" /></SelectTrigger>
            <SelectContent>
              {sensorIds.map((id) => (
                <SelectItem key={id} value={id}>{id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block font-semibold">Métrica</label>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger><SelectValue placeholder="Selecionar Métrica" /></SelectTrigger>
            <SelectContent>
              {metrics.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block font-semibold">Condição</label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value=">">&gt;</SelectItem>
              <SelectItem value="<">&lt;</SelectItem>
              <SelectItem value="=">=</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block font-semibold">Valor Limite</label>
          <Input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <Switch checked={sendEmail} onCheckedChange={setSendEmail} />
          <span>Enviar Email</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={sendToast} onCheckedChange={setSendToast} />
          <span>Notificação Toast</span>
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full mt-4">
        Guardar Alerta
      </Button>
    </div>
  )
}

export default AlertForm
