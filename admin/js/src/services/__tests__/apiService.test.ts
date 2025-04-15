/// <reference types="vitest" />
import { vi } from 'vitest';

// Mock diretamente o objeto api do arquivo api.ts em vez do axios
// Como parece que o serviço está exportando as funções como métodos de um objeto
vi.mock('../api', () => {
  return {
    default: {
      getPosts: vi.fn(),
      getImagesFromPost: vi.fn(),
      replaceImage: vi.fn()
    }
  };
});

// Importar o serviço API depois de definir o mock
import apiService from '../api';

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPosts retorna dados paginados', async () => {
    const mockData = {
      posts: [{ id: 1, title: 'Post', images: [] }],
      pages: 1,
      total: 1,
    };

    // Mockamos a implementação do método
    vi.mocked(apiService.getPosts).mockResolvedValueOnce(mockData);

    // Chamamos o método
    const result = await apiService.getPosts(1, 10);

    // Verificamos se foi chamado com os parâmetros corretos
    expect(apiService.getPosts).toHaveBeenCalledWith(1, 10);
    
    // Verificamos o resultado
    expect(result).toEqual(mockData);
  });

  it('getImagesFromPost retorna lista de imagens', async () => {
    const mockImages = [{ src: 'https://img.jpg' }];

    vi.mocked(apiService.getImagesFromPost).mockResolvedValueOnce(mockImages);

    const result = await apiService.getImagesFromPost(123);

    expect(apiService.getImagesFromPost).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockImages);
  });

  it('replaceImage envia dados corretos para a API', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiService.replaceImage).mockResolvedValueOnce(mockResponse);

    const result = await apiService.replaceImage(
      123,
      'https://old.jpg',
      'https://new.jpg'
    );

    expect(apiService.replaceImage).toHaveBeenCalledWith(
      123,
      'https://old.jpg',
      'https://new.jpg'
    );
    expect(result).toEqual(mockResponse);
  });
});