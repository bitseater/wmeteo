import { useTranslation } from 'react-i18next'

export default function SearchForm({ cityInput, onChange, onSubmit }) {
  const { t } = useTranslation()

  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label htmlFor="city">{t('search.label')}</label>
      <div className="input-row">
        <input
          id="city"
          type="text"
          placeholder={t('search.placeholder')}
          value={cityInput}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit">{t('search.button')}</button>
      </div>
    </form>
  )
}
