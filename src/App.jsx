import React, { useState } from 'react'

const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '🌥️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️',
  }
  return iconMap[iconCode] || '🌤️'
}

const formatTime = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const getLocalDate = (timestamp, timezoneOffset) => {
  return new Date((timestamp + timezoneOffset) * 1000)
}

const getDailyForecast = (forecastList, timezoneOffset) => {
  const grouped = {}

  forecastList.forEach((item) => {
    const dateKey = getLocalDate(item.dt, timezoneOffset).toISOString().split('T')[0]
    grouped[dateKey] = grouped[dateKey] || []
    grouped[dateKey].push(item)
  })

  const sortedKeys = Object.keys(grouped).sort()
  const todayKey = getLocalDate(forecastList[0]?.dt || Math.floor(Date.now() / 1000), timezoneOffset)
    .toISOString()
    .split('T')[0]

  return sortedKeys
    .filter((dateKey) => dateKey !== todayKey)
    .slice(0, 5)
    .map((dateKey) => {
      const items = grouped[dateKey]
      const midday = items.find((item) => getLocalDate(item.dt, timezoneOffset).getHours() === 12) || items[Math.floor(items.length / 2)]
      const temps = items.map((item) => item.main.temp)
      return {
        dateLabel: getLocalDate(midday.dt, timezoneOffset).toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        tempMin: `${Math.round(Math.min(...temps))}°C`,
        tempMax: `${Math.round(Math.max(...temps))}°C`,
        minTemp: Math.round(Math.min(...temps)),
        maxTemp: Math.round(Math.max(...temps)),
        icon: getWeatherIcon(midday.weather[0].icon),
        description: midday.weather[0].description,
      }
    })
}

export default function App() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [locations, setLocations] = useState([])
  const [message, setMessage] = useState('Introduce una ciudad y pulsa Buscar para ver el clima actual.')
  const [loading, setLoading] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  const chartConfig = {
    width: 560,
    height: 220,
    margin: { top: 28, right: 16, bottom: 34, left: 32 },
  }

  const forecastPoints = weather?.daily?.length
    ? (() => {
        const values = weather.daily.flatMap((day) => [day.maxTemp, day.minTemp])
        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)
        const range = maxValue - minValue || 1
        const plotWidth = chartConfig.width - chartConfig.margin.left - chartConfig.margin.right
        const plotHeight = chartConfig.height - chartConfig.margin.top - chartConfig.margin.bottom

        return weather.daily.map((day, index) => {
          const x = chartConfig.margin.left + (index / ((weather.daily.length - 1) || 1)) * plotWidth
          const yMax = chartConfig.margin.top + (1 - (day.maxTemp - minValue) / range) * plotHeight
          const yMin = chartConfig.margin.top + (1 - (day.minTemp - minValue) / range) * plotHeight
          return { ...day, x, yMax, yMin }
        })
      })()
    : []

  const fetchWeatherByCoords = async (location) => {
    const params = `lat=${location.lat}&lon=${location.lon}&units=metric&lang=es&appid=${apiKey}`
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json()
      throw new Error(errorData.message || 'Error al obtener el clima')
    }

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`)
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json()
      throw new Error(errorData.message || 'Error al obtener el pronóstico')
    }

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()

    const hourly = Array.isArray(forecastData.list)
      ? forecastData.list.slice(0, 4).map((item) => ({
          time: formatTime(item.dt, weatherData.timezone),
          temp: `${Math.round(item.main.temp)}°C`,
        }))
      : []

    const dailyForecast = Array.isArray(forecastData.list)
      ? getDailyForecast(forecastData.list, weatherData.timezone)
      : []

    return {
      city: location.name || weatherData.name,
      state: location.state,
      country: weatherData.sys.country,
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      wind: Math.round(weatherData.wind.speed * 3.6),
      feelsLike: Math.round(weatherData.main.feels_like),
      uvIndex: '-',
      sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
      sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
      icon: getWeatherIcon(weatherData.weather[0].icon),
      details: [
        { label: 'Temperatura', value: `${Math.round(weatherData.main.temp)}°C` },
        { label: 'Sensación', value: `${Math.round(weatherData.main.feels_like)}°C` },
        { label: 'Humedad', value: `${weatherData.main.humidity}%` },
        { label: 'Viento', value: `${Math.round(weatherData.wind.speed * 3.6)} km/h` },
        { label: 'Índice UV', value: 'N/A' },
        { label: 'Amanecer', value: formatTime(weatherData.sys.sunrise, weatherData.timezone) },
        { label: 'Atardecer', value: formatTime(weatherData.sys.sunset, weatherData.timezone) },
      ],
      hourly,
      daily: dailyForecast,
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const city = cityInput.trim()
    if (!city) {
      setMessage('Por favor escribe el nombre de una ciudad.')
      setWeather(null)
      setLocations([])
      return
    }

    if (!apiKey) {
      setMessage('Falta la clave de OpenWeather. Crea un archivo .env con VITE_OPENWEATHER_API_KEY.')
      setWeather(null)
      setLocations([])
      return
    }

    setLoading(true)
    setMessage('')
    setWeather(null)
    setLocations([])

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`
      )
      if (!geoResponse.ok) {
        const errorData = await geoResponse.json()
        throw new Error(errorData.message || 'No se encontró la ciudad')
      }

      const geoData = await geoResponse.json()
      if (!Array.isArray(geoData) || geoData.length === 0) {
        throw new Error('No se encontró ninguna ciudad con ese nombre')
      }

      if (geoData.length > 1) {
        setLocations(
          geoData.map((item) => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
          }))
        )
        setMessage('Selecciona la ciudad correcta de la lista.')
        return
      }

      const weatherResult = await fetchWeatherByCoords({
        name: geoData[0].name,
        state: geoData[0].state,
        country: geoData[0].country,
        lat: geoData[0].lat,
        lon: geoData[0].lon,
      })

      setWeather(weatherResult)
    } catch (error) {
      setWeather(null)
      setLocations([])
      setMessage(`Error obteniendo el clima: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = async (location) => {
    setLoading(true)
    setMessage('')
    setLocations([])

    try {
      const weatherResult = await fetchWeatherByCoords(location)
      setWeather(weatherResult)
    } catch (error) {
      setMessage(`Error obteniendo el clima: ${error.message}`)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app weather-app">
      <div className="top-actions">
        <button type="button">Ver Mapa</button>
        <button type="button">Configuración</button>
        <button type="button" onClick={() => setShowAbout(true)}>Acerca de</button>
      </div>

      <header className="app-header">
        <div>
          <p className="eyebrow">Consulta el clima de tu ciudad</p>
          <h1>WMeteo</h1>
          <p className="subtitle">Escribe una ciudad para ver la previsión meteorológica.</p>
        </div>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="city">Elegir ciudad</label>
        <div className="input-row">
          <input
            id="city"
            type="text"
            placeholder="Madrid, Barcelona, Sevilla..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </div>
      </form>

      {locations.length > 0 && (
        <section className="location-list-card">
          <div className="info-title">Ciudades encontradas</div>
          <div className="location-list">
            {locations.map((location) => (
              <button
                key={`${location.name}-${location.state || 'no'}-${location.country}-${location.lat}-${location.lon}`}
                type="button"
                className="location-item"
                onClick={() => handleLocationSelect(location)}
              >
                <span>{location.name}{location.state ? `, ${location.state}` : ''}</span>
                <small>{location.country}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {message && !weather && (
        <div className="alert-message">{message}</div>
      )}

      {weather && (
        <section className="weather-card">
          <div className="weather-main">
            <div className="weather-summary">
              <div className="location">
                <span>{weather.city}</span>
                <small>
                  {weather.state ? `${weather.state}, ` : ''}
                  {weather.country}
                </small>
              </div>
              <h2>{weather.temp}°</h2>
              <p>{weather.description}</p>
            </div>
            <div className="weather-icon">{weather.icon}</div>
          </div>

          <div className="weather-grid">
            <div className="weather-info">
              <div className="info-title">Detalles del clima</div>
              <div className="details-list">
                {weather.details.map((item) => (
                  <div key={item.label} className="detail-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="weather-forecast">
              <div className="info-title">Pronóstico horario</div>
              <div className="forecast-list">
                {weather.hourly.map((hour) => (
                  <div key={hour.time} className="forecast-item">
                    <span>{hour.time}</span>
                    <strong>{hour.temp}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {weather?.daily?.length > 0 && (
        <section className="daily-forecast-card">
          <div className="info-title">Pronóstico para los próximos 5 días</div>
          <div className="forecast-chart-card">
            <svg
              width={chartConfig.width}
              height={chartConfig.height}
              viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
              role="img"
              aria-label="Pronóstico de temperatura máxima y mínima"
            >
              <rect
                x="0"
                y="0"
                width={chartConfig.width}
                height={chartConfig.height}
                fill="transparent"
              />
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
                Máximo
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                Mínimo
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
      )}

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Acerca de WMeteo</h2>
              <button className="close-button-top" onClick={() => setShowAbout(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">
                WMeteo es una aplicación meteorológica moderna, intuitiva y de alto rendimiento que te permite consultar el clima actual y la previsión de los próximos días de cualquier ciudad del mundo.
              </p>
              
              <h3>Características clave</h3>
              <div className="about-features">
                <div className="about-feature-item">
                  <span className="feature-icon">🔍</span>
                  <div>
                    <strong>Búsqueda avanzada</strong>
                    <p>Encuentra ciudades del mundo y resuelve conflictos de nombres duplicados al instante.</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <span className="feature-icon">📊</span>
                  <div>
                    <strong>Gráfico de tendencia</strong>
                    <p>Visualiza de forma clara las fluctuaciones de temperaturas máximas y mínimas para los próximos 5 días.</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <span className="feature-icon">⏱️</span>
                  <div>
                    <strong>Pronóstico por horas</strong>
                    <p>Visualización del clima en las próximas horas para planificar tu día con precisión.</p>
                  </div>
                </div>
              </div>

              <h3>Tecnologías utilizadas</h3>
              <div className="tech-badges">
                <span className="tech-badge react">React</span>
                <span className="tech-badge vite">Vite</span>
                <span className="tech-badge api">OpenWeather API</span>
                <span className="tech-badge svg">SVG Dinámico</span>
                <span className="tech-badge css">Vanilla CSS</span>
              </div>
            </div>
            <div className="modal-footer">
              <p className="version-tag">Versión 1.0.0 — Creado con ❤️ para una experiencia premium</p>
              <button className="close-button" onClick={() => setShowAbout(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
