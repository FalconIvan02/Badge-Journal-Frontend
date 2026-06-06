import type { UnlockedEntry } from '../globals/App.tsx'
import './Journal.css'

interface JournalProps {
  entries: UnlockedEntry[]
}

export default function Journal({ entries }: JournalProps) {
  if (entries.length === 0) {
    return (
      <div className="journal-empty">
        <span>🗺️</span>
        <p>El teu Journal és buit</p>
        <small>Visita el teu primer districte al mapa</small>
      </div>
    )
  }

  return (
    <div className="journal-grid">
      {entries.map(({ district, date, method }) => (
        <div key={district.id} className="journal-badge">
          <div className="badge-emoji">{district.emoji}</div>
          <div className="badge-name">{district.name}</div>
          <div className="badge-desc">{district.desc}</div>
          <div className="badge-date">
            {new Date(date).toLocaleDateString('ca-ES', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </div>
          <div className="badge-method">
            {method === 'gps' ? '📍 GPS' : method === 'sim' ? '🎮 Simulat' : '✋ Manual'}
          </div>
        </div>
      ))}
    </div>
  )
}