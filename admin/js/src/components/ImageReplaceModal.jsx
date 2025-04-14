import React, { useState } from 'react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ImageReplaceModal = ({ post, image, onClose, onReplace }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para abrir a biblioteca de mídia do WordPress
  const handleOpenMediaLibrary = async () => {
    setError(null);
    
    try {
      const attachment = await api.openMediaLibrary({
        title: 'Selecionar imagem para substituição',
        button: { text: 'Usar esta imagem para substituição' },
        library: { type: 'image' }
      });
      
      setSelectedImage({
        id: attachment.id,
        url: attachment.url,
        title: attachment.title,
        width: attachment.width,
        height: attachment.height
      });
    } catch (err) {
      // Se o usuário fechar o seletor sem escolher, ignoramos o erro
      if (err.message !== 'Nenhuma imagem selecionada') {
        setError('Erro ao selecionar imagem. Por favor tente novamente.');
        console.error('Erro ao selecionar imagem:', err);
      }
    }
  };

  // Função para confirmar a substituição
  const handleConfirmReplace = async () => {
    if (!selectedImage) {
      setError('Por favor, selecione uma nova imagem.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onReplace(selectedImage.url);
    } catch (err) {
      setError('Erro ao substituir imagem. Por favor tente novamente.');
      console.error('Erro ao substituir imagem:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ir-fixed ir-inset-0 ir-bg-black ir-bg-opacity-50 ir-z-50 ir-flex ir-items-center ir-justify-center">
      <div className="ir-bg-white ir-rounded-lg ir-shadow-xl ir-max-w-2xl ir-w-full ir-mx-4 ir-overflow-hidden">
        <div className="ir-border-b ir-px-6 ir-py-4">
          <h3 className="ir-text-lg ir-font-medium">Substituir Imagem</h3>
        </div>
        
        <div className="ir-p-6">
          {isLoading ? (
            <LoadingSpinner message="Processando substituição..." />
          ) : (
            <>
              {error && (
                <div className="ir-bg-red-50 ir-border ir-border-red-200 ir-text-red-800 ir-p-3 ir-rounded ir-mb-4">
                  {error}
                </div>
              )}
              
              <div className="ir-mb-6">
                <h4 className="ir-text-sm ir-font-medium ir-text-gray-500 ir-mb-2">Imagem Atual</h4>
                <div className="ir-flex ir-items-center ir-space-x-4">
                  <div className="ir-w-24 ir-h-24 ir-bg-gray-100 ir-border ir-border-gray-300 ir-rounded ir-overflow-hidden">
                    <img 
                      src={image.src} 
                      alt="Imagem atual" 
                      className="ir-w-full ir-h-full ir-object-contain"
                    />
                  </div>
                  <div className="ir-flex-1 ir-text-sm">
                    <div className="ir-truncate ir-max-w-xs ir-text-gray-700">{image.src.split('/').pop()}</div>
                    {image.width && image.height && (
                      <div className="ir-text-gray-500">{image.width} × {image.height}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="ir-mb-6">
                <h4 className="ir-text-sm ir-font-medium ir-text-gray-500 ir-mb-2">Nova Imagem</h4>
                
                {!selectedImage ? (
                  <button 
                    onClick={handleOpenMediaLibrary} 
                    className="ir-w-full ir-border-2 ir-border-dashed ir-border-gray-300 ir-rounded-lg ir-p-4 ir-text-center ir-hover:border-blue-500 ir-transition-colors"
                  >
                    <div className="ir-text-gray-500">
                      <svg className="ir-w-10 ir-h-10 ir-mx-auto ir-mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="ir-text-sm">Clique para selecionar uma imagem da Biblioteca de Mídia</p>
                    </div>
                  </button>
                ) : (
                  <div className="ir-flex ir-items-center ir-space-x-4">
                    <div className="ir-w-24 ir-h-24 ir-bg-gray-100 ir-border ir-border-gray-300 ir-rounded ir-overflow-hidden">
                      <img 
                        src={selectedImage.url} 
                        alt="Nova imagem" 
                        className="ir-w-full ir-h-full ir-object-contain"
                      />
                    </div>
                    <div className="ir-flex-1 ir-text-sm">
                      <div className="ir-truncate ir-max-w-xs ir-text-gray-700">
                        {selectedImage.title || selectedImage.url.split('/').pop()}
                      </div>
                      <div className="ir-text-gray-500">
                        {selectedImage.width} × {selectedImage.height}
                      </div>
                      <button 
                        onClick={handleOpenMediaLibrary} 
                        className="ir-text-blue-600 ir-mt-1 ir-hover:underline"
                      >
                        Alterar imagem
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ir-text-sm ir-text-gray-600 ir-mb-6">
                <p>
                  <strong>Atenção:</strong> Esta ação irá substituir a imagem em todas as ocorrências no conteúdo deste post. 
                  Certifique-se de que a nova imagem possui dimensões similares para manter o layout do site.
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="ir-bg-gray-50 ir-px-6 ir-py-4 ir-flex ir-justify-end ir-space-x-3">
          <button 
            onClick={onClose}
            className="ir-px-4 ir-py-2 ir-bg-white ir-border ir-border-gray-300 ir-rounded ir-text-sm ir-font-medium ir-text-gray-700 ir-hover:bg-gray-50 ir-transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirmReplace}
            className="ir-px-4 ir-py-2 ir-bg-blue-600 ir-border ir-border-transparent ir-rounded ir-text-sm ir-font-medium ir-text-white ir-hover:bg-blue-700 ir-transition-colors"
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? 'Processando...' : 'Confirmar Substituição'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageReplaceModal;