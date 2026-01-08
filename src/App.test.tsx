import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/Header', () => ({
  default: () => <div data-testid="header">Encabezado simulado</div>
}));

vi.mock('./pages/ProductListPage', () => ({
  default: () => <div data-testid="list-page">Listado simulado</div>
}));

vi.mock('./pages/ProductDetailPage', () => ({
  default: () => <div data-testid="detail-page">Detalle simulado</div>
}));

describe('App routing', () => {
  it('monta la vista de listado en la ruta raíz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('list-page')).toBeInTheDocument();
    expect(screen.queryByTestId('detail-page')).not.toBeInTheDocument();
  });

  it('monta la vista de detalle cuando la ruta coincide', () => {
    render(
      <MemoryRouter initialEntries={['/product/abc']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('detail-page')).toBeInTheDocument();
    expect(screen.queryByTestId('list-page')).not.toBeInTheDocument();
  });
});
