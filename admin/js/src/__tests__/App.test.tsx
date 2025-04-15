import { describe, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import * as api from '../services/api';
import { QueryClient, QueryClientProvider } from 'react-query';

vi.mock('../services/api');

const mockPosts = [
  {
    id: 1,
    title: 'Post de Teste',
    images: [
      { src: 'https://img1.jpg', alt: 'Imagem 1' },
      { src: 'https://img2.jpg', alt: 'Imagem 2' }
    ]
  }
];

describe('App integration', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    (api.default.getPosts as any).mockResolvedValue({
      posts: mockPosts,
      pages: 1
    });
  });

  const renderApp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

  it('renderiza título e posts', async () => {
    renderApp();

    expect(screen.getByText('Substituição de Imagens')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Post de Teste')).toBeInTheDocument();
    });

    // Verifica imagens
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('abre modal ao clicar em imagem', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Post de Teste')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('img')[0]);

    await waitFor(() => {
      expect(screen.getByText('Substituir Imagem')).toBeInTheDocument();
    });
  });
});
