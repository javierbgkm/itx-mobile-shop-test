import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from './CartContext';
import { useCart } from './useCart';

const Consumer = () => {
  const { count, updateCount } = useCart();
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => updateCount(count + 1)}>Incrementar</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('lee el valor del localStorage', () => {
    window.localStorage.setItem('itx-cart-count', '3');

    render(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('actualiza el contador y lo conserva', () => {
    render(
      <CartProvider>
        <Consumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Incrementar'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(window.localStorage.getItem('itx-cart-count')).toBe('1');
  });
});
