import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from './PinInput';
import { isValidAlias, isValidPin, normalizeAlias } from '../services/pinService';
import { createAlias, aliasExists } from '../services/aliasService';

interface CreateAliasModalProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (alias: string) => void;
}

export const CreateAliasModal: React.FC<CreateAliasModalProps> = ({
  noteId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [alias, setAlias] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdAlias, setCreatedAlias] = useState('');

  if (!isOpen) return null;

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setAlias(value);
    setError('');
  };

  const validateForm = async (): Promise<string | null> => {
    const normalizedAlias = normalizeAlias(alias);

    if (!normalizedAlias) {
      return t('errors.enterAliasForNote');
    }

    if (!isValidAlias(normalizedAlias)) {
      return t('errors.invalidAlias');
    }

    if (!pin) {
      return t('errors.enterPinForAlias');
    }

    if (!isValidPin(pin)) {
      return t('errors.invalidPin');
    }

    if (pin !== confirmPin) {
      return t('errors.pinsDontMatch');
    }

    // Check if alias already exists
    try {
      const exists = await aliasExists(normalizedAlias);
      if (exists) {
        return t('errors.aliasInUse');
      }
    } catch {
      return t('errors.aliasCheckError');
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validationError = await validateForm();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      const normalizedAlias = normalizeAlias(alias);
      await createAlias(normalizedAlias, noteId, pin);

      setCreatedAlias(normalizedAlias);
      setStep('success');
      onSuccess(normalizedAlias);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.createAliasError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlias('');
    setPin('');
    setConfirmPin('');
    setError('');
    setStep('form');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 'form' ? t('alias.createTitle') : t('alias.createSuccess')}</h2>
          <button className="modal-close" onClick={handleClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="modal-body">
            <p className="modal-description">
              {t('alias.createDescription')}
            </p>

            <div className="form-group">
              <label htmlFor="alias">{t('alias.aliasLabel')}</label>
              <input
                id="alias"
                type="text"
                className="input-text"
                value={alias}
                onChange={handleAliasChange}
                placeholder={t('alias.aliasExample')}
                maxLength={30}
                disabled={loading}
                autoFocus
              />
              <span className="form-hint">
                {t('alias.aliasHint')}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="pin">{t('alias.pinLabel')}</label>
              <PinInput
                value={pin}
                onChange={setPin}
                placeholder={t('alias.pinDigits')}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPin">{t('alias.confirmPinLabel')}</label>
              <PinInput
                value={confirmPin}
                onChange={setConfirmPin}
                placeholder={t('alias.confirmPinPlaceholder')}
                disabled={loading}
                error={confirmPin.length > 0 && pin !== confirmPin}
              />
            </div>

            {error && <p className="input-error">{error}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t('alias.creating') : t('alias.createButton')}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body">
            <div className="success-message">
              <span className="success-icon">✓</span>
              <p>{t('alias.successMessage')}</p>
            </div>

            <div className="alias-info">
              <p>{t('alias.successInfo')}</p>
              <code className="alias-display">{createdAlias}</code>
              <p className="alias-hint">
                {t('alias.successHint')}
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClose}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
