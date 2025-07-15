export interface AdminUser {
  id: string;
  username: string;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  path: string[];
  isActive: boolean;
}

export interface NewProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  images: Record<string, string[]>;
  tags: string[];
}

export interface NewCollectionInput {
  title: string;
  description: string;
  image: string;
}
