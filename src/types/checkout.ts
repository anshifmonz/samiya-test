export interface CheckoutData {
  checkout: {
    id: string;
    status: string;
    createdAt: string;
  };
  items: CheckoutItem[];
  total: number;
}

export interface CheckoutItem {
  id: string;
  productId: string;
  colorId: string;
  sizeId: string;
  title: string;
  price: number;
  quantity: number;
  selectedColor: string;
  colorHex: string;
  selectedSize: string;
  image: string;
}
