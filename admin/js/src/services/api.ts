import axios, { AxiosInstance } from 'axios';

interface WpSettings {
  apiEndpoint: string;
  nonce: string;
  root: string;
  adminUrl?: string;
  isAdmin?: boolean;
  isDev?: boolean;
}

interface Post {
  id: number;
  title: string;
  images: Image[];
}

interface Image {
  src: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  attachment_id?: number;
  class?: string;
}

interface ApiResponse {
  posts: Post[];
  pages: number;
  total: number;
}

interface MediaLibraryOptions {
  title?: string;
  button?: { text: string };
  multiple?: boolean;
  library?: { type: string };
}

interface Attachment {
  id: number;
  url: string;
  title: string;
  width: number;
  height: number;
}

interface WPMediaFrame {
  on(event: string, callback: () => void): void;
  open(): void;
  state(): {
    get(what: string): {
      first(): { toJSON(): Attachment };
      length: number;
    } | null;
  };
}

// Definição dos tipos para o WordPress global
declare global {
  interface Window {
    imageReplacerSettings?: WpSettings;
    wp?: {
      media: (options: MediaLibraryOptions) => WPMediaFrame;
    };
  }
}

// Recupera as configurações do WordPress
const wpSettings: WpSettings = window.imageReplacerSettings || {
  apiEndpoint: '/wp-json/image-replacer/v1',
  nonce: '',
  root: '/wp-json'
};

// Cria instância do Axios com configurações
const api: AxiosInstance = axios.create({
  baseURL: wpSettings.apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': wpSettings.nonce
  }
});

// Tipo para a resposta da operação de substituição de imagem
interface ReplaceImageResponse {
  success: boolean;
  post_id: number;
  message: string;
}

// Serviço para comunicação com a API
const apiService = {
  // Busca posts com imagens com paginação
  async getPosts(page: number = 1, perPage: number = 10): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/posts', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },

  // Busca imagens de um post específico
  async getImagesFromPost(postId: number): Promise<Image[]> {
    try {
      const response = await api.get(`/post/${postId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar imagens do post ${postId}:`, error);
      throw error;
    }
  },

  // Substitui uma imagem em um post
  async replaceImage(postId: number, oldImageSrc: string, newImageSrc: string): Promise<ReplaceImageResponse> {
    try {
      const response = await api.post<ReplaceImageResponse>('/replace-image', {
        post_id: postId,
        old_image: oldImageSrc,
        new_image: newImageSrc
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao substituir imagem:', error);
      throw error;
    }
  },

  // Utilitário para integração com a Media Library do WordPress
  openMediaLibrary(options: MediaLibraryOptions = {}): Promise<Attachment> {
    // Verifica se a API de media do WordPress está disponível
    if (!window.wp || typeof window.wp.media !== 'function') {
      console.error('WordPress Media Library API não está disponível');
      return Promise.reject(new Error('WordPress Media Library API não está disponível'));
    }

    // Criando uma referência local após a verificação
    const wp = window.wp;

    return new Promise<Attachment>((resolve, reject) => {
      // Configurações padrão
      const defaults = {
        title: 'Selecionar Nova Imagem',
        button: { text: 'Usar esta imagem' },
        multiple: false,
        library: { type: 'image' }
      };

      // Mescla as opções padrão com as fornecidas
      const frame = wp.media({
        ...defaults,
        ...options
      });

      // Callback quando uma imagem é selecionada
      frame.on('select', () => {
        try {
          const selection = frame.state().get('selection');
          if (selection && selection.first) {
            const attachment = selection.first().toJSON();
            resolve(attachment as Attachment);
          } else {
            reject(new Error('Nenhuma seleção encontrada'));
          }
        } catch (error) {
          reject(new Error(`Erro ao processar seleção: ${error instanceof Error ? error.message : String(error)}`));
        }
      });

      // Callback quando o frame é fechado sem seleção
      frame.on('close', () => {
        try {
          // Verificamos se uma seleção foi feita
          const selection = frame.state().get('selection');
          if (!selection || selection.length === 0) {
            reject(new Error('Nenhuma imagem selecionada'));
          }
        } catch {
          // Ignoramos erros aqui, pois podem ocorrer no fechamento normal
        }
      });

      // Abre a biblioteca de mídia
      frame.open();
    });
  }
};

export default apiService;