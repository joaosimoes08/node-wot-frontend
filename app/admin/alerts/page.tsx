'use client'
import { AlertForm } from "./components/AlertForm"
import { AlertTable } from "./components/AlertTable"

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestão de Alertas</h1>
      <AlertForm />
      <AlertTable />
    </div>
  )
}
