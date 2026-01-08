import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { fetchProducts } from '../services/api';
import type { ProductSummary } from '../types/product';
import ProductListPage from './ProductListPage';

vi.mock('../services/api', () => ({
  fetchProducts: vi.fn()
}));

const mockedFetchProducts = fetchProducts as unknown as Mock;

const mockData: ProductSummary[] = [
  { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'apple.jpg' },
  { id: '2', brand: 'Samsung', model: 'Galaxy', price: '799', imgUrl: 'samsung.jpg' }
];

const renderComponent = () =>
  render(
    <MemoryRouter>
      <ProductListPage />
    </MemoryRouter>
  );

describe('ProductListPage', () => {
  beforeEach(() => {
    mockedFetchProducts.mockReset();
  });

  it('filtra los productos según la búsqueda introducida', async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockData);

    renderComponent();

    expect(await screen.findByText('Apple iPhone')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Busca por marca o modelo'), 'Samsung');

    await waitFor(() => {
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
      expect(screen.queryByText('Apple iPhone')).not.toBeInTheDocument();
    });
  });

  it('muestra un mensaje de error cuando la petición falla', async () => {
    mockedFetchProducts.mockRejectedValueOnce(new Error('boom'));

    renderComponent();

    expect(await screen.findByText('No se ha podido obtener la información de los productos.')).toBeInTheDocument();
  });
});
