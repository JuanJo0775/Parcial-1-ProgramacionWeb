export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  stock: number;
  coverUrl: string;
  description: string;
  isbn: string;
}

export interface ProductFilters {
  genre?: string;
  priceMax?: number;
  available?: boolean;
}