export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductColorData {
  hex: string;
  images: ProductImage[];
}

export interface Size {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
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
  categoryId: string;
  sizes: Size[];
  active?: boolean;
}

export type CreateProductData = Omit<Product, 'id' | 'short_code'> & {
  short_code?: string;
};

export interface LegacyProduct {
  id: string;
  title: string;
  description: string;
  images: Record<string, string[]>;
  price: number;
  originalPrice?: number;
  tags: string[];
  categoryId: string;
  sizes?: Size[];
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
  categoryId: string;
  sizes?: Size[];
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

export interface SimilarProduct {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  primary_color?: string;
  primary_image_url?: string;
  category?: string;
  available_colors: Array<{
    color_name: string;
    hex_code?: string;
    sort_order: number;
    is_primary: boolean;
  }>;
}
