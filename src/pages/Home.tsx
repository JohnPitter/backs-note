import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateNoteId, isValidNoteId } from '../utils/idGenerator';
import { trackPageView, trackNoteCreated, trackNoteAccessed } from '../services/analyticsService';

export const Home: React.FC = () => {
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
      setError('Por favor, insira um ID de nota');
      return;
    }

    if (!isValidNoteId(noteId)) {
      setError('ID de nota inválido');
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
          <h1 className="home-title">Backs Note</h1>
          <p className="home-subtitle">Notepad online para registro rápido de notas</p>
        </header>

        <div className="home-actions">
          <div className="action-card">
            <h2>Nova Nota</h2>
            <p>Crie uma nova nota com um ID único</p>
            <button className="btn btn-primary" onClick={handleCreateNew}>
              Criar Nova Nota
            </button>
          </div>

          <div className="divider">
            <span>ou</span>
          </div>

          <div className="action-card">
            <h2>Acessar Nota Existente</h2>
            <p>Insira o ID de uma nota existente</p>
            <div className="input-group">
              <input
                type="text"
                className="input-text"
                placeholder="ID da nota"
                value={noteId}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                aria-label="ID da nota"
              />
              <button className="btn btn-secondary" onClick={handleAccessExisting}>
                Acessar
              </button>
            </div>
            {error && <p className="input-error">{error}</p>}
          </div>
        </div>

        <footer className="home-footer">
          <p>Suas notas são armazenadas de forma segura e acessíveis de qualquer lugar</p>
        </footer>
      </div>
    </div>
  );
};
