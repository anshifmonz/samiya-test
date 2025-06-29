import { Product, searchProducts } from '@/data/products';
import { type Collection } from '@/data/collections';
import { Category } from '@/data/categories';
import { type ProductFilters } from '@/hooks/useProductFilters';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic fetch function with caching
async function fetchWithCache<T>(
  url: string, 
  options: RequestInit & { 
    cache?: RequestCache; 
    next?: { revalidate?: number | false; tags?: string[] }; 
  } = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    cache: options.cache || 'force-cache',
    next: options.next || { revalidate: 3600 }, // 1 hour default
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Product API functions
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    // For this implementation, we'll use the local search function
    // In a real app, this would be an API call with caching
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    if (filters) {
      return searchProducts('', filters);
    }
    
    return (await import('@/data/products')).products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<{ product: Product | null; similarProducts: Product[] }> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    const { getProductById, products } = await import('@/data/products');
    const product = getProductById(id);
    
    if (!product) {
      return { product: null, similarProducts: [] };
    }

    const similarProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return { product, similarProducts };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { product: null, similarProducts: [] };
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    const { products } = await import('@/data/products');
    return products.slice(0, 6);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Collection API functions
export async function getCollections(): Promise<Collection[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    const collections = (await import('@/data/collections')).default;
    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

// Category API functions
export async function getCategories(): Promise<Category[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    const { categories } = await import('@/data/categories');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Search API function
export async function searchProductsAPI(query: string, filters?: ProductFilters): Promise<Product[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    return searchProducts(query, filters);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Admin API functions for server-side rendering
export async function getAdminData(): Promise<{
  products: Product[];
  collections: Collection[];
  categories: Category[];
}> {
  try {
    const [products, collections, categories] = await Promise.all([
      getProducts(),
      getCollections(),
      getCategories(),
    ]);

    return { products, collections, categories };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return { products: [], collections: [], categories: [] };
  }
}

// Cache tags for Next.js revalidation
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  COLLECTIONS: 'collections',
  CATEGORIES: 'categories',
  FEATURED: 'featured-products',
} as const;
