import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NotePage } from './pages/NotePage';
import { initializeFirebase } from './services/firebase';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeFirebase();
        setInitialized(true);
      } catch (err) {
        setError('Erro ao inicializar aplicação. Verifique a configuração do Firebase.');
        console.error(err);
      }
    };

    init();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!initialized) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:noteId" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
