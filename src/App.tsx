import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from './pages/Home';
import { NotePage } from './pages/NotePage';
import { initializeFirebase } from './services/firebase';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { debugHelper } from './utils/debugHelper';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (import.meta.env.DEV) {
          debugHelper.printDebugInfo();
        }
        await initializeFirebase();
        setInitialized(true);
      } catch (err) {
        setError(t('errors.initError'));
        console.error(err);
      }
    };

    init();
  }, [t]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!initialized) {
    return <LoadingSpinner />;
  }

  const basename = import.meta.env.BASE_URL || '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:noteId" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
