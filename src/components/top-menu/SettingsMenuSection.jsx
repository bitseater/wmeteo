import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SettingsMenuSection({ theme, onThemeChange }) {
  const { t } = useTranslation()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setShowSettings(true)}>
        {t('menu.settings')}
      </button>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('settings.title')}</h2>
              <button className="close-button-top" onClick={() => setShowSettings(false)}>&times;</button>
            </div>

            <div className="modal-body">
              {/* ── Theme selector ── */}
              <div className="theme-options" role="radiogroup" aria-label={t('settings.theme_label')}>
                <button
                  type="button"
                  className={`theme-option ${theme === 'light' ? 'is-selected' : ''}`}
                  onClick={() => onThemeChange('light')}
                  role="radio"
                  aria-checked={theme === 'light'}
                >
                  <span className="theme-swatch theme-swatch-light"></span>
                  <span>
                    <strong>{t('settings.theme_light_title')}</strong>
                    <small>{t('settings.theme_light_desc')}</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`theme-option ${theme === 'dark' ? 'is-selected' : ''}`}
                  onClick={() => onThemeChange('dark')}
                  role="radio"
                  aria-checked={theme === 'dark'}
                >
                  <span className="theme-swatch theme-swatch-dark"></span>
                  <span>
                    <strong>{t('settings.theme_dark_title')}</strong>
                    <small>{t('settings.theme_dark_desc')}</small>
                  </span>
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <p className="version-tag">
                {t('settings.theme_current', {
                  theme: theme === 'dark' ? t('settings.theme_current_dark') : t('settings.theme_current_light'),
                })}
              </p>
              <button className="close-button" onClick={() => setShowSettings(false)}>
                {t('settings.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
