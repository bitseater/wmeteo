export default function SearchForm({ cityInput, onChange, onSubmit }) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label htmlFor="city">Elegir ciudad</label>
      <div className="input-row">
        <input
          id="city"
          type="text"
          placeholder="Madrid, Barcelona, Sevilla..."
          value={cityInput}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </div>
    </form>
  )
}
