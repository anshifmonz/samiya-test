export interface Section {
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionProduct {
  sectionId: string;
  productId: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionProductItem {
  id: string;
  slug?: string;
  title: string;
  price: number;
  images: string;
  sort_order: number;
  originalPrice?: number;
}

export interface SectionWithProducts extends Section {
  products: SectionProductItem[];
}
