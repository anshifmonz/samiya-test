export interface CheckoutData {
  checkout: {
    id: string;
    status: string;
    expiresAt: string;
    createdAt: string;
  };
  items: CheckoutItem[];
  total: number;
}

export interface CheckoutItem {
  id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  products?: {
    primary_image_url: string;
  };
  product_colors?: {
    color_name: string;
    hex_code: string;
  };
  sizes?: {
    name: string;
  };
}
