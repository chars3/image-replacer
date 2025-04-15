/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renderiza com tamanho padrão e mensagem padrão', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.className).toMatch(/ir-h-10/);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('renderiza com tamanho pequeno quando size="small"', () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner.className).toMatch(/ir-h-6/);
  });

  it('exibe mensagem personalizada se informada', () => {
    render(<LoadingSpinner message="Buscando dados..." />);
    expect(screen.getByText('Buscando dados...')).toBeInTheDocument();
  });

  it('não exibe mensagem se message for undefined', () => {
    render(<LoadingSpinner message={undefined} />);
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  });
});
