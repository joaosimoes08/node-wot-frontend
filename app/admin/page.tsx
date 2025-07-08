'use client';

import SensorActions from './components/SensorActions';
import SensorTrayList from './components/SensorTrayList';
import SensorCount from './components/SensorCount';
import SensorChart from './components/SensorChart';
import SensorEventSummary from './components/SensorEventSummary';

export default function AdminDashboardPage() {
  return (
    <main className="flex flex-col gap-4 p-6">
      {/* Topo com 3 colunas: Ações, Tabuleiros, Contador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ações rápidas */}
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between">
          <SensorActions />
        </div>

        {/* Tabuleiros com navegação */}
        <div className="bg-white rounded-lg shadow p-4 h-full overflow-hidden">
          <SensorTrayList />
        </div>

        {/* Total de sensores */}
        <div className="bg-white rounded-lg shadow p-4 h-full flex items-center justify-center">
          <SensorCount />
        </div>
      </div>

      {/* Resumo de eventos e alerta principal */}
      <div className="bg-white rounded-lg shadow p-4">
        <SensorEventSummary />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <SensorChart />
      </div>
    </main>
  );
}