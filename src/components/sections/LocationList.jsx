export default function LocationList({ locations, onSelect }) {
  if (locations.length === 0) return null

  return (
    <section className="location-list-card">
      <div className="info-title">Ciudades encontradas</div>
      <div className="location-list">
        {locations.map((location) => (
          <button
            key={`${location.name}-${location.state || 'no'}-${location.country}-${location.lat}-${location.lon}`}
            type="button"
            className="location-item"
            onClick={() => onSelect(location)}
          >
            <span>{location.name}{location.state ? `, ${location.state}` : ''}</span>
            <small>{location.country}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
