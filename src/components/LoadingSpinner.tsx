import { useTranslation } from 'react-i18next';

export const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-container">
      <div className="spinner" aria-label={t('common.loading')}></div>
      <p>{t('loading.note')}</p>
    </div>
  );
};
