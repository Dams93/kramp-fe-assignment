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

export type SearchResult = Product;

export type SearchProductsResponse = {
  data: {
    searchProducts: SearchResult[];
  };
};


export type ProductCategory = 'Tools' | 'Fasteners' | 'Safety Equipment' | 'Power Tools';
