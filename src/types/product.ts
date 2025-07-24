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
  sortOrder?: string;
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

export interface SearchProduct {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  tags?: string[];
  categoryId: string;
  sizes?: Size[];
  images: Record<string, ProductColorData>;
  total_count?: number;
}

// Raw database result from search_products_rpc with total_count
export interface SearchProductRaw {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  primary_color?: string;
  primary_image_url?: string;
  category_id: string;
  product_images: any[];
  product_tags: any[];
  product_sizes: any[];
  total_count: number;
}

// Enhanced search result with separate total count
export interface SearchResult {
  products: SearchProduct[];
  totalCount: number;
}
