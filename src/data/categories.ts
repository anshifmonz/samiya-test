import type { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Men',
    description: 'Traditional and modern clothing for men',
    level: 0,
    path: ['Men'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Women',
    description: 'Elegant clothing for women',
    level: 0,
    path: ['Women'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Kids',
    description: 'Adorable clothing for children',
    level: 0,
    path: ['Kids'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Pants',
    description: 'Traditional and modern pants for men',
    parentId: '1',
    level: 1,
    path: ['Men', 'Pants'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Shirt',
    description: 'Formal and casual shirts',
    parentId: '1',
    level: 1,
    path: ['Men', 'Shirt'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Jacket',
    description: 'Blazers and jackets',
    parentId: '1',
    level: 1,
    path: ['Men', 'Jacket'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Cap',
    description: 'Traditional and modern caps',
    parentId: '1',
    level: 1,
    path: ['Men', 'Cap'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Trend1',
    description: 'Latest trend in pants',
    parentId: '4',
    level: 2,
    path: ['Men', 'Pants', 'Trend1'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    name: 'Trend2',
    description: 'Another trending pants style',
    parentId: '4',
    level: 2,
    path: ['Men', 'Pants', 'Trend2'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '15',
    name: 'Casual Trend1',
    description: 'Casual style of Trend1 pants',
    parentId: '8',
    level: 3,
    path: ['Men', 'Pants', 'Trend1', 'Casual Trend1'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '16',
    name: 'Formal Trend1',
    description: 'Formal style of Trend1 pants',
    parentId: '8',
    level: 3,
    path: ['Men', 'Pants', 'Trend1', 'Formal Trend1'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '17',
    name: 'Summer Trend2',
    description: 'Summer style of Trend2 pants',
    parentId: '9',
    level: 3,
    path: ['Men', 'Pants', 'Trend2', 'Summer Trend2'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '18',
    name: 'Winter Trend2',
    description: 'Winter style of Trend2 pants',
    parentId: '9',
    level: 3,
    path: ['Men', 'Pants', 'Trend2', 'Winter Trend2'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '19',
    name: 'Premium Casual',
    description: 'Premium casual style',
    parentId: '15',
    level: 4,
    path: ['Men', 'Pants', 'Trend1', 'Casual Trend1', 'Premium Casual'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    name: 'Sarees',
    description: 'Traditional and modern sarees',
    parentId: '2',
    level: 1,
    path: ['Women', 'Sarees'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    name: 'Kurtas',
    description: 'Traditional kurtas and suits',
    parentId: '2',
    level: 1,
    path: ['Women', 'Kurtas'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    name: 'Dresses',
    description: 'Western and fusion dresses',
    parentId: '2',
    level: 1,
    path: ['Women', 'Dresses'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    name: 'Boys',
    description: 'Clothing for boys',
    parentId: '3',
    level: 1,
    path: ['Kids', 'Boys'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '14',
    name: 'Girls',
    description: 'Clothing for girls',
    parentId: '3',
    level: 1,
    path: ['Kids', 'Girls'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoriesByParentId = (parentId?: string): Category[] => {
  return categories.filter(category => category.parentId === parentId);
};

export const getRootCategories = (): Category[] => {
  return getCategoriesByParentId(undefined);
};

export const buildCategoryTree = (): Category[] => {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    } else {
      rootCategories.push(categoryWithChildren);
    }
  });

  return rootCategories;
};

export const getCategoryPath = (categoryId: string): string[] => {
  const category = getCategoryById(categoryId);
  return category ? category.path : [];
};

export const searchCategories = (query: string): Category[] => {
  const lowercaseQuery = query.toLowerCase();
  return categories.filter(category =>
    category.name.toLowerCase().includes(lowercaseQuery) ||
    (category.description && category.description.toLowerCase().includes(lowercaseQuery)) ||
    category.path.some(pathSegment => pathSegment.toLowerCase().includes(lowercaseQuery))
  );
};
