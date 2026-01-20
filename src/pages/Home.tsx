import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateNoteId, isValidNoteId } from '../utils/idGenerator';
import { trackPageView, trackNoteCreated, trackNoteAccessed } from '../services/analyticsService';
import { AliasAccessForm } from '../components/AliasAccessForm';
import { LanguageSelector } from '../components/LanguageSelector';
import { AdBanner } from '../components/AdBanner';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [noteId, setNoteId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView('home');
  }, []);

  const handleCreateNew = () => {
    const newId = generateNoteId();
    trackNoteCreated(newId);
    navigate(`/note/${newId}`);
  };

  const handleAccessExisting = () => {
    if (!noteId.trim()) {
      setError(t('errors.enterNoteId'));
      return;
    }

    if (!isValidNoteId(noteId)) {
      setError(t('errors.invalidNoteId'));
      return;
    }

    trackNoteAccessed(noteId);
    navigate(`/note/${noteId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteId(e.target.value);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAccessExisting();
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <div className="home-header-top">
            <LanguageSelector />
          </div>
          <h1 className="home-title">{t('common.appName')}</h1>
          <p className="home-subtitle">{t('home.subtitle')}</p>
        </header>

        <div className="home-actions">
          <div className="action-card">
            <h2>{t('home.newNote.title')}</h2>
            <p>{t('home.newNote.description')}</p>
            <button className="btn btn-primary" onClick={handleCreateNew}>
              {t('home.newNote.button')}
            </button>
          </div>

          <div className="divider">
            <span>{t('common.or')}</span>
          </div>

          <div className="action-cards-row">
            <div className="action-card">
              <h2>{t('home.accessNote.title')}</h2>
              <p>{t('home.accessNote.description')}</p>
              <div className="input-group">
                <input
                  type="text"
                  className="input-text"
                  placeholder={t('home.accessNote.placeholder')}
                  value={noteId}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  aria-label={t('home.accessNote.placeholder')}
                />
                <button className="btn btn-secondary" onClick={handleAccessExisting}>
                  {t('home.accessNote.button')}
                </button>
              </div>
              {error && <p className="input-error">{error}</p>}
            </div>

            <div className="action-card">
              <AliasAccessForm />
            </div>
          </div>
        </div>

        <div className="home-ad-section">
          <AdBanner slot="1234567890" format="horizontal" />
        </div>

        <footer className="home-footer">
          <p>{t('home.footer')}</p>
        </footer>
      </div>
    </div>
  );
};
