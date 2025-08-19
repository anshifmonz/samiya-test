export interface ShiprocketAuthResponse {
  token: string;
}

export interface ShiprocketWebhookPayload {
  event: string;
  current_status: string;
  awb_code: string;
  order_id: string | number; // Shiprocket order id
  shipment_id: string | number;
  courier: string;
  tracking_url: string;
  // include full raw data catch-all
  [key: string]: any;
}

export interface SRReturnOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  hsn?: string;
  return_reason?: ShiprocketReturnReason;
  qc_enable?: 'true' | 'false';
  qc_color?: string;
  qc_brand?: string;
  qc_serial_no?: string;
  qc_ean_barcode?: string;
  qc_size?: string;
  qc_product_name?: string;
  qc_product_image?: string;
  qc_product_imei?: string;
  qc_brand_tag?: 0 | 1;
  qc_used_check?: 0 | 1;
  qc_sealtag_check?: 0 | 1;
  qc_check_damaged_product?: 'yes' | 'no';
}

export interface SRReturnOrderPayload {
  order_id: string;
  order_date: string;
  channel_id?: number;
  pickup_customer_name: string;
  pickup_last_name?: string;
  pickup_address: string;
  pickup_address_2?: string;
  pickup_city: string;
  pickup_state: string;
  pickup_country: string;
  pickup_pincode: number;
  pickup_email: string;
  pickup_phone: string;
  pickup_isd_code?: string;
  shipping_customer_name: string;
  shipping_last_name?: string;
  shipping_address: string;
  shipping_address_2?: string;
  shipping_city: string;
  shipping_country: string;
  shipping_pincode: number;
  shipping_state: string;
  shipping_email?: string;
  shipping_isd_code?: string;
  shipping_phone: number;
  order_items: SRReturnOrderItem[];
  payment_method: 'Prepaid';
  total_discount?: string;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface OrderItem {
  name: string; // Product name
  sku: string; // SKU ID
  units: number; // Units to ship
  selling_price: number; // Price per unit (inclusive of GST)
  discount?: number; // Discount amount
  tax?: number; // Tax percentage
  hsn?: number; // HSN code
}

export interface CreateOrderParams {
  // Order Info
  order_id: string; // Max 50 chars
  order_date: string; // yyyy-mm-dd HH:mm
  pickup_location: string;
  channel_id?: number;
  comment?: string;
  reseller_name?: string;
  company_name?: string;

  // Billing Info
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: number;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: number;
  billing_alternate_phone?: number;
  billing_isd_code?: string;

  // Shipping Info
  shipping_is_billing: boolean; // true if shipping same as billing
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: number;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: number;
  longitude?: number;
  latitude?: number;

  // Items
  order_items: OrderItem[];

  // Payment & Charges
  payment_method: string; // COD or Prepaid
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;

  // Dimensions
  length: number; // in cm (> 0.5)
  breadth: number; // in cm (> 0.5)
  height: number; // in cm (> 0.5)
  weight: number; // in kg (> 0)

  // Optional Shipping Details
  ewaybill_no?: string;
  customer_gstin?: string;
  invoice_number?: string;
  order_type?: 'ESSENTIALS' | 'NON ESSENTIALS' | ''; // case-sensitive
  checkout_shipping_method?: 'SR_RUSH' | 'SR_STANDARD' | 'SR_EXPRESS' | 'SR_QUICK';
  what3words_address?: string;
  is_insurance_opt?: boolean;
  is_document?: number; // 1 or 0
  order_tag?: string;
}

export type ShiprocketReturnReason =
  | 'Bought by Mistake'
  | 'Better price available'
  | 'Performance or quality not adequate'
  | 'Incompatible or not useful'
  | 'Product damaged, but shipping box OK'
  | 'Item arrived too late'
  | 'Missing parts or accessories'
  | 'Both product and shipping box damaged'
  | 'Wrong item was sent'
  | "Item defective or doesn't work"
  | 'No longer needed'
  | "Didn't approve purchase"
  | 'Inaccurate website description'
  | 'Return against replacement'
  | 'Delay Refund'
  | 'Delivered Late'
  | 'Product does not Match Description on Website'
  | 'Both Product & Outer Box Damaged'
  | 'Defective or does not work'
  | 'Product damaged, but outer Box OK'
  | 'Missing Parts or Accessories'
  | 'Incorrect Item Delivered'
  | "Product Defective or Doesn't Work"
  | 'Product performance/quality is not up to my expectations'
  | 'Other'
  | 'Changed my mind'
  | 'Does not fit'
  | 'Size not as expected'
  | 'Item is damaged'
  | 'Received wrong item'
  | 'Parcel damaged on arrival'
  | 'Quality not as expected'
  | 'Missing Item or accessories'
  | 'Performance not adequate'
  | 'Not as described'
  | 'Arrived too late'
  | 'Order Not Received'
  | 'Empty Package'
  | 'Wrong item or Wrong colour was sent'
  | 'Item defective, expired, spoilt or does not work'
  | 'Items or parts missing'
  | 'Size or Quantity issues'
  | 'Status as delivered but order not received'
  | 'N/A';
