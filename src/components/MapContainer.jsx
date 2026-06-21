import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MapContainer({ city }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const plab = t('map.layers.precipitation')
  const pslab = t('map.layers.pressure')
  const rlab = t('map.layers.radar')
  const tlab = t('map.layers.temperature')
  const wlab = t('map.layers.wind')
  const p36 = t('map.controls.play')
  const pau = t('map.controls.pause')

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
            <h3>{t('map.title')}</h3>
            <p className="map-subtitle">
              {city
                ? t('map.showing_city', {
                    city: city.name,
                    state: city.state ? `, ${city.state}` : '',
                    country: city.country,
                  })
                : t('map.showing_global')}
            </p>
          </div>
        </div>
      </div>
      <div className="map-iframe-wrapper">
        {loading && (
          <div className="map-spinner-overlay">
            <div className="spinner"></div>
            <p>{t('map.loading')}</p>
          </div>
        )}
        <iframe
          src={url}
          className="map-iframe"
          onLoad={() => setLoading(false)}
          title={t('map.iframe_title')}
          allowFullScreen
        ></iframe>
      </div>
    </section>
  )
}
