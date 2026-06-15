import { useEffect, useState } from 'react';
import { Cart, CartItem } from '../types';

export function useCart(): Cart {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    return JSON.parse(localStorage.getItem('cart') || '[]');
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Added missing dependency to avioid calling .setItem on every render
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { ...item }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // No need to store totalPrice in state, can be derived from cart items
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice };
}
