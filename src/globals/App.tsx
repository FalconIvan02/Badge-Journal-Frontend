import '../App.css'
import { useState } from 'react'
import type { ViewId } from '../types.ts'
import type { District } from '../data/districts.ts'
import Roadmap from '../views/Roadmap.tsx'
import Map from '../views/Map.tsx'
import Journal from '../views/Journal.tsx'
import Navbar from './Navbar.tsx'

// Entrada del journal: el distrito completo + metadatos de visita
export interface UnlockedEntry {
  district: District
  date: string        // ISO string
  method: 'gps' | 'manual' | 'sim'
}

export default function App() {
  const [activeView, setActiveView]   = useState<ViewId>('map')
  const [unlocked, setUnlocked]       = useState<Record<number, UnlockedEntry>>({})

  // Para el mapa solo necesita saber qué ids están desbloqueados
  const unlockedIds: Record<number, boolean> = Object.fromEntries(
    Object.entries(unlocked).map(([id]) => [id, true])
  )

  function handleDistrictClick(d: District) {
    if (unlocked[d.id]) return   // ya desbloqueado, podrías abrir modal en su lugar

    setUnlocked(prev => ({
      ...prev,
      [d.id]: { district: d, date: new Date().toISOString(), method: 'manual' },
    }))
  }

  return (
    <>
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      <main>
        {activeView === 'map' && (
          <Map
            unlocked={unlockedIds}
            onDistrictClick={handleDistrictClick}
          />
        )}
        {activeView === 'journal' && (
          <Journal entries={Object.values(unlocked)} />
        )}
        {activeView === 'roadmap' && (
          <Roadmap />
        )}
      </main>
    </>
  )
}