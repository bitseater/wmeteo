export default function MapMenuSection({ showMap, onToggleMap }) {
  return (
    <button type="button" onClick={onToggleMap}>
      {showMap ? 'Ver Clima' : 'Ver Mapa'}
    </button>
  )
}
