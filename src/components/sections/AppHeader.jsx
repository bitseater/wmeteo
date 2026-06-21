import { useTranslation } from 'react-i18next'

export default function AppHeader({ showMap }) {
  const { t } = useTranslation()

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{t('header.eyebrow')}</p>
        <h1>WMeteo</h1>
        <p className="subtitle">
          {showMap
            ? t('header.subtitle_map')
            : t('header.subtitle_weather')}
        </p>
      </div>
    </header>
  )
}
