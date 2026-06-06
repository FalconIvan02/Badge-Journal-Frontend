
import type { ViewId } from '../types'
import { VIEWS } from '../types'

interface NavProps {
  activeView: ViewId
  onViewChange: (view: ViewId) => void
}
export default function Nav({ activeView, onViewChange }: NavProps){

  return (
    <nav className="nav">
      {VIEWS.map(({ id, label }) => (
        <button
          key={id}
          className={`nav-btn ${activeView === id ? 'active' : ''}`}
          onClick={() => onViewChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}