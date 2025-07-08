'use client'

import { ResponsivePie } from '@nivo/pie'

export function EventDonutChart({ sensor }: { sensor: string }) {
  const data = [
    { id: 'Grave', label: 'Grave', value: 4, color: '#ef4444' },
    { id: 'Médio', label: 'Médio', value: 6, color: '#facc15' },
    { id: 'Leve', label: 'Leve', value: 10, color: '#22c55e' },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-[300px]">
      <h2 className="font-medium text-lg mb-2">Eventos por gravidade</h2>
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
        innerRadius={0.6}
        padAngle={2}
        colors={(d) => d.data.color}
        enableArcLabels={false}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 40,
            itemWidth: 80,
            itemHeight: 14,
            symbolSize: 14,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  )
}
export default EventDonutChart