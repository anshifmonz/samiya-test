export interface Coupon {
  id: number;
  code: string;
  amount: number;
  type: 'fixed' | 'percentage';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}
