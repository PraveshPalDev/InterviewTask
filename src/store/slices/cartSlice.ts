import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../../types';
import { calculateDiscountedPrice } from '../../utils/price';

interface CartState {
  items: CartItem[];
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
  totalCount: number;
}

const initialState: CartState = {
  items: [],
  totalOriginalPrice: 0,
  totalDiscountedPrice: 0,
  totalCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  let original = 0;
  let discounted = 0;
  let count = 0;

  items.forEach((item: CartItem) => {
    const itemDiscountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
    original += item.price * item.quantity;
    discounted += itemDiscountedPrice * item.quantity;
    count += item.quantity;
  });

  return { original, discounted, count };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item: CartItem) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const { original, discounted, count } = calculateTotals(state.items);
      state.totalOriginalPrice = original;
      state.totalDiscountedPrice = discounted;
      state.totalCount = count;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item: CartItem) => item.id !== action.payload);
      const { original, discounted, count } = calculateTotals(state.items);
      state.totalOriginalPrice = original;
      state.totalDiscountedPrice = discounted;
      state.totalCount = count;
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item: CartItem) => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      const { original, discounted, count } = calculateTotals(state.items);
      state.totalOriginalPrice = original;
      state.totalDiscountedPrice = discounted;
      state.totalCount = count;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalOriginalPrice = 0;
      state.totalDiscountedPrice = 0;
      state.totalCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
