import { useEffect, useRef } from 'react'
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DISTRICTS, type District } from '../data/districts'
import FALLBACK_GEOJSON from '../data/bcn-geojson.json'

const GEOJSON_URL =
  'https://raw.githubusercontent.com/martgnz/bcn-geodata/master/districtes/districtes.geojson'

type BCNFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>

interface MapViewProps {
  unlocked: Record<number, boolean>
  allUnlocked: boolean           // ← nuevo prop
  onDistrictClick: (district: District) => void
}

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
  return normalizeFeatures(await res.json())
}

function getDistrictStyle(id: number, unlocked: Record<number, boolean>): L.PathOptions {
  const d = DISTRICTS.find(x => x.id === id)!
  const on = !!unlocked[id]
  return {
    fillColor:   on ? d.color  : '#1a1e2a',
    fillOpacity: on ? 0.42     : 0.28,
    color:       on ? d.accent : 'rgba(201,168,76,0.3)',
    weight:      on ? 2        : 1,
    dashArray:   on ? undefined : '5,5',
  }
}

// Estilo para la capa unificada de Barcelona completa
const BARCELONA_STYLE: L.PathOptions = {
  fillColor:   '#c9a84c',
  fillOpacity: 0.18,
  color:       '#c9a84c',
  weight:      3,
  dashArray:   undefined,
}

export default function MapView({ unlocked, allUnlocked, onDistrictClick }: MapViewProps) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstance    = useRef<L.Map | null>(null)
  const layerRefs      = useRef<Record<number, L.GeoJSON>>({})
  const mergedLayerRef = useRef<L.GeoJSON | null>(null)  // capa unificada BCN
  const labelMarkersRef = useRef<L.Marker[]>([])          // labels de distritos
  const bcnLabelRef    = useRef<L.Marker | null>(null)    // label "BARCELONA"
  const geojsonRef     = useRef<BCNFeatureCollection | null>(null)

  const onClickRef  = useRef(onDistrictClick)
  const unlockedRef = useRef(unlocked)
  useEffect(() => { onClickRef.current  = onDistrictClick }, [onDistrictClick])
  useEffect(() => { unlockedRef.current = unlocked        }, [unlocked])

  function addFeaturesToMap(map: L.Map, geojson: BCNFeatureCollection) {
    Object.values(layerRefs.current).forEach(l => l.remove())
    labelMarkersRef.current.forEach(m => m.remove())
    layerRefs.current    = {}
    labelMarkersRef.current = []
    geojsonRef.current   = geojson

    geojson.features.forEach(feat => {
      const id = feat.properties?.districte
      if (typeof id !== 'number' || isNaN(id)) return
      const d = DISTRICTS.find(x => x.id === id)
      if (!d) return

      const layer = L.geoJSON(feat, { style: getDistrictStyle(id, unlockedRef.current) })

      layer.on('click',     () => onClickRef.current(d))
      layer.on('mouseover', () => {
        const on = !!unlockedRef.current[id]
        layer.setStyle({ fillOpacity: on ? 0.62 : 0.44, weight: 2 })
      })
      layer.on('mouseout',  () => layer.setStyle(getDistrictStyle(id, unlockedRef.current)))

      layer.addTo(map)
      layerRefs.current[id] = layer

      const center = layer.getBounds().getCenter()
      const marker = L.marker(center, {
        icon: L.divIcon({
          className:  'district-label',
          html:       d.name,
          iconSize:   [110, 18],
          iconAnchor: [55, 9],
        }),
        interactive: false,
      }).addTo(map)
      labelMarkersRef.current.push(marker)
    })
  }

  // Muestra u oculta la capa unificada "BARCELONA"
  function applyMergedLayer(map: L.Map, show: boolean) {
    if (!geojsonRef.current) return

    // Limpiar estado previo
    mergedLayerRef.current?.remove()
    mergedLayerRef.current = null
    bcnLabelRef.current?.remove()
    bcnLabelRef.current = null

    // Ocultar/mostrar labels de distritos individuales
    labelMarkersRef.current.forEach(m => {
      const el = m.getElement()
      if (el) el.style.opacity = show ? '0' : '1'
    })

    if (show) {
      // Pintar todos los features con el estilo unificado
      const merged = L.geoJSON(geojsonRef.current, { style: BARCELONA_STYLE })
      merged.addTo(map)
      mergedLayerRef.current = merged

      // Label central "BARCELONA"
      const bounds = merged.getBounds()
      const center = bounds.getCenter()
      bcnLabelRef.current = L.marker(center, {
        icon: L.divIcon({
          className:  'district-label',
          html:       '<span style="font-size:18px;letter-spacing:4px;color:#c9a84c;font-weight:700">BARCELONA</span>',
          iconSize:   [200, 28],
          iconAnchor: [100, 14],
        }),
        interactive: false,
      }).addTo(map)
    }
  }

  // Mount
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return

    const map = L.map(mapRef.current, {
      center: [41.3851, 2.1734],
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      maxZoom: 19,
    }).addTo(map)

    mapInstance.current = map

    fetchGeoJSON()
      .then(geojson => addFeaturesToMap(map, geojson))
      .catch(() => {
        const fallback = normalizeFeatures(FALLBACK_GEOJSON as BCNFeatureCollection)
        addFeaturesToMap(map, fallback)
      })

    return () => {
      map.remove()
      mapInstance.current  = null
      layerRefs.current    = {}
      mergedLayerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Refrescar estilos individuales
  useEffect(() => {
    if (allUnlocked) return  // cuando está todo desbloqueado el mapa es la capa unida
    Object.entries(layerRefs.current).forEach(([idStr, layer]) => {
      layer.setStyle(getDistrictStyle(Number(idStr), unlocked))
    })
  }, [unlocked, allUnlocked])

  // Activar/desactivar capa unificada cuando cambia allUnlocked
  useEffect(() => {
    if (!mapInstance.current) return
    applyMergedLayer(mapInstance.current, allUnlocked)
  }, [allUnlocked]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}