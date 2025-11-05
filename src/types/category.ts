import type { SectionProduct } from './collection';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  path: string[];
  children?: Category[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithFirstProduct {
  id: string;
  name: string;
  description: string;
  product_id: string;
  slug: string;
  product_title: string;
  product_description: string;
  price: number;
  original_price: number;
  image_url: string;
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  description: string;
  products: SectionProduct[];
}
