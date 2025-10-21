export interface Coupon {
  id: number;
  code: string;
  amount: number;
  type: 'fixed' | 'percentage';
  start_date: string;
  end_date: string;
  expired_at?: string;
  created_at: string;
}
