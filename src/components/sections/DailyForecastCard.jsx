import React from 'react'
import { useTranslation } from 'react-i18next'

const CHART_CONFIG = {
  width: 560,
  height: 220,
  margin: { top: 28, right: 16, bottom: 34, left: 32 },
}

function buildForecastPoints(daily) {
  const values = daily.flatMap((day) => [day.maxTemp, day.minTemp])
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1
  const plotWidth = CHART_CONFIG.width - CHART_CONFIG.margin.left - CHART_CONFIG.margin.right
  const plotHeight = CHART_CONFIG.height - CHART_CONFIG.margin.top - CHART_CONFIG.margin.bottom

  return daily.map((day, index) => {
    const x = CHART_CONFIG.margin.left + (index / ((daily.length - 1) || 1)) * plotWidth
    const yMax = CHART_CONFIG.margin.top + (1 - (day.maxTemp - minValue) / range) * plotHeight
    const yMin = CHART_CONFIG.margin.top + (1 - (day.minTemp - minValue) / range) * plotHeight
    return { ...day, x, yMax, yMin }
  })
}

export default function DailyForecastCard({ weather }) {
  const { t } = useTranslation()

  if (!weather?.daily?.length) return null

  const forecastPoints = buildForecastPoints(weather.daily)

  return (
    <section className="daily-forecast-card">
      <div className="info-title">{t('weather.daily_title')}</div>
      <div className="forecast-chart-card">
        <svg
          width={CHART_CONFIG.width}
          height={CHART_CONFIG.height}
          viewBox={`0 0 ${CHART_CONFIG.width} ${CHART_CONFIG.height}`}
          role="img"
          aria-label={t('weather.chart_aria')}
        >
          <rect x="0" y="0" width={CHART_CONFIG.width} height={CHART_CONFIG.height} fill="transparent" />
          <g>
            {forecastPoints.map((point, index) => (
              <React.Fragment key={`max-${point.dateLabel}`}>
                {index > 0 && (
                  <line
                    x1={forecastPoints[index - 1].x}
                    y1={forecastPoints[index - 1].yMax}
                    x2={point.x}
                    y2={point.yMax}
                    stroke="#2f6ce5"
                    strokeWidth="3"
                    fill="none"
                  />
                )}
                <circle cx={point.x} cy={point.yMax} r="4" fill="#2f6ce5" />
              </React.Fragment>
            ))}
          </g>
          <g>
            {forecastPoints.map((point, index) => (
              <React.Fragment key={`min-${point.dateLabel}`}>
                {index > 0 && (
                  <line
                    x1={forecastPoints[index - 1].x}
                    y1={forecastPoints[index - 1].yMin}
                    x2={point.x}
                    y2={point.yMin}
                    stroke="#f59e0b"
                    strokeWidth="3"
                    fill="none"
                  />
                )}
                <circle cx={point.x} cy={point.yMin} r="4" fill="#f59e0b" />
              </React.Fragment>
            ))}
          </g>
        </svg>

        <div className="forecast-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2f6ce5' }}></span>
            {t('weather.legend_max')}
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
            {t('weather.legend_min')}
          </span>
        </div>

        <div className="forecast-details-grid">
          {weather.daily.map((day) => (
            <div key={day.dateLabel} className="forecast-day-detail">
              <div className="forecast-day-label">{day.dateLabel.split(',')[0]}</div>
              <div className="forecast-day-icon">{day.icon}</div>
              <div className="forecast-day-temps">
                <div className="forecast-temp-max">{day.tempMax}°</div>
                <div className="forecast-temp-min">{day.tempMin}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
