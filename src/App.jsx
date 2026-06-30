import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TopMenu from './components/top-menu/TopMenu'
import MapContainer from './components/MapContainer'
import AppHeader from './components/sections/AppHeader'
import SearchForm from './components/sections/SearchForm'
import LocationList from './components/sections/LocationList'
import AlertMessage from './components/sections/AlertMessage'
import WeatherCard from './components/sections/WeatherCard'
import DailyForecastCard from './components/sections/DailyForecastCard'

// ── Helpers ──────────────────────────────────────────────────────────────────

const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '🌥️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  }
  return iconMap[iconCode] || '🌤️'
}

const formatTime = (timestamp, timezoneOffset, locale) => {
  const date = new Date((timestamp + timezoneOffset) * 1000)
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

const getLocalDate = (timestamp, timezoneOffset) =>
  new Date((timestamp + timezoneOffset) * 1000)

const getDailyForecast = (forecastList, timezoneOffset, locale) => {
  const grouped = {}

  forecastList.forEach((item) => {
    const dateKey = getLocalDate(item.dt, timezoneOffset).toISOString().split('T')[0]
    grouped[dateKey] = grouped[dateKey] || []
    grouped[dateKey].push(item)
  })

  const sortedKeys = Object.keys(grouped).sort()
  const todayKey = getLocalDate(
    forecastList[0]?.dt || Math.floor(Date.now() / 1000),
    timezoneOffset
  ).toISOString().split('T')[0]

  return sortedKeys
    .filter((dateKey) => dateKey !== todayKey)
    .slice(0, 5)
    .map((dateKey) => {
      const items = grouped[dateKey]
      const midday =
        items.find((item) => getLocalDate(item.dt, timezoneOffset).getHours() === 12) ||
        items[Math.floor(items.length / 2)]
      const temps = items.map((item) => item.main.temp)
      return {
        dateLabel: getLocalDate(midday.dt, timezoneOffset).toLocaleDateString(locale, {
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function App() {
  const { t, i18n } = useTranslation()

  const [cityInput, setCityInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [locations, setLocations] = useState([])
  const [message, setMessage] = useState(null) // null = use initial key
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('wmeteo-theme') || 'light')
  const [showMap, setShowMap] = useState(false)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  // Map i18next language code to OpenWeather lang and date locale
  const langMap = {
    es: { owLang: 'es', dateLocale: 'es-ES' },
    en: { owLang: 'en', dateLocale: 'en-GB' },
    fr: { owLang: 'fr', dateLocale: 'fr-FR' },
    de: { owLang: 'de', dateLocale: 'de-DE' },
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('wmeteo-theme', theme)
  }, [theme])

  const loadSavedCity = () => {
    try {
      const stored = localStorage.getItem('city')
      if (stored && stored !== '[]') {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return { lat: parsed[0], lon: parsed[1], name: parsed[2], state: parsed[3], country: parsed[4] }
        }
      }
    } catch (e) {
      console.error('Error loading saved city:', e)
    }
    return null
  }

  const fetchWeatherByCoords = async (location, langOverride) => {
    const lang = langOverride || i18n.language
    const { owLang, dateLocale } = langMap[lang] || langMap.es
    const params = `lat=${location.lat}&lon=${location.lon}&units=metric&lang=${owLang}&appid=${apiKey}`
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json()
      throw new Error(errorData.message || t('messages.error_clima'))
    }

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`)
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json()
      throw new Error(errorData.message || t('messages.error_forecast'))
    }

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()

    const savedCity = [
      location.lat,
      location.lon,
      location.name || weatherData.name,
      location.state || '',
      weatherData.sys.country || '',
    ]
    try {
      localStorage.setItem('city', JSON.stringify(savedCity))
    } catch (e) {
      console.error('Error saving city to localStorage:', e)
    }

    const hourly = Array.isArray(forecastData.list)
      ? forecastData.list.slice(0, 4).map((item) => ({
          time: formatTime(item.dt, weatherData.timezone, dateLocale),
          temp: `${Math.round(item.main.temp)}°C`,
        }))
      : []

    const daily = Array.isArray(forecastData.list)
      ? getDailyForecast(forecastData.list, weatherData.timezone, dateLocale)
      : []

    return {
      city: location.name || weatherData.name,
      state: location.state,
      country: weatherData.sys.country,
      lat: location.lat,
      lon: location.lon,
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      wind: Math.round(weatherData.wind.speed * 3.6),
      feelsLike: Math.round(weatherData.main.feels_like),
      uvIndex: '-',
      sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone, dateLocale),
      sunset: formatTime(weatherData.sys.sunset, weatherData.timezone, dateLocale),
      icon: getWeatherIcon(weatherData.weather[0].icon),
      details: [
        { label: t('weather.details.temperature'), value: `${Math.round(weatherData.main.temp)}°C` },
        { label: t('weather.details.feels_like'),   value: `${Math.round(weatherData.main.feels_like)}°C` },
        { label: t('weather.details.humidity'),     value: `${weatherData.main.humidity}%` },
        { label: t('weather.details.wind'),         value: `${Math.round(weatherData.wind.speed * 3.6)} km/h` },
        { label: t('weather.details.uv_index'),     value: 'N/A' },
        { label: t('weather.details.sunrise'),      value: formatTime(weatherData.sys.sunrise, weatherData.timezone, dateLocale) },
        { label: t('weather.details.sunset'),       value: formatTime(weatherData.sys.sunset, weatherData.timezone, dateLocale) },
      ],
      hourly,
      daily,
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const city = cityInput.trim()
    if (!city) {
      setMessage(t('messages.empty_city'))
      setWeather(null)
      setLocations([])
      return
    }

    if (!apiKey) {
      setMessage(t('messages.no_api_key'))
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
        throw new Error(errorData.message || t('messages.city_not_found'))
      }

      const geoData = await geoResponse.json()
      if (!Array.isArray(geoData) || geoData.length === 0) {
        throw new Error(t('messages.no_city_found'))
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
        setMessage(t('messages.select_city'))
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
      setMessage(t('messages.error_weather', { message: error.message }))
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
      setMessage(t('messages.error_weather', { message: error.message }))
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const mapCity =
    weather?.lat !== undefined
      ? { lat: weather.lat, lon: weather.lon, name: weather.city, state: weather.state, country: weather.country }
      : loadSavedCity()

  const displayMessage = message === null ? t('messages.initial') : message

  return (
    <div className="app weather-app">
      {weather && (
        <TopMenu
          theme={theme}
          onThemeChange={setTheme}
          showMap={showMap}
          onToggleMap={() => setShowMap((prev) => !prev)}
        />
      )}

      <AppHeader showMap={showMap} />

      {showMap ? (
        <MapContainer city={mapCity} />
      ) : (
        <>
          <SearchForm
            cityInput={cityInput}
            onChange={setCityInput}
            onSubmit={handleSearch}
          />
          <LocationList locations={locations} onSelect={handleLocationSelect} />
          {!weather && <AlertMessage message={displayMessage} />}
          <WeatherCard weather={weather} />
          <DailyForecastCard weather={weather} />
        </>
      )}
    </div>
  )
}
