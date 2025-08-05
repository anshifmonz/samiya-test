export interface CartItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  selected: boolean;
}