import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutMenuSection() {
  const { t } = useTranslation()
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setShowAbout(true)}>
        {t('menu.about')}
      </button>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('about.title')}</h2>
              <button className="close-button-top" onClick={() => setShowAbout(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">
                {t('about.intro')}
              </p>

              <h3>{t('about.features_title')}</h3>
              <div className="about-features">
                <div className="about-feature-item">
                  <span className="feature-icon">🔍</span>
                  <div>
                    <strong>{t('about.features.search_title')}</strong>
                    <p>{t('about.features.search_desc')}</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <span className="feature-icon">📊</span>
                  <div>
                    <strong>{t('about.features.chart_title')}</strong>
                    <p>{t('about.features.chart_desc')}</p>
                  </div>
                </div>
                <div className="about-feature-item">
                  <span className="feature-icon">⏱️</span>
                  <div>
                    <strong>{t('about.features.hourly_title')}</strong>
                    <p>{t('about.features.hourly_desc')}</p>
                  </div>
                </div>
              </div>

              <h3>{t('about.tech_title')}</h3>
              <div className="tech-badges">
                <span className="tech-badge react">React</span>
                <span className="tech-badge vite">Vite</span>
                <span className="tech-badge api">OpenWeather API</span>
                <span className="tech-badge svg">{t('about.tech_svg')}</span>
                <span className="tech-badge css">Vanilla CSS</span>
              </div>
            </div>
            <div className="modal-footer">
              <div className="footer-text">
                <p className="version-tag">{t('about.version')}</p>
                <p className="copyright-tag">{t('about.copyright')}</p>
              </div>
              <div className="modal-footer-actions">
                <a
                  className="github-link"
                  href="https://github.com/bitseater/wmeteo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg height="18" width="18" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                      -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
                      2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                      0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21
                      2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04
                      2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82
                      2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
                      1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  {t('about.github')}
                </a>
                <button className="close-button" onClick={() => setShowAbout(false)}>{t('about.close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
