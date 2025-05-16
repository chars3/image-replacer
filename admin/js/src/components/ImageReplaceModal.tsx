import React, { useState } from "react";

interface WPMediaFrame {
  on: (event: string, callback: () => void) => void;
  open: () => void;
  state: () => {
    get: (property: string) => any;
  };
}

interface Image {
  src: string;
  alt?: string;
  type?: 'featured' | 'content';
}

interface Post {
  id: number;
  title: string;
  images: Image[];
}

interface ImageReplaceModalProps {
  post: Post;
  image: Image;
  onClose: () => void;
  onReplace: (newImageUrl: string, oldImageUrl: string, isFeatured: boolean) => void;
}

const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  post,
  image,
  onClose,
  onReplace,
}) => {
  const [newUrl, setNewUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleSelectFromMediaLibrary = () => {
    // @ts-ignore
    const frame = window.wp.media({
      title: "Selecionar imagem",
      multiple: false,
      library: { type: "image" },
      button: { text: "Usar esta imagem" },
    }) as WPMediaFrame;

    frame.on("select", () => {
      const attachment = frame.state().get("selection").first().toJSON();
      setNewUrl(attachment.url);
      setPreview(attachment.url);
    });

    frame.open();
  };

  const handleSubmit = () => {
    if (newUrl.trim() !== "") {
      onReplace(newUrl, image.src, image.type === 'featured'); // <- Corrigido aqui
    } else {
      alert("Por favor, selecione uma imagem ou insira uma URL.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h3 className="text-xl font-bold mb-4">Substituir Imagem</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Post: <strong>{post.title}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-2">Imagem atual:</p>
          <img
            src={image.src}
            alt={image.alt || ""}
            className="w-full rounded border"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="new-image-url"
            className="block text-sm font-medium mb-1"
          >
            Nova URL da imagem:
          </label>
          <input
            id="new-image-url"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
              setPreview(e.target.value);
            }}
          />
          <button
            onClick={handleSelectFromMediaLibrary}
            className="w-full mt-2 px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Escolher da Biblioteca de Mídia
          </button>
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-sm mb-1">Prévia da nova imagem:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded border"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-wp-blue text-white hover:bg-wp-light-blue transition"
          >
            Substituir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageReplaceModal;
