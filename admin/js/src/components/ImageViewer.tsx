import React from 'react';

interface Image {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  attachment_id?: number;
}

interface ImageViewerProps {
  images: Image[];
  selectedImage: Image | null;
  onSelectImage: (image: Image) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  selectedImage,
  onSelectImage,
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="ir-text-center ir-p-4 ir-bg-gray-50 ir-rounded ir-border ir-border-gray-200">
        <p className="ir-text-gray-500">Nenhuma imagem encontrada neste post</p>
      </div>
    );
  }

  return (
    <div>
      <div className="ir-grid ir-grid-cols-2 md:ir-grid-cols-3 lg:ir-grid-cols-4 ir-gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`ir-image-item ir-cursor-pointer ir-rounded ir-overflow-hidden ir-border ir-transition-all ${
              selectedImage && selectedImage.src === image.src
                ? 'ir-border-blue-500 ir-shadow-md ir-scale-105'
                : 'ir-border-gray-200 hover:ir-border-gray-400'
            }`}
            onClick={() => onSelectImage(image)}
          >
            <div className="ir-relative ir-pb-[75%]">
              <img
                src={image.src}
                alt={image.alt || ''}
                className="ir-absolute ir-inset-0 ir-w-full ir-h-full ir-object-cover"
              />
            </div>
            {selectedImage && selectedImage.src === image.src && (
              <div className="ir-bg-blue-500 ir-text-white ir-text-xs ir-text-center ir-py-1">
                Selecionada
              </div>
            )}
            <div className="ir-p-2 ir-text-xs ir-text-gray-600 ir-truncate">
              {image.src.split('/').pop()}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="ir-mt-6 ir-border-t ir-pt-4">
          <h4 className="ir-text-lg ir-font-medium ir-mb-3">Detalhes da Imagem</h4>
          <div className="ir-grid ir-grid-cols-1 md:ir-grid-cols-2 ir-gap-4">
            <div>
              <div className="ir-aspect-w-16 ir-aspect-h-9 ir-bg-gray-100 ir-rounded ir-overflow-hidden ir-border ir-border-gray-300">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || ''}
                  className="ir-object-contain ir-w-full ir-h-full"
                />
              </div>
            </div>
            <div>
              <table className="ir-w-full ir-text-sm">
                <tbody>
                  <tr>
                    <td className="ir-py-1 ir-pr-4 ir-font-medium">URL:</td>
                    <td className="ir-py-1 ir-truncate ir-max-w-xs">
                      {selectedImage.src}
                    </td>
                  </tr>
                  {selectedImage.alt && (
                    <tr>
                      <td className="ir-py-1 ir-pr-4 ir-font-medium">Alt:</td>
                      <td className="ir-py-1">{selectedImage.alt}</td>
                    </tr>
                  )}
                  {selectedImage.width && (
                    <tr>
                      <td className="ir-py-1 ir-pr-4 ir-font-medium">Dimensões:</td>
                      <td className="ir-py-1">
                        {selectedImage.width} × {selectedImage.height}
                      </td>
                    </tr>
                  )}
                  {selectedImage.attachment_id && (
                    <tr>
                      <td className="ir-py-1 ir-pr-4 ir-font-medium">
                        ID do Attachment:
                      </td>
                      <td className="ir-py-1">{selectedImage.attachment_id}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
