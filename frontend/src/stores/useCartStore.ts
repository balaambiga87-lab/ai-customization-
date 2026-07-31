import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  type: string; // 'catalog' | 'design'
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isDrawerOpen: false,
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ items: [] }),
}));
