/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../PostCard';

const mockPost = {
  id: 42,
  title: 'Título do Post',
  images: [
    { src: 'https://exemplo.com/img1.jpg', alt: 'Imagem 1' },
    { src: 'https://exemplo.com/img2.jpg', alt: 'Imagem 2' },
  ],
};

describe('PostCard', () => {
  it('renderiza o título com link para o post', () => {
    render(<PostCard post={mockPost} onSelectImage={() => {}} />);
    const link = screen.getByRole('link', { name: /título do post/i });

    expect(link).toHaveAttribute('href', `/index.php?p=${mockPost.id}`);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('adiciona borda azul quando post está selecionado', () => {
    const { container } = render(
      <PostCard
        post={mockPost}
        selectedPostId={42}
        onSelectImage={() => {}}
      />
    );
    expect(container.firstChild).toHaveClass('border-blue-500');
  });

  it('não adiciona borda azul se post não estiver selecionado', () => {
    const { container } = render(
      <PostCard
        post={mockPost}
        selectedPostId={99}
        onSelectImage={() => {}}
      />
    );
    expect(container.firstChild).not.toHaveClass('border-blue-500');
  });

  it('renderiza imagens corretamente', () => {
    render(<PostCard post={mockPost} onSelectImage={() => {}} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByAltText('Imagem 1')).toBeInTheDocument();
  });

  it('chama onSelectImage ao clicar em uma imagem', () => {
    const mockSelect = vi.fn();
    render(<PostCard post={mockPost} onSelectImage={mockSelect} />);
    const img = screen.getByAltText('Imagem 2');
    fireEvent.click(img);
    expect(mockSelect).toHaveBeenCalledWith(mockPost, { ...mockPost.images[1], type: 'content' });
  });
});
