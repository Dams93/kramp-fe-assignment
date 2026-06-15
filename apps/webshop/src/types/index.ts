export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  cart: CartItem[] | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export type SearchResult = Product;

export type SearchProductsResponse = {
  searchProducts: SearchResult[];
};

export type GetProductsResponse = {
  products: Product[];
};

export type GetProductResponse = {
  product: Product;
};

export type ProductCategory =
  | 'Tools'
  | 'Fasteners'
  | 'Safety Equipment'
  | 'Power Tools';
