import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PinInput } from './PinInput';
import { verifyAliasPin } from '../services/aliasService';
import { normalizeAlias } from '../services/pinService';
import { trackNoteAccessed } from '../services/analyticsService';

export const AliasAccessForm: React.FC = () => {
  const { t } = useTranslation();
  const [alias, setAlias] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ until: number } | null>(null);
  const navigate = useNavigate();

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setAlias(value);
    setError('');
    setLockoutInfo(null);
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLockoutInfo(null);

    const normalizedAlias = normalizeAlias(alias);

    if (!normalizedAlias) {
      setError(t('errors.enterAlias'));
      return;
    }

    if (!pin) {
      setError(t('errors.enterPin'));
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAliasPin(normalizedAlias, pin);

      if (result.success && result.noteId) {
        trackNoteAccessed(result.noteId);
        navigate(`/note/${result.noteId}`);
      } else {
        setError(result.error || t('errors.verifyError'));
        if (result.lockoutUntil) {
          setLockoutInfo({ until: result.lockoutUntil });
        }
        setPin('');
      }
    } catch (err) {
      setError(t('errors.accessError'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  const formatLockoutTime = (lockoutUntil: number): string => {
    const remaining = Math.max(0, lockoutUntil - Date.now());
    const minutes = Math.ceil(remaining / 60000);
    return t('alias.waitMessage', { minutes });
  };

  return (
    <div className="alias-access-form">
      <h2>{t('alias.accessTitle')}</h2>
      <p>{t('alias.accessDescription')}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="input-text"
            value={alias}
            onChange={handleAliasChange}
            onKeyPress={handleKeyPress}
            placeholder={t('alias.aliasPlaceholder')}
            disabled={loading}
            aria-label={t('alias.aliasPlaceholder')}
          />
        </div>

        <div className="form-group">
          <PinInput
            value={pin}
            onChange={handlePinChange}
            placeholder={t('alias.pinPlaceholder')}
            disabled={loading}
            error={!!error}
          />
        </div>

        {error && <p className="input-error">{error}</p>}

        {lockoutInfo && (
          <p className="lockout-message">
            {formatLockoutTime(lockoutInfo.until)}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !!lockoutInfo}
        >
          {loading ? t('alias.verifying') : t('common.access')}
        </button>
      </form>
    </div>
  );
};
