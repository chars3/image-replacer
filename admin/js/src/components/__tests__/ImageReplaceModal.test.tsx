/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import ImageReplaceModal from '../ImageReplaceModal';

const mockPost = {
  id: 1,
  title: 'Post de Teste',
  images: [],
};

const mockImage = {
  src: 'https://exemplo.com/atual.jpg',
  alt: 'Imagem atual',
};

describe('ImageReplaceModal', () => {
  it('renderiza informações do post e imagem atual', () => {
    render(
      <ImageReplaceModal
        post={mockPost}
        image={mockImage}
        onClose={() => {}}
        onReplace={() => {}}
      />
    );

    expect(screen.getByText(/substituir imagem/i)).toBeInTheDocument();
    expect(screen.getByText(/post de teste/i)).toBeInTheDocument();
    expect(screen.getByAltText(/imagem atual/i)).toHaveAttribute('src', mockImage.src);
  });

  it('mostra preview ao digitar uma nova URL', () => {
    render(
      <ImageReplaceModal
        post={mockPost}
        image={mockImage}
        onClose={() => {}}
        onReplace={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/https:\/\/exemplo.com\/imagem.jpg/i);
    fireEvent.change(input, { target: { value: 'https://nova.com/img.png' } });

    expect(screen.getByAltText(/preview/i)).toHaveAttribute('src', 'https://nova.com/img.png');
  });

  it('chama onReplace com nova e antiga URL', () => {
    const mockReplace = vi.fn();

    render(
      <ImageReplaceModal
        post={mockPost}
        image={mockImage}
        onClose={() => {}}
        onReplace={mockReplace}
      />
    );

    const input = screen.getByPlaceholderText(/https:\/\/exemplo.com\/imagem.jpg/i);
    fireEvent.change(input, { target: { value: 'https://nova.com/img.png' } });

    const button = screen.getByRole('button', { name: /substituir/i });
    fireEvent.click(button);

    expect(mockReplace).toHaveBeenCalledWith('https://nova.com/img.png', mockImage.src);
  });

  it('chama onClose ao clicar em cancelar', () => {
    const mockClose = vi.fn();

    render(
      <ImageReplaceModal
        post={mockPost}
        image={mockImage}
        onClose={mockClose}
        onReplace={() => {}}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('exibe alerta se tentar substituir sem URL', () => {
    const mockReplace = vi.fn();
    global.alert = vi.fn();

    render(
      <ImageReplaceModal
        post={mockPost}
        image={mockImage}
        onClose={() => {}}
        onReplace={mockReplace}
      />
    );

    const submitButton = screen.getByRole('button', { name: /substituir/i });
    fireEvent.click(submitButton);

    expect(global.alert).toHaveBeenCalledWith(
      'Por favor, selecione uma imagem ou insira uma URL.'
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
