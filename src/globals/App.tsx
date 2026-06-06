import '../App.css'
import { useState, useEffect } from 'react'
import type { ViewId } from '../types.ts'
import type { District } from '../data/districts.ts'
import { DISTRICTS } from '../data/districts.ts'
import Roadmap from '../views/Roadmap.tsx'
import Map from '../views/Map.tsx'
import Journal from '../views/Journal.tsx'
import Navbar from './Navbar.tsx'
import BarcelonaCelebration from '../components/Celebration.tsx'

export interface UnlockedEntry {
  district: District
  date: string
  method: 'gps' | 'manual' | 'sim'
}

const TOTAL_DISTRICTS = DISTRICTS.length // 10

export default function App() {
  const [activeView, setActiveView]           = useState<ViewId>('map')
  const [unlocked, setUnlocked]               = useState<Record<number, UnlockedEntry>>({})
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationSeen, setCelebrationSeen] = useState(false)

  const unlockedIds: Record<number, boolean> = Object.fromEntries(
    Object.entries(unlocked).map(([id]) => [id, true])
  )

  const allUnlocked = Object.keys(unlocked).length === TOTAL_DISTRICTS

  // Disparar celebración cuando se completan todos los distritos
  useEffect(() => {
    if (allUnlocked && !celebrationSeen) {
      const t = setTimeout(() => setShowCelebration(true), 800)
      return () => clearTimeout(t)
    }
  }, [allUnlocked, celebrationSeen])

  function handleDistrictClick(d: District) {
    if (unlocked[d.id]) return
    setUnlocked(prev => ({
      ...prev,
      [d.id]: { district: d, date: new Date().toISOString(), method: 'manual' },
    }))
  }

  function handleCloseCelebration() {
    setShowCelebration(false)
    setCelebrationSeen(true)
  }

  return (
    <>
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      <main>
        {activeView === 'map' && (
          <Map
            unlocked={unlockedIds}
            allUnlocked={allUnlocked}
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

      {showCelebration && (
        <BarcelonaCelebration onClose={handleCloseCelebration} />
      )}
    </>
  )
}