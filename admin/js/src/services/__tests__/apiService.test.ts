/// <reference types="vitest" />
import axios from 'axios';
import apiService from '../api';
import { vi, type MockInstance } from 'vitest';

vi.mock('axios');

const mockedAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
};

(axios.create as unknown as MockInstance).mockReturnValue(mockedAxiosInstance);

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

    mockedAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await apiService.getPosts(1, 10);

    expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/posts', {
      params: { page: 1, per_page: 10 },
    });
    expect(result).toEqual(mockData);
  });

  it('getImagesFromPost retorna lista de imagens', async () => {
    const mockImages = [{ src: 'https://img.jpg' }];

    mockedAxiosInstance.get.mockResolvedValueOnce({ data: mockImages });

    const result = await apiService.getImagesFromPost(123);

    expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/post/123/images');
    expect(result).toEqual(mockImages);
  });

  it('replaceImage envia dados corretos para a API', async () => {
    const mockResponse = { success: true };

    mockedAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await apiService.replaceImage(
      123,
      'https://old.jpg',
      'https://new.jpg'
    );

    expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/replace-image', {
      post_id: 123,
      old_image: 'https://old.jpg',
      new_image: 'https://new.jpg',
    });
    expect(result).toEqual(mockResponse);
  });
});
