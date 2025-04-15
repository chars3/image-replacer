/// <reference types="vitest" />
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('não renderiza se totalPages for 1 ou menos', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza botões de navegação e páginas corretamente', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />
    );

    // Deve ter botões com os textos:
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/anterior/i)).toBeInTheDocument();
    expect(screen.getByText(/próximo/i)).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('chama onPageChange ao clicar em um número de página', () => {
    const mockChange = vi.fn();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockChange} />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockChange).toHaveBeenCalledWith(3);
  });

  it('desativa botão "Anterior" na primeira página', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByText(/anterior/i)).toBeDisabled();
  });

  it('desativa botão "Próximo" na última página', () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.getByText(/próximo/i)).toBeDisabled();
  });
});
