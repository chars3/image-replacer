import React from 'react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="ir-bg-red-50 ir-border ir-border-red-200 ir-rounded ir-p-4 ir-mb-4">
      <div className="ir-flex">
        <div className="ir-flex-shrink-0">
          <svg
            className="ir-h-5 ir-w-5 ir-text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ir-ml-3">
          <p className="ir-text-sm ir-text-red-700">
            {message || 'Ocorreu um erro inesperado.'}
          </p>
          {onRetry && (
            <div className="ir-mt-2">
              <button
                type="button"
                onClick={onRetry}
                className="ir-bg-red-100 ir-px-2 ir-py-1 ir-rounded ir-text-sm ir-text-red-800 hover:ir-bg-red-200 ir-transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
