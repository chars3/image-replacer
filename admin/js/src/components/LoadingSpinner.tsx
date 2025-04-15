import React from 'react';

interface LoadingSpinnerProps {
  size?: 'default' | 'small';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  message = 'Carregando...',
}) => {
  const spinnerSize =
    size === 'small' ? 'ir-h-6 ir-w-6 ir-border-2' : 'ir-h-10 ir-w-10 ir-border-4';

  return (
    <div className="ir-loading">
      <div className="ir-flex ir-flex-col ir-items-center">
        <div className={`ir-spinner ${spinnerSize}`} />
        {message && <p className="ir-mt-2 ir-text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
