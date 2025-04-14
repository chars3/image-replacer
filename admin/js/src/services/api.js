import axios from 'axios';

// Recupera as configurações do WordPress que foram passadas para o script
const wpSettings = window.imageReplacerSettings || {
  apiEndpoint: '/wp-json/image-replacer/v1',
  nonce: '',
  root: '/wp-json'
};

// Cria uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: wpSettings.apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': wpSettings.nonce
  }
});

// Serviço para comunicação com a API do plugin
const apiService = {
  // Busca posts com imagens com suporte a paginação
  async getPosts(page = 1, perPage = 10) {
    try {
      const response = await api.get('/posts', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },

  // Busca imagens de um post específico
  async getImagesFromPost(postId) {
    try {
      const response = await api.get(`/post/${postId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar imagens do post ${postId}:`, error);
      throw error;
    }
  },

  // Substitui uma imagem em um post
  async replaceImage(postId, oldImageSrc, newImageSrc) {
    try {
      const response = await api.post('/replace-image', {
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
  openMediaLibrary(options = {}) {
    // Verifica se a API de media do WordPress está disponível
    if (!window.wp || !window.wp.media) {
      console.error('WordPress Media Library API não está disponível');
      return Promise.reject(new Error('WordPress Media Library API não está disponível'));
    }

    return new Promise((resolve, reject) => {
      // Configurações padrão
      const defaults = {
        title: 'Selecionar Nova Imagem',
        button: { text: 'Usar esta imagem' },
        multiple: false,
        library: { type: 'image' }
      };

      // Mescla as opções padrão com as fornecidas
      const frame = window.wp.media({
        ...defaults,
        ...options
      });

      // Callback quando uma imagem é selecionada
      frame.on('select', () => {
        const attachment = frame.state().get('selection').first().toJSON();
        resolve(attachment);
      });

      // Callback quando o frame é fechado sem seleção
      frame.on('close', () => {
        // Verificamos se uma seleção foi feita
        const selection = frame.state().get('selection');
        if (!selection || selection.length === 0) {
          reject(new Error('Nenhuma imagem selecionada'));
        }
      });

      // Abre a biblioteca de mídia
      frame.open();
    });
  }
};

export default apiService;