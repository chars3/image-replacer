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
    size === 'small' ? 'h-6 w-6 border-2' : 'h-10 w-10 border-4';

  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col items-center">
        <div
          role="status"
          className={`animate-spin rounded-full border-blue-500 border-t-transparent ${spinnerSize} border`}
        />
        {message && <p className="mt-2 text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
