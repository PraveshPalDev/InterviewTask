import apiClient from '../api/apiClient';
import { ProductResponse, Product } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

const PRODUCTS_LIMIT = 10;

export const productService = {
  getProducts: async (skip: number = 0): Promise<ProductResponse> => {
    try {
      const response = await apiClient.get<ProductResponse>(`/products`, {
        params: { limit: PRODUCTS_LIMIT, skip },
      });
      
      // Cache the first page for offline access
      if (skip === 0) {
        await storage.setItem(STORAGE_KEYS.PRODUCTS_CACHE, response.data.products);
      }
      
      return response.data;
    } catch (error) {
      // If offline or error, try fetching from cache
      if (skip === 0) {
        const cachedProducts = await storage.getItem(STORAGE_KEYS.PRODUCTS_CACHE);
        if (cachedProducts) {
          return {
            products: cachedProducts,
            total: cachedProducts.length,
            skip: 0,
            limit: PRODUCTS_LIMIT,
          };
        }
      }
      throw error;
    }
  },
};
