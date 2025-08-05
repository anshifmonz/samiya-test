export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  created_at: string;
}

export interface WishlistWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  color_id: string;
  size_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    original_price?: number;
    primary_image_url?: string;
  };
  color: {
    id: string;
    color_name: string;
    hex_code?: string;
  };
  size: {
    id: string;
    name: string;
    description?: string;
  };
}
