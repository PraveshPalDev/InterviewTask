export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
};
