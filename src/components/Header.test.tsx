import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from '../context/CartContext';
import Header from './Header';

const renderHeader = (path = '/') => {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[path]}>
        <Header />
      </MemoryRouter>
    </CartProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('muestra el breadcrumb de detalle', () => {
    window.localStorage.setItem('itx-cart-count', '0');
    renderHeader('/product/123');

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
  });

  it('muestra el número de teéfonos en el carrito', () => {
    window.localStorage.setItem('itx-cart-count', '4');
    renderHeader();

    expect(screen.getByText(/4/)).toBeInTheDocument();
  });
});
