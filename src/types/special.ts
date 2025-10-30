export interface SpecialProduct {
  id: string;
  slug?: string;
  title: string;
  images: string[];
  price: number;
  originalPrice?: number;
}

export interface Special {
  id: string;
  slug?: string;
  name: string;
  description: string;
  products: SpecialProduct[];
}
