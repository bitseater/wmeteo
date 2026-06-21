import AboutMenuSection from './AboutMenuSection'
import MapMenuSection from './MapMenuSection'
import SettingsMenuSection from './SettingsMenuSection'

export default function TopMenu({ theme, onThemeChange, showMap, onToggleMap, onLanguageChange }) {
  return (
    <div className="top-actions">
      <MapMenuSection showMap={showMap} onToggleMap={onToggleMap} />
      <SettingsMenuSection
        theme={theme}
        onThemeChange={onThemeChange}
        onLanguageChange={onLanguageChange}
      />
      <AboutMenuSection />
    </div>
  )
}
