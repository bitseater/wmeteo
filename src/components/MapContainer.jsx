import React, { useState, useEffect } from 'react'

export default function MapContainer({ city }) {
  const [loading, setLoading] = useState(true)

  const plab = 'Precipitación'
  const pslab = 'Presión'
  const rlab = 'Radar'
  const tlab = 'Temperatura'
  const wlab = 'Viento'
  const p36 = 'Reproducir 3600x'
  const pau = 'Pausa'

  const params = [
    `plab=${encodeURIComponent(plab)}`,
    `pslab=${encodeURIComponent(pslab)}`,
    `rlab=${encodeURIComponent(rlab)}`,
    `tlab=${encodeURIComponent(tlab)}`,
    `wlab=${encodeURIComponent(wlab)}`,
    `p36=${encodeURIComponent(p36)}`,
    `pau=${encodeURIComponent(pau)}`,
  ]

  const config = '?' + params.join('&')
  let endUrl = ''

  if (city && city.lat !== undefined && city.lon !== undefined) {
    endUrl = `#5/${city.lat}/${city.lon}`
  }

  const url = `https://bitseater.gitlab.io/meteomap/meteomap.html${config}${endUrl}`

  useEffect(() => {
    setLoading(true)
  }, [url])

  return (
    <section className="map-card">
      <div className="map-header">
        <div className="map-title-area">
          <span className="map-icon-badge">🗺️</span>
          <div>
            <h3>Mapa Climatológico</h3>
            <p className="map-subtitle">
              {city
                ? `Mostrando mapa para ${city.name}${city.state ? `, ${city.state}` : ''} (${city.country})`
                : 'Mostrando mapa global'}
            </p>
          </div>
        </div>
      </div>
      <div className="map-iframe-wrapper">
        {loading && (
          <div className="map-spinner-overlay">
            <div className="spinner"></div>
            <p>Cargando mapa interactivo...</p>
          </div>
        )}
        <iframe
          src={url}
          className="map-iframe"
          onLoad={() => setLoading(false)}
          title="Mapa Meteorológico"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  )
}
