import { useTranslation } from 'react-i18next'

export default function MapMenuSection({ showMap, onToggleMap }) {
  const { t } = useTranslation()

  return (
    <button type="button" onClick={onToggleMap}>
      {showMap ? t('menu.view_weather') : t('menu.view_map')}
    </button>
  )
}
