'use client'

export function SensorEventSummary() {
  // Mock - substituir por dados reais do backend
  const totalEventos = 27
  const destaque = {
    sensor: 'ESP32-B',
    tipo: 'CO2 elevado',
    valor: '1200 ppm'
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full h-[115px]">
        <h2 className="text-sm font-semibold mb-2">Resumo de Eventos</h2>
        <p className="text-sm text-muted-foreground mb-2">
            Total de eventos registados: <span className="font-bold">27</span>
        </p>
        <div className="text-sm border border-red-500 bg-red-100 text-red-700 px-4 py-1 rounded-md">
            <strong>Destaque:</strong> CO2 elevado no ESP32-B (1200 ppm)
        </div>
    </div>

  )
}
export default SensorEventSummary