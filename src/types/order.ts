import { AddressFormData } from './address';

// Database-aligned types for order management
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  final_price: number; // per item price
  total_price: number; // final_price * quantity (computed)
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string; // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_method?: string;
  payment_status: string; // 'unpaid', 'paid', 'failed', 'refunded'
  shipping_address_id?: string;
  created_at: string;
  updated_at: string;
}

// Extended order with items for API responses
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Order summary for checkout completion
export interface OrderSummary {
  orderId: string;
  orderNumber?: string;
  total: number;
  itemCount: number;
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    color?: string;
    size?: string;
    image?: string;
  }[];
  shippingAddress?: any;
  status: string;
  createdAt: string;
}

// For creating orders from checkout
export interface CreateOrderRequest {
  userId: string;
  checkoutId: string;
  orderAddressId: string;
  paymentMethod: string;
  address?: AddressFormData & {
    saveAddress: boolean;
  };
}

export interface CreateOrderResponse {
  success?: boolean;
  error?: string;
  status?: number;
  data?: {
    orderId: string;
    payment_required?: boolean;
    payment?: {
      payment_session_id: string;
      cf_order_id: string;
      order_id: string;
      payment_url?: string;
    } | null;
    payment_error?: string;
  };
}

// Order history types for API responses
export interface OrderHistoryItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  final_price: number;
  total_price: number;
  created_at: string;
  // Product details (if product still exists)
  product?: {
    id: string;
    title: string;
    primary_image_url?: string;
    short_code?: string;
  };
}

export interface OrderHistory {
  id: string;
  user_id: string;
  order_number: string; // Generated order number like ORD-2024-001
  total_amount: number;
  status: string;
  payment_method?: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  // Tracking (optional)
  shiprocket_order_id?: string | null;
  shiprocket_tracking_url?: string | null;
  shiprocket_awb_code?: string | null;
  // Related data
  items: OrderHistoryItem[];
  shipping_address?: {
    id: string;
    label: string;
    full_name: string;
    phone: string;
    street: string;
    landmark?: string;
    city: string;
    district?: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface GetOrderHistoryResponse {
  orders: OrderHistory[];
  totalCount: number;
  page: number;
  limit: number;
}

// Stock reservation types
export interface StockReservation {
  product_id: string;
  color_id: string;
  size_id: string;
  quantity: number;
  reserved_until: string;
}
