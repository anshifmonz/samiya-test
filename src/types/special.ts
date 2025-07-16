export interface SpecialProduct {
  id: string;
  title: string;
  images: string[];
  price: number;
  originalPrice?: number;
}

export interface Special {
  id: string;
  name: string;
  description: string;
  products: SpecialProduct[];
}
