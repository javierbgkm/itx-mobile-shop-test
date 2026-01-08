import { ReactNode, useMemo, useState } from "react";
import { CartContext } from "./cart-context";

const STORAGE_KEY = "itx-cart-count";

const readInitialCount = () => {
  const stored = window?.localStorage.getItem(STORAGE_KEY);
  return stored ? Number(stored) || 0 : 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState<number>(() => readInitialCount());

  const updateCount = (value: number) => {
    setCount(value);
    window.localStorage.setItem(STORAGE_KEY, String(value));
  };

  const value = useMemo(() => ({ count, updateCount }), [count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
