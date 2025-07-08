'use client'

import SensorActions from './components/SensorActions'
import SensorChart from './components/SensorChart'
import SensorCount from './components/SensorCount'
import SensorEventSummary from './components/SensorEventSummary'
import SensorTrayList from './components/SensorTrayList'

import { UserButton,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
 } from '@clerk/nextjs'

 import { PersonStanding } from 'lucide-react'

export function Dashboard() {

  return (
    <div className="min-h-screen flex flex-col gap-6 p-2 max-w-screen-2xl mx-auto">
      {/* Header topo */}
      <div className="w-full flex justify-between items-center px-4 relative">
        <h1 className="text-2xl font-bold">Buffet Analyze System</h1>
        <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <PersonStanding className='hover:cursor-pointer'/>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonPopoverCard: 'border border-gray-200 shadow-md'
                  }
                }}
              />
            </SignedIn>
        </div>
      </div>

      {/* Linha topo com 3 colunas: Ações, Tabuleiros, Contador */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-between"><SensorActions /></div>
        <div className="bg-white rounded-lg shadow p-4 h-full overflow-hidden"><SensorTrayList /></div>
        <div className="bg-white rounded-lg shadow p-4 h-full flex items-center justify-center"><SensorCount /></div>    
      </div>

      {/* Eventos */}
      <div className="bg-white rounded-lg shadow p-4">
        <SensorEventSummary />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow p-2 h-full">
        <SensorChart />
      </div>
    </div>
  )
}
export default Dashboard