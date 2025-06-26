
export interface Product {
  id: string;
  title: string;
  description: string;
  images: Record<string, string[]>;
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
      red: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      green: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
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
      white: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=600&fit=crop"],
      cream: ["https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=600&fit=crop"]
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
      pink: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"],
      yellow: ["https://images.unsplash.com/photo-1591814543388-0f9f7b074f8e?w=400&h=600&fit=crop"],
      purple: ["https://images.unsplash.com/photo-1582719478184-dcfdc4a3e99f?w=400&h=600&fit=crop"]
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
      white: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=600&fit=crop"]
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
      emerald: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      maroon: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      gold: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
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
      gold: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop"],
      cream: ["https://images.unsplash.com/photo-1594151030175-8d342b1ad48b?w=400&h=600&fit=crop"],
      burgundy: ["https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&h=600&fit=crop"]
    },
    price: 799,
    tags: ["wedding", "traditional", "kids"],
    category: "Kids"
  },
  {
    id: "7",
    title: "Chiffon Saree",
    description: "Lightweight chiffon saree with delicate prints and embroidery for a graceful look.",
    images: {
      peach: ["https://images.unsplash.com/photo-1520975925457-84c2f1c591e8?w=400&h=600&fit=crop"],
      lavender: ["https://images.unsplash.com/photo-1516205651411-aef33a44f74f?w=400&h=600&fit=crop"],
      mint: ["https://images.unsplash.com/photo-1519861531056-5cb62196611f?w=400&h=600&fit=crop"]
    },
    price: 1099,
    tags: ["evening", "lightweight", "elegant"],
    category: "Women"
  },
  {
    id: "8",
    title: "Men’s Blazer Jacket",
    description: "Tailored blazer with premium wool blend fabric, perfect for formal gatherings.",
    images: {
      grey: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"]
    },
    price: 2199,
    tags: ["formal", "wool", "premium"],
    category: "Gents"
  },
  {
    id: "9",
    title: "Girls Party Dress",
    description: "Cute party dress for girls with tulle skirt and sequin embellishments.",
    images: {
      pink: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      white: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      lavender: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 499,
    tags: ["party", "sparkle", "kids"],
    category: "Kids"
  },
  {
    id: "10",
    title: "Evening Gown",
    description: "Elegant floor-length evening gown with sequin detailing and a flattering silhouette.",
    images: {
      black: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      red: ["https://images.unsplash.com/photo-1520975925457-84c2f1c591e8?w=400&h=600&fit=crop"],
      emerald: ["https://images.unsplash.com/photo-1519861531056-5cb62196611f?w=400&h=600&fit=crop"]
    },
    price: 1799,
    tags: ["evening", "sequin", "luxury"],
    category: "Women"
  },
  {
    id: "11",
    title: "Gent’s Tuxedo",
    description: "Classic black tuxedo with satin lapels and a tailored fit for special events.",
    images: {
      black: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      midnight: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"],
      charcoal: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"]
    },
    price: 2499,
    tags: ["formal", "tuxedo", "premium"],
    category: "Gents"
  },
  {
    id: "12",
    title: "Kids Denim Jacket",
    description: "Stylish denim jacket for kids, perfect for casual outings and layering.",
    images: {
      blue: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      light: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      dark: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 399,
    tags: ["casual", "denim", "kids"],
    category: "Kids"
  },
  {
    id: "13",
    title: "Chic Palazzo Set",
    description: "Comfortable yet stylish palazzo pants paired with a matching top, ideal for everyday wear.",
    images: {
      beige: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400&h=600&fit=crop"],
      olive: ["https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=600&fit=crop"]
    },
    price: 799,
    tags: ["casual", "modern", "comfortable"],
    category: "Women"
  },
  {
    id: "14",
    title: "Traditional Dhoti Kurta",
    description: "Classic dhoti kurta set for men in breathable fabric, perfect for cultural events.",
    images: {
      white: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"],
      offwhite: ["https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=400&h=600&fit=crop"],
      cream: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=600&fit=crop"]
    },
    price: 999,
    tags: ["traditional", "cultural", "festive"],
    category: "Gents"
  },
  {
    id: "15",
    title: "Embroidered Kids Kurta",
    description: "Colorful kurta for kids with detailed thread embroidery and soft cotton fabric.",
    images: {
      skyblue: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      yellow: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      coral: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 549,
    tags: ["festive", "embroidery", "kids"],
    category: "Kids"
  },
  {
    id: "16",
    title: "Classic Salwar Suit",
    description: "Traditional salwar suit with dupatta, featuring elegant prints and comfortable fabric.",
    images: {
      pink: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      green: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
    },
    price: 899,
    tags: ["traditional", "comfortable", "printed"],
    category: "Women"
  },
  {
    id: "17",
    title: "Festive Sharara Set",
    description: "Beautiful sharara set with intricate embroidery, perfect for weddings and festivals.",
    images: {
      red: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      gold: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
    },
    price: 1399,
    tags: ["wedding", "festive", "embroidery"],
    category: "Women"
  },
  {
    id: "18",
    title: "Fusion Indo-Western Dress",
    description: "Modern dress with traditional elements, perfect for contemporary events.",
    images: {
      black: ["https://images.unsplash.com/photo-1520975925457-84c2f1c591e8?w=400&h=600&fit=crop"],
      white: ["https://images.unsplash.com/photo-1516205651411-aef33a44f74f?w=400&h=600&fit=crop"],
      pink: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"]
    },
    price: 1199,
    tags: ["modern", "fusion", "elegant"],
    category: "Women"
  },
  {
    id: "19",
    title: "Comfortable Cotton T-Shirt",
    description: "Soft and breathable cotton t-shirt for everyday wear.",
    images: {
      grey: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      white: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop"]
    },
    price: 299,
    tags: ["casual", "cotton", "comfortable"],
    category: "Gents"
  },
  {
    id: "20",
    title: "Classic Denim Jeans",
    description: "Durable and stylish denim jeans for a casual look.",
    images: {
      blue: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"],
      light: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 699,
    tags: ["casual", "denim", "stylish"],
    category: "Gents"
  },
  {
    id: "21",
    title: "Tailored Formal Suit",
    description: "Elegant suit for business and formal occasions.",
    images: {
      charcoal: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"]
    },
    price: 2999,
    tags: ["formal", "business", "tailored"],
    category: "Gents"
  },
  {
    id: "22",
    title: "Floral Frock for Girls",
    description: "Adorable frock with floral prints, perfect for casual outings.",
    images: {
      pink: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      yellow: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 399,
    tags: ["casual", "floral", "kids"],
    category: "Kids"
  },
  {
    id: "23",
    title: "Striped Polo Shirt for Boys",
    description: "Smart polo shirt with stripes, ideal for school or play.",
    images: {
      red: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      green: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 349,
    tags: ["school", "stripes", "kids"],
    category: "Kids"
  },
  {
    id: "24",
    title: "Warm Winter Jacket for Kids",
    description: "Cozy jacket with hood, perfect for cold weather.",
    images: {
      blue: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      red: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      grey: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 799,
    tags: ["winter", "warm", "kids"],
    category: "Kids"
  },
  {
    id: "25",
    title: "Silk Scarf",
    description: "Luxurious silk scarf with beautiful patterns.",
    images: {
      pattern1: ["https://images.unsplash.com/photo-1520975925457-84c2f1c591e8?w=400&h=600&fit=crop"],
      pattern2: ["https://images.unsplash.com/photo-1516205651411-aef33a44f74f?w=400&h=600&fit=crop"],
      pattern3: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"]
    },
    price: 499,
    tags: ["accessory", "silk", "elegant"],
    category: "Women"
  },
  {
    id: "26",
    title: "Georgette Lehenga",
    description: "Flowy georgette lehenga with heavy embroidery for festive celebrations.",
    images: {
      maroon: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      teal: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      purple: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
    },
    price: 1699,
    tags: ["festive", "lehenga", "embroidered"],
    category: "Women"
  },
  {
    id: "27",
    title: "Casual Hoodie",
    description: "Warm and stylish hoodie for a relaxed, everyday look.",
    images: {
      black: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      grey: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      olive: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"]
    },
    price: 599,
    tags: ["casual", "hoodie", "comfortable"],
    category: "Gents"
  },
  {
    id: "28",
    title: "Kids Tracksuit",
    description: "Sporty tracksuit for kids, ideal for active playtime.",
    images: {
      blue: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      red: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 499,
    tags: ["sporty", "casual", "kids"],
    category: "Kids"
  },
  {
    id: "29",
    title: "Printed Maxi Dress",
    description: "Flowy maxi dress with vibrant prints, perfect for summer outings.",
    images: {
      floral: ["https://images.unsplash.com/photo-1520975925457-84c2f1c591e8?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1516205651411-aef33a44f74f?w=400&h=600&fit=crop"],
      yellow: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"]
    },
    price: 999,
    tags: ["summer", "printed", "casual"],
    category: "Women"
  },
  {
    id: "30",
    title: "Leather Jacket",
    description: "Stylish leather jacket for a bold and edgy look.",
    images: {
      black: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      brown: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      tan: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"]
    },
    price: 1999,
    tags: ["leather", "stylish", "casual"],
    category: "Gents"
  },
  {
    id: "31",
    title: "Kids Party Suit",
    description: "Dapper suit for boys, perfect for parties and special occasions.",
    images: {
      navy: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      grey: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 699,
    tags: ["party", "formal", "kids"],
    category: "Kids"
  },
  {
    id: "32",
    title: "Embroidered Blouse",
    description: "Elegant blouse with detailed embroidery, pairs well with sarees or lehengas.",
    images: {
      gold: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      silver: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      pink: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
    },
    price: 599,
    tags: ["traditional", "embroidered", "elegant"],
    category: "Women"
  },
  {
    id: "33",
    title: "Cargo Pants",
    description: "Rugged cargo pants with multiple pockets for a utilitarian style.",
    images: {
      khaki: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b4?w=400&h=600&fit=crop"],
      olive: ["https://images.unsplash.com/photo-1599732212902-ed8a5641514a?w=400&h=600&fit=crop"]
    },
    price: 799,
    tags: ["casual", "cargo", "rugged"],
    category: "Gents"
  },
  {
    id: "34",
    title: "Kids Raincoat",
    description: "Bright and waterproof raincoat for kids, perfect for rainy days.",
    images: {
      yellow: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop"],
      blue: ["https://images.unsplash.com/photo-1593032465170-d8ec1696716a?w=400&h=600&fit=crop"],
      red: ["https://images.unsplash.com/photo-1586370479860-0718d4577f64?w=400&h=600&fit=crop"]
    },
    price: 399,
    tags: ["rainwear", "waterproof", "kids"],
    category: "Kids"
  },
  {
    id: "35",
    title: "Velvet Kurti",
    description: "Rich velvet kurti with subtle embellishments for a luxurious feel.",
    images: {
      maroon: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop"],
      navy: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop"],
      black: ["https://images.unsplash.com/photo-1583391733981-4679ba36b40a?w=400&h=600&fit=crop"]
    },
    price: 1099,
    tags: ["festive", "velvet", "luxury"],
    category: "Women"
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
