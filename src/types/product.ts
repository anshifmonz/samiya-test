export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  short_code: string;
  title: string;
  description: string;
  images: Record<string, ProductImage[]>;
  price: number;
  originalPrice?: number;
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
  originalPrice?: number;
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
