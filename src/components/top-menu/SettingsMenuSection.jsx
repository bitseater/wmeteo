import { useState } from 'react'

export default function SettingsMenuSection({ theme, onThemeChange }) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setShowSettings(true)}>
        Configuración
      </button>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Configuración</h2>
              <button className="close-button-top" onClick={() => setShowSettings(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="theme-options" role="radiogroup" aria-label="Tema de color">
                <button
                  type="button"
                  className={`theme-option ${theme === 'light' ? 'is-selected' : ''}`}
                  onClick={() => onThemeChange('light')}
                  role="radio"
                  aria-checked={theme === 'light'}
                >
                  <span className="theme-swatch theme-swatch-light"></span>
                  <span>
                    <strong>Claro</strong>
                    <small>Fondo luminoso y tarjetas claras.</small>
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
                    <strong>Oscuro</strong>
                    <small>Contraste alto para poca luz.</small>
                  </span>
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <p className="version-tag">Tema actual: {theme === 'dark' ? 'oscuro' : 'claro'}</p>
              <button className="close-button" onClick={() => setShowSettings(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
