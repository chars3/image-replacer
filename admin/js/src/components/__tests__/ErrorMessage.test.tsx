import { render, screen, fireEvent } from '@testing-library/react';
import { vi as mockFn } from 'vitest';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renderiza a mensagem de erro personalizada', () => {
    render(<ErrorMessage message="Algo deu errado" />);
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
  });

  it('renderiza a mensagem padrão se nenhuma for fornecida', () => {
    render(<ErrorMessage />);
    expect(screen.getByText(/ocorreu um erro inesperado/i)).toBeInTheDocument();
  });

  it('renderiza o botão "Tentar novamente" se onRetry for fornecido', () => {
    const retry = mockFn.fn(); // aqui
    render(<ErrorMessage message="Erro!" onRetry={retry} />);
    expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument();
  });

  it('chama onRetry quando o botão for clicado', () => {
    const retry = mockFn.fn(); // aqui também
    render(<ErrorMessage message="Erro!" onRetry={retry} />);
    const button = screen.getByRole('button', { name: /tentar novamente/i });
    fireEvent.click(button);
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
