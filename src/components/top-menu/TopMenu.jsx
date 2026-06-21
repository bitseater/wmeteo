import AboutMenuSection from './AboutMenuSection'
import MapMenuSection from './MapMenuSection'
import SettingsMenuSection from './SettingsMenuSection'

export default function TopMenu({ theme, onThemeChange, showMap, onToggleMap }) {
  return (
    <div className="top-actions">
      <MapMenuSection showMap={showMap} onToggleMap={onToggleMap} />
      <SettingsMenuSection theme={theme} onThemeChange={onThemeChange} />
      <AboutMenuSection />
    </div>
  )
}
