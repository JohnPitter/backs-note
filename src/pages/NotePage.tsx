import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNote } from '../hooks/useNote';
import { NoteEditor } from '../components/NoteEditor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { isValidNoteId } from '../utils/idGenerator';
import { trackPageView } from '../services/analyticsService';

export const NotePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { note, loading, error, updateContent } = useNote(noteId || null);

  useEffect(() => {
    if (noteId) {
      trackPageView('note');
    }
  }, [noteId]);

  if (!noteId || !isValidNoteId(noteId)) {
    return (
      <div className="note-page">
        <ErrorMessage message="ID de nota inválido" />
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Voltar para Home
        </button>
      </div>
    );
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(noteId);
      alert('ID copiado para a área de transferência!');
    } catch (err) {
      alert('Erro ao copiar ID');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="note-page">
      <header className="note-header">
        <div className="note-header-left">
          <button className="btn-icon" onClick={handleGoHome} aria-label="Voltar para home">
            ← Home
          </button>
          <h1 className="note-title">Backs Note</h1>
        </div>
        <div className="note-header-right">
          <div className="note-id-container">
            <span className="note-id-label">ID:</span>
            <code className="note-id">{noteId}</code>
            <button className="btn-copy" onClick={handleCopyId} aria-label="Copiar ID">
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
          {loading ? '🔄 Carregando...' : '✓ Sincronizado'}
        </span>
        {note && (
          <span className="note-metadata">
            Última atualização: {new Date(note.updatedAt).toLocaleString('pt-BR')}
          </span>
        )}
      </footer>
    </div>
  );
};
