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
