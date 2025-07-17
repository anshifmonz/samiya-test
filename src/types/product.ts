export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductColorData {
  hex: string;
  images: ProductImage[];
}

export interface Product {
  id: string;
  short_code: string;
  title: string;
  description: string;
  images: Record<string, ProductColorData>;
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

// interface for backward compatibility
export interface LegacyProductWithImages {
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

export type ProductFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
};
