import { useEffect, useRef, useState } from 'react'
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DISTRICTS, type District } from '../data/districts'
import FALLBACK_GEOJSON from '../data/bcn-geojson.json'

const GEOJSON_URL =
  'https://raw.githubusercontent.com/martgnz/bcn-geodata/master/districtes/districtes.geojson'

// ─── Types ───────────────────────────────────────────────────────────────────

type BCNFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>

interface MapViewProps {
  unlocked: Record<number, boolean>
  onDistrictClick: (district: District) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Normaliza el GeoJSON de martgnz: DISTRICTE "01" → districte 1 */
function normalizeFeatures(raw: BCNFeatureCollection): BCNFeatureCollection {
  return {
    ...raw,
    features: raw.features.map((f: Feature<Geometry, GeoJsonProperties>) => ({
      ...f,
      properties: {
        ...f.properties,
        districte: parseInt(f.properties?.DISTRICTE ?? f.properties?.districte, 10),
      },
    })),
  }
}

async function fetchGeoJSON(): Promise<BCNFeatureCollection> {
  const res = await fetch(GEOJSON_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw: BCNFeatureCollection = await res.json()
  return normalizeFeatures(raw)
}

function getDistrictStyle(id: number, unlocked: Record<number, boolean>): L.PathOptions {
  const d = DISTRICTS.find(x => x.id === id)!
  const on = !!unlocked[id]
  return {
    fillColor:   on ? d.color  : '#000b2c',
    fillOpacity: on ? 0.42     : 0.28,
    color:       on ? d.accent : 'rgba(201,168,76,0.3)',
    weight:      on ? 2        : 1,
    dashArray:   on ? undefined : '5,5',
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MapView({ unlocked, onDistrictClick }: MapViewProps) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const layerRefs   = useRef<Record<number, L.GeoJSON>>({})

  const [geoStatus, setGeoStatus] = useState<'loading' | 'real' | 'fallback'>('loading')

  // Refs para evitar closures stale en los handlers de Leaflet
  const onClickRef  = useRef(onDistrictClick)
  const unlockedRef = useRef(unlocked)
  useEffect(() => { onClickRef.current  = onDistrictClick }, [onDistrictClick])
  useEffect(() => { unlockedRef.current = unlocked        }, [unlocked])

  // ── Pinta features sobre el mapa (se puede llamar con real o fallback) ────
  function addFeaturesToMap(map: L.Map, geojson: BCNFeatureCollection) {
    Object.values(layerRefs.current).forEach(l => l.remove())
    layerRefs.current = {}

    geojson.features.forEach(feat => {
      const id = feat.properties?.districte
      if (typeof id !== 'number' || isNaN(id)) return

      const d = DISTRICTS.find(x => x.id === id)
      if (!d) return

      const layer = L.geoJSON(feat, {
        style: getDistrictStyle(id, unlockedRef.current),
      })

      layer.on('click',     () => onClickRef.current(d))
      layer.on('mouseover', () => {
        const on = !!unlockedRef.current[id]
        layer.setStyle({ fillOpacity: on ? 1 : 1, weight: 2 })
      })
      layer.on('mouseout',  () => layer.setStyle(getDistrictStyle(id, unlockedRef.current)))

      layer.addTo(map)
      layerRefs.current[id] = layer

      const center = layer.getBounds().getCenter()
      L.marker(center, {
        icon: L.divIcon({
          className:  'district-label',
          html:       d.name,
          iconSize:   [110, 18],
          iconAnchor: [55, 9],
        }),
        interactive: false,
      }).addTo(map)
    })
  }

  // ── Mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [41.3851, 2.1734],
      zoom:   12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map)

    mapInstance.current = map

    fetchGeoJSON()
      .then(geojson => {
        addFeaturesToMap(map, geojson)
        setGeoStatus('real')
      })
      .catch(err => {
        console.warn('GeoJSON remoto falló, usando fallback:', err)
        const fallback = normalizeFeatures(FALLBACK_GEOJSON as BCNFeatureCollection)
        addFeaturesToMap(map, fallback)
        setGeoStatus('fallback')
      })

    return () => {
      map.remove()
      mapInstance.current = null
      layerRefs.current   = {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refrescar estilos cuando cambia unlocked ──────────────────────────────
  useEffect(() => {
    Object.entries(layerRefs.current).forEach(([idStr, layer]) => {
      layer.setStyle(getDistrictStyle(Number(idStr), unlocked))
    })
  }, [unlocked])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {geoStatus === 'loading' && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
          background: 'rgba(10,13,18,0.85)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 8, padding: '6px 12px',
          color: '#c9a84c', fontSize: 11,
          fontFamily: 'Cinzel, serif', letterSpacing: 1,
        }}>
          ⏳ Carregant mapa...
        </div>
      )}

      {geoStatus === 'fallback' && (
        <div style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
          background: 'rgba(10,13,18,0.85)',
          border: '1px solid rgba(240,160,80,0.4)',
          borderRadius: 8, padding: '6px 12px',
          color: '#f0a050', fontSize: 11,
          fontFamily: 'Cinzel, serif', letterSpacing: 1,
        }}>
          ⚠️ Mapa aproximat (sense connexió)
        </div>
      )}
    </div>
  )
}