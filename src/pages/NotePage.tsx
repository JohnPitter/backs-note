import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNote } from '../hooks/useNote';
import { NoteEditor } from '../components/NoteEditor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CreateAliasModal } from '../components/CreateAliasModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { isValidNoteId } from '../utils/idGenerator';
import { trackPageView } from '../services/analyticsService';

export const NotePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { note, loading, error, updateContent } = useNote(noteId || null);
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false);
  const [aliasCreated, setAliasCreated] = useState<string | null>(null);

  useEffect(() => {
    if (noteId) {
      trackPageView('note');
    }
  }, [noteId]);

  const handleOpenAliasModal = () => {
    setIsAliasModalOpen(true);
  };

  const handleCloseAliasModal = () => {
    setIsAliasModalOpen(false);
  };

  const handleAliasCreated = (alias: string) => {
    setAliasCreated(alias);
  };

  if (!noteId || !isValidNoteId(noteId)) {
    return (
      <div className="note-page">
        <ErrorMessage message={t('note.invalidId')} />
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          {t('note.backToHome')}
        </button>
      </div>
    );
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(noteId);
      alert(t('note.idCopied'));
    } catch (err) {
      alert(t('note.copyError'));
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatDate = (timestamp: number) => {
    const locale = i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US';
    return new Date(timestamp).toLocaleString(locale);
  };

  return (
    <div className="note-page">
      <header className="note-header">
        <div className="note-header-left">
          <button className="btn-icon" onClick={handleGoHome} aria-label={t('note.backToHome')}>
            ← {t('note.backToHome')}
          </button>
          <h1 className="note-title">{t('common.appName')}</h1>
        </div>
        <div className="note-header-right">
          <LanguageSelector />
          <button
            className="btn btn-alias"
            onClick={handleOpenAliasModal}
            aria-label={t('note.createAlias')}
          >
            🔗 {t('note.createAlias')}
          </button>
          <div className="note-id-container">
            <span className="note-id-label">ID:</span>
            <code className="note-id">{noteId}</code>
            <button className="btn-copy" onClick={handleCopyId} aria-label={t('note.copyId')}>
              📋
            </button>
          </div>
        </div>
      </header>

      <main className="note-main">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && note && (
          <NoteEditor note={note} onContentChange={updateContent} />
        )}
      </main>

      <footer className="note-footer">
        <span className="sync-indicator">
          {loading ? `🔄 ${t('note.loading')}` : `✓ ${t('note.synced')}`}
        </span>
        <div className="footer-right">
          {aliasCreated && (
            <span className="alias-badge" title={`Alias: ${aliasCreated}`}>
              🔗 {aliasCreated}
            </span>
          )}
          {note && (
            <span className="note-metadata">
              {t('note.lastUpdate')}: {formatDate(note.updatedAt)}
            </span>
          )}
        </div>
      </footer>

      <CreateAliasModal
        noteId={noteId || ''}
        isOpen={isAliasModalOpen}
        onClose={handleCloseAliasModal}
        onSuccess={handleAliasCreated}
      />
    </div>
  );
};
