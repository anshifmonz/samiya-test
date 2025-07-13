export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: Record<string, ProductImage[]>;
  price: number;
  tags: string[];
  category: string;
  active?: boolean;
}

export interface LegacyProduct {
  id: string;
  title: string;
  description: string;
  images: Record<string, string[]>;
  price: number;
  tags: string[];
  category: string;
  active?: boolean;
}

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
};
