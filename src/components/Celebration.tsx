import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BarcelonaLogo from '../assets/Golden_Isotip_Ajuntament_de_Barcelona.svg?react'
import './Celebration.css'

interface BarcelonaCelebrationProps {
  onClose: () => void
}

export default function BarcelonaCelebration({ onClose }: BarcelonaCelebrationProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      ref={backdropRef}
      className="celebration-backdrop"
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
    >
      <Confetti />

      <div className="celebration-card">
        <div className="celebration-tag">FELICITACIONS</div>

        <div className="celebration-badge">
          <BarcelonaLogo />
        </div>

        <div className="celebration-title">BARCELONA</div>
        <div className="celebration-subtitle">10 / 10 DISTRICTES</div>

        <div className="celebration-divider" />

        <p className="celebration-desc">
          Has explorat tots els districtes de Barcelona.<br />
          La ciutat sencera és teva.
        </p>

        <button className="celebration-btn" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>,
    document.body
  )
}

// ─── Confetti ────────────────────────────────────────────────────────────────

const COLORS = ['#c9a84c', '#FFD700', '#ff6b6b', '#4ecdc4', '#a8e6cf', '#ffeaa7']

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id:       i,
    left:     `${Math.random() * 100}%`,
    color:    COLORS[i % COLORS.length],
    delay:    `${Math.random() * 1.2}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    size:     6 + Math.random() * 6,
    round:    Math.random() > 0.5,
  }))

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left:         p.left,
            width:        p.size,
            height:       p.size,
            background:   p.color,
            borderRadius: p.round ? '50%' : 2,
            animation:    `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </>
  )
}