export default function WeatherCard({ weather }) {
  if (!weather) return null

  return (
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
  )
}
