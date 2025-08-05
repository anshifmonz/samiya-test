export interface CartItem {
  id: string;
  productId: string;
  colorId: string;
  sizeId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedSize: string;
  selectedColor: string;
  colorHex?: string;
  quantity: number;
  selected: boolean;
}
