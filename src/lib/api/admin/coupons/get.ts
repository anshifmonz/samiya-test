import { supabaseAdmin } from 'lib/supabase';
import { err, ok } from 'utils/api/response';

export async function getCoupons() {
  const { data, error } = await supabaseAdmin.from('coupons').select('*');
  if (error) return err(error.message);

  return ok(data);
}

export async function getCoupon(id: number) {
  if (!id) return err('Coupon ID is required');

  const { data, error } = await supabaseAdmin.from('coupons').select('*').eq('id', id).single();
  if (error) return err(error.message);

  return ok(data);
}
