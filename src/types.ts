export const VIEWS = [
  { id: 'map',     label: 'Mapa'    },
  { id: 'journal', label: 'Journal' },
  { id: 'roadmap', label: 'Roadmap' },
] as const

export type ViewId = typeof VIEWS[number]['id']  // 'map' | 'journal' | 'roadmap'