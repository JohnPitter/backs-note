export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner" aria-label="Carregando"></div>
      <p>Carregando nota...</p>
    </div>
  );
};
