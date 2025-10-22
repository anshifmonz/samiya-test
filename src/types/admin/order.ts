export type Order = {
  id: string;
  created_at: string;
  status: string;
  final_price: number;
  payment_status: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  skus: string[];
};

export type EventRow = {
  id: string;
  order_id: string | null;
  status_id: number | null;
  local_status_id: number | null; // e.g. 1,2,3,4,5
  previous_statuses: number[]; // array like [1, 2, 3, 4, ...90]
  manual_attempts: number;
  event_time: string | null;
  status_text?: string | null;
  description?: string | null;
  when_arises?: string | null;
  follow_up_action?: string | null;
  actions?: string | null;
};

export type Summary = {
  total_events: number;
  by_action: Record<string, number>; // e.g. { normal: 120, refund: 4, retry: 10, return: 8, cancelled: 2 }
  total_actions_needed: number; // sum of actionable items
};

export type ApiResponseData = {
  events: EventRow[];
  summary: Summary;
};

export interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    full_name: string;
    phone: string;
    street: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address: {
    full_name: string;
    phone: string;
    street: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    postal_code: string;
    country: string;
  };
  order_items: {
    id: string;
    quantity: number;
    final_price: number;
    total_price: number;
    product_name: string;
    color_name: string;
    size_name: string;
    sku: string;
    product_image: string;
  }[];
  payment: {
    transaction_id: string;
    cf_payment_id: string;
  };
  financial_summary: {
    subtotal: number;
    discount: number;
    shipping_cost: number;
    taxes: number;
    grand_total: number;
  };
}
