export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductColorData {
  hex: string;
  images: ProductImage[];
  sizes?: Size[]; // Optional color-specific sizes
}

export interface Size {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  // Stock information (available when fetched from product_color_sizes)
  stock_quantity?: number;
  low_stock_threshold?: number;
  is_in_stock?: boolean;
  is_low_stock?: boolean;
  // Favorite information (available when user is authenticated)
  wishlist_id?: string | null;
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
  sizes?: Size[]; // Global fallback sizes (optional)
  colorSizes?: Record<string, Size[]>; // Color-specific sizes mapping
  colorIdMapping?: Record<string, string>; // Map color names to color IDs
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
  sizes?: string[];
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
  sizes?: Size[]; // Global fallback sizes
  colorSizes?: Record<string, Size[]>; // Color-specific sizes mapping
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
  color_sizes?: any[]; // Color-specific sizes from database
  total_count: number;
}

// Enhanced search result with separate total count
export interface SearchResult {
  products: SearchProduct[];
  totalCount: number;
}

// Stock management types
export interface StockUpdate {
  product_id: string;
  color_name: string;
  size_id: string;
  stock_quantity: number;
  low_stock_threshold?: number;
}

export interface StockSummary {
  product_id: string;
  product_title: string;
  total_stock: number;
  total_variants: number;
  in_stock_variants: number;
  out_of_stock_variants: number;
  low_stock_variants: number;
  stock_by_color: StockByColor[];
}

export interface StockByColor {
  color_name: string;
  total_stock: number;
  variants_count: number;
  sizes: StockBySize[];
}

export interface StockBySize {
  size_id: string;
  size_name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
}

export interface LowStockItem {
  product_id: string;
  product_title: string;
  color_name: string;
  size_id: string;
  size_name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_out_of_stock: boolean;
}

// Stock management options for create/update operations
export interface StockOptions {
  preserve_stock?: boolean;
  default_stock_quantity?: number;
  default_low_stock_threshold?: number;
}
