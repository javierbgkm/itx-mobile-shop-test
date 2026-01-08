import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { CartProvider } from '../context/CartContext';
import { addProductToCart, fetchProductDetail } from '../services/api';
import type { ProductDetail } from '../types/product';
import ProductDetailPage from './ProductDetailPage';

vi.mock('../services/api', () => ({
  fetchProductDetail: vi.fn(),
  addProductToCart: vi.fn()
}));

const mockedFetchProductDetail = fetchProductDetail as unknown as Mock;
const mockedAddProductToCart = addProductToCart as unknown as Mock;

const renderWithRouter = () =>
  render(
    <CartProvider>
      <MemoryRouter initialEntries={['/product/phone']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

describe('ProductDetailPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedFetchProductDetail.mockReset();
    mockedAddProductToCart.mockReset();
  });

  it('muestra los atributos clave y permite meter en el carrito', async () => {
    const detail: ProductDetail = {
      id: 'phone',
      brand: 'Marca',
      model: 'Modelo',
      price: '500',
      imgUrl: 'image.jpg',
      cpu: 'CPU X',
      ram: '8 GB',
      os: 'Android',
      displayResolution: '1080p',
      battery: '4000 mAh',
      primaryCamera: ['48 MP'],
      secondaryCmera: ['16 MP'],
      dimentions: '100x200',
      weight: '210',
      options: {
        colors: [
          { code: 1000, name: 'Negro' },
          { code: 1001, name: 'Blanco' }
        ],
        storages: [
          { code: 2000, name: '64 GB' },
          { code: 2001, name: '128 GB' }
        ]
      }
    };

    mockedFetchProductDetail.mockResolvedValueOnce(detail);
    mockedAddProductToCart.mockResolvedValueOnce({ count: 2 });

    renderWithRouter();

    expect(await screen.findByRole('heading', { name: 'Marca' })).toBeInTheDocument();
    expect(screen.getByText('Cámara principal')).toBeInTheDocument();
    expect(screen.getByText('Cámara frontal')).toBeInTheDocument();

    const colorSelector = await screen.findByLabelText('Color');
    const storageSelector = await screen.findByLabelText('Almacenamiento');

    await userEvent.selectOptions(colorSelector, '1001');
    await userEvent.selectOptions(storageSelector, '2001');

    const addButton = await screen.findByRole('button', { name: 'Añadir al carrito' });
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(mockedAddProductToCart).toHaveBeenCalledWith({ id: 'phone', colorCode: 1001, storageCode: 2001 });
    });

    expect(await screen.findByText('Producto añadido a la cesta correctamente.')).toBeInTheDocument();
  });
});
