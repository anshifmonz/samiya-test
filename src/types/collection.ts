export type Collection = {
  id: string;
  title: string;
  description: string;
  image: string;
};

interface ProductColors {
  color_name: string;
  hex_code: string;
}

export interface SectionProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  primary_image_url: string | null;
  available_colors: ProductColors[];
}

export interface SectionWithProducts {
  id: string;
  title: string;
  description: string;
  products: SectionProduct[];
}
