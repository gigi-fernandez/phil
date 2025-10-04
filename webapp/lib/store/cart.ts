import { create } from 'zustand';
import { MenuItem } from '@/lib/db/schema';

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
};

type CartStore = {
  items: CartItem[];
  selectedShopId: string | null;
  deliveryType: 'delivery' | 'pickup';
  addItem: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedShop: (shopId: string) => void;
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  selectedShopId: null,
  deliveryType: 'delivery',
  
  addItem: (item, quantity = 1, specialInstructions) => {
    set((state) => {
      const existingItem = state.items.find(i => i.menuItem.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map(i =>
            i.menuItem.id === item.id
              ? { ...i, quantity: i.quantity + quantity, specialInstructions }
              : i
          )
        };
      }
      return {
        items: [...state.items, { menuItem: item, quantity, specialInstructions }]
      };
    });
  },
  
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter(i => i.menuItem.id !== itemId)
    }));
  },
  
  updateQuantity: (itemId, quantity) => {
    if (quantity === 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map(i =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  setSelectedShop: (shopId) => set({ selectedShopId: shopId }),
  
  setDeliveryType: (type) => set({ deliveryType: type }),
  
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      const price = item.menuItem.base_price || 0;
      return sum + (price * item.quantity);
    }, 0);
  },
  
  getDeliveryFee: () => {
    const { deliveryType } = get();
    return deliveryType === 'delivery' ? 7.90 : 0;
  },
  
  getTotal: () => {
    return get().getSubtotal() + get().getDeliveryFee();
  }
}));