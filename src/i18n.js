import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

const supportedLanguages = ['es', 'en', 'fr', 'de']

const normalizeLanguage = (language) => {
  const lang = language?.split('-')[0]
  return supportedLanguages.includes(lang) ? lang : null
}

const getDefaultLanguage = () => {
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  return browserLanguages.map(normalizeLanguage).find(Boolean) || 'es'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
