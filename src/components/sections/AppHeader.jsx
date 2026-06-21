export default function AppHeader({ showMap }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Consulta el clima de tu ciudad</p>
        <h1>WMeteo</h1>
        <p className="subtitle">
          {showMap
            ? 'Explora el mapa del clima interactivo en tiempo real.'
            : 'Escribe una ciudad para ver la previsión meteorológica.'}
        </p>
      </div>
    </header>
  )
}
