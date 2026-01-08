import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { ProductSummary } from '../types/product';
import ProductCard from './ProductCard';

const renderCard = (product: ProductSummary) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  it('formatea el precio', () => {
    renderCard({ id: '1', brand: 'Marca', model: 'Modelo', price: '100', imgUrl: 'img.jpg' });

    expect(screen.getByText('Marca Modelo')).toBeInTheDocument();
    expect(screen.getByText('100 €')).toBeInTheDocument();
  });

  it('muestra el mensaje de precio desconocido si no llega de la api', () => {
    renderCard({ id: '2', brand: 'Marca', model: 'Modelo', imgUrl: 'img.jpg' });

    expect(screen.getByText('Consultar precio')).toBeInTheDocument();
  });
});
