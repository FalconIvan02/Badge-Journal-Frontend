import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import BarcelonaLogo from '../assets/Isotip_Ajuntament_de_Barcelona.svg'

interface BarcelonaCelebrationProps {
  onClose: () => void
}

export default function BarcelonaCelebration({ onClose }: BarcelonaCelebrationProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(5, 7, 14, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Confetti */}
      <Confetti />

      {/* Card */}
      <div style={{
        background: 'linear-gradient(160deg, #111520, #0d1020)',
        border: '1px solid rgba(201,168,76,0.4)',
        borderRadius: 24,
        padding: '48px 40px',
        maxWidth: 420, width: '100%',
        textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.08)',
        animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
      }}>
        {/* Estrella decorativa superior */}
        <div style={{
          position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #8a6820, #c9a84c)',
          borderRadius: '0 0 12px 12px',
          padding: '4px 20px',
          fontSize: 10, letterSpacing: 3,
          color: '#0a0d12', fontFamily: 'Cinzel, serif', fontWeight: 700,
        }}>
          FELICITACIONS
        </div>

        {/* Insignia */}
        <div style={{
          width: 120, height: 120,
          margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 40% 35%, rgba(201,168,76,0.15), transparent 70%)',
          filter: 'drop-shadow(0 6px 24px rgba(201,168,76,0.5))',
          animation: 'floatBadge 3s ease-in-out infinite',
        }}>
          <BarcelonaLogo/>
        </div>

        {/* Título */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 32, fontWeight: 700,
          color: '#c9a84c',
          letterSpacing: 4,
          marginBottom: 8,
          textShadow: '0 0 30px rgba(201,168,76,0.4)',
        }}>
          BARCELONA
        </div>

        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 13, color: 'rgba(201,168,76,0.6)',
          letterSpacing: 3, marginBottom: 20,
        }}>
          10 / 10 DISTRICTES
        </div>

        {/* Divisor */}
        <div style={{
          width: 60, height: 1,
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          margin: '0 auto 20px',
        }} />

        {/* Descripción */}
        <p style={{
          fontFamily: 'Lato, sans-serif',
          fontSize: 14, color: '#a09880',
          lineHeight: 1.7, marginBottom: 32,
          fontStyle: 'italic',
        }}>
          Has explorat tots els districtes de Barcelona.<br />
          La ciutat sencera és teva.
        </p>

        {/* Botón */}
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #8a6820, #c9a84c)',
            color: '#0a0d12',
            border: 'none', borderRadius: 12,
            padding: '14px 40px',
            fontFamily: 'Cinzel, serif',
            fontSize: 13, fontWeight: 700, letterSpacing: 2,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.35)'
          }}
        >
          Continuar
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes popIn {
          0%   { transform: scale(0.7) translateY(40px); opacity: 0 }
          100% { transform: scale(1)   translateY(0);    opacity: 1 }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-8px) }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotateZ(0deg);   opacity: 1 }
          100% { transform: translateY(100vh) rotateZ(720deg); opacity: 0 }
        }
      `}</style>
    </div>,
    document.body
  )
}

// ─── Confetti ────────────────────────────────────────────────────────────────

function Confetti() {
  const COLORS = ['#c9a84c', '#FFD700', '#ff6b6b', '#4ecdc4', '#a8e6cf', '#ffeaa7']
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left:    `${Math.random() * 100}%`,
    color:   COLORS[i % COLORS.length],
    delay:   `${Math.random() * 1.2}s`,
    duration:`${2.5 + Math.random() * 2}s`,
    round:   Math.random() > 0.5,
    size:    6 + Math.random() * 6,
  }))

  return (
    <>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          top: -20,
          left: p.left,
          width:  p.size,
          height: p.size,
          background: p.color,
          borderRadius: p.round ? '50%' : 2,
          pointerEvents: 'none',
          zIndex: 9001,
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </>
  )
}