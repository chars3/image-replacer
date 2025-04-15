/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import ImageViewer from '../ImageViewer';

const mockImages = [
  {
    src: 'https://example.com/img1.jpg',
    alt: 'Imagem 1',
    width: 800,
    height: 600,
    attachment_id: 101,
  },
  {
    src: 'https://example.com/img2.jpg',
    alt: 'Imagem 2',
  },
];

describe('ImageViewer', () => {
  it('mostra mensagem se não houver imagens', () => {
    render(<ImageViewer images={[]} selectedImage={null} onSelectImage={() => {}} />);
    expect(screen.getByText(/nenhuma imagem encontrada/i)).toBeInTheDocument();
  });

  it('renderiza imagens da lista', () => {
    render(<ImageViewer images={mockImages} selectedImage={null} onSelectImage={() => {}} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByAltText('Imagem 1')).toBeInTheDocument();
  });

  it('destaque a imagem selecionada', () => {
    render(<ImageViewer images={mockImages} selectedImage={mockImages[0]} onSelectImage={() => {}} />);
    expect(screen.getByText(/selecionada/i)).toBeInTheDocument();
  });

  it('exibe detalhes da imagem selecionada', () => {
    render(<ImageViewer images={mockImages} selectedImage={mockImages[0]} onSelectImage={() => {}} />);
    expect(screen.getByText(mockImages[0].src)).toBeInTheDocument();
    expect(screen.getByText(`${mockImages[0].width} × ${mockImages[0].height}`)).toBeInTheDocument();
    expect(screen.getByText(String(mockImages[0].attachment_id))).toBeInTheDocument();
  });

  it('chama onSelectImage ao clicar em uma imagem', () => {
    const mockSelect = vi.fn();
    render(<ImageViewer images={mockImages} selectedImage={null} onSelectImage={mockSelect} />);
    
    const img = screen.getByAltText('Imagem 2');
    fireEvent.click(img);

    expect(mockSelect).toHaveBeenCalledWith(mockImages[1]);
  });
});
