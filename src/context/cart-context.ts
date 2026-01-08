import { createContext } from 'react';

export interface CartContextValue {
  count: number;
  updateCount: (value: number) => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
