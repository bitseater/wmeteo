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
        icon: getWeatherIcon(midday.weather[0].icon),
        description: midday.weather[0].description,
      }
    })
}

export default function App() {
  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [message, setMessage] = useState('Introduce una ciudad y pulsa Buscar para ver el clima actual.')
  const [loading, setLoading] = useState(false)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  const handleSearch = async (event) => {
    event.preventDefault()
    const city = cityInput.trim()
    if (!city) {
      setMessage('Por favor escribe el nombre de una ciudad.')
      setWeather(null)
      return
    }

    if (!apiKey) {
      setMessage('Falta la clave de OpenWeather. Crea un archivo .env con VITE_OPENWEATHER_API_KEY.')
      setWeather(null)
      return
    }

    setLoading(true)
    setMessage('')
    setWeather(null)

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`
      )
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json()
        throw new Error(errorData.message || 'No se encontró la ciudad')
      }

      const weatherData = await weatherResponse.json()
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`
      )
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

      const weatherResult = {
        city: weatherData.name,
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

      setWeather(weatherResult)
    } catch (error) {
      setWeather(null)
      setMessage(`Error obteniendo el clima: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app weather-app">
      <header className="app-header">
        <div>
          <p className="eyebrow">WMeteo</p>
          <h1>Consulta el clima de tu ciudad</h1>
          <p className="subtitle">Escribe una ciudad para ver el contenido en formato de tarjeta meteorológica.</p>
        </div>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="city">Ciudad</label>
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

      {message && !weather && (
        <div className="alert-message">{message}</div>
      )}

      {weather && (
        <section className="weather-card">
          <div className="weather-main">
            <div className="weather-summary">
              <div className="location">
                <span>{weather.city}</span>
                <small>{weather.country}</small>
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
          <div className="daily-grid">
            {weather.daily.map((day) => (
              <div key={day.dateLabel} className="daily-day">
                <span className="daily-day-label">{day.dateLabel}</span>
                <div className="daily-day-icon">{day.icon}</div>
                <span className="daily-day-desc">{day.description}</span>
                <div className="daily-day-temp">
                  <strong>{day.tempMax}</strong>
                  <span>{day.tempMin}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
