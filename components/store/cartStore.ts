import { create } from 'zustand';
import { CartState, CartItem, MenuItem } from '../types';

export const useCartStore = create<CartState & {
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: number) => number;
}>((set, get) => ({
  items: [],
  total: 0,
  addToCart: (item) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => 
          i.id === item.id && 
          JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }

      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
      };
    }),
  removeFromCart: (itemId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== itemId);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
      };
    }),
  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity < 1) {
        const newItems = state.items.filter((item) => item.id !== itemId);
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
        };
      }
      const newItems = state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
      };
    }),
  clearCart: () => set({ items: [], total: 0 }),
  getItemQuantity: (itemId) => {
    const items = get().items;
    return items.reduce((total, item) => 
      item.id === itemId ? total + item.quantity : total, 0
    );
  },
}));