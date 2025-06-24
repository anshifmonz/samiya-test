
export interface Product {
  id: string;
  title: string;
  description: string;
  images: Record<string, string>;
  price: number;
  tags: string[];
  category: 'Gents' | 'Women' | 'Kids';
}

export const products: Product[] = [
  {
    id: "1",
    title: "Elegant Silk Saree",
    description: "Luxurious wedding saree in pure silk with intricate embroidery and golden border details.",
    images: {
      red: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop",
      blue: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop",
      green: "https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"
    },
    price: 1499,
    tags: ["wedding", "festive", "silk"],
    category: "Women"
  },
  {
    id: "2",
    title: "Designer Kurta Set",
    description: "Premium cotton kurta with matching pajama, perfect for festive occasions and traditional ceremonies.",
    images: {
      white: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=600&fit=crop",
      cream: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400&h=600&fit=crop",
      navy: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=600&fit=crop"
    },
    price: 899,
    tags: ["festive", "cotton", "traditional"],
    category: "Gents"
  },
  {
    id: "3",
    title: "Kids Lehenga Choli",
    description: "Beautiful traditional lehenga choli for kids with mirror work and vibrant colors.",
    images: {
      pink: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      yellow: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      purple: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"
    },
    price: 699,
    tags: ["wedding", "festive", "kids"],
    category: "Kids"
  },
  {
    id: "4",
    title: "Formal Shirt Collection",
    description: "Premium formal shirts with perfect fit and elegant patterns, ideal for office and formal events.",
    images: {
      white: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop",
      blue: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop",
      black: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"
    },
    price: 599,
    tags: ["formal", "office", "cotton"],
    category: "Gents"
  },
  {
    id: "5",
    title: "Anarkali Dress",
    description: "Stunning anarkali dress with intricate embroidery and flowing silhouette for special occasions.",
    images: {
      emerald: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop",
      maroon: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop",
      gold: "https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"
    },
    price: 1299,
    tags: ["wedding", "festive", "embroidery"],
    category: "Women"
  },
  {
    id: "6",
    title: "Boys Sherwanis",
    description: "Traditional sherwani for boys with elegant patterns and comfortable fit for weddings.",
    images: {
      gold: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      cream: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      burgundy: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"
    },
    price: 799,
    tags: ["wedding", "traditional", "kids"],
    category: "Kids"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const searchProducts = (query: string, filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  tags?: string[];
}): Product[] => {
  let filtered = products;

  // Text search
  if (query) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        filters.colors!.some(color => Object.keys(product.images).includes(color))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }
  }

  return filtered;
};
