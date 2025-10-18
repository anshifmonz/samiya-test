import type { Coupon } from 'types/coupon';
import { supabaseAdmin } from 'lib/supabase';
import { err, ok } from 'utils/api/response';
import { couponSchema } from 'lib/validators/coupon';

export async function createCoupon(couponData: Omit<Coupon, 'id' | 'created_at'>) {
  const { error: validationError } = couponSchema.safeParse(couponData);
  if (validationError) return err(validationError.message);

  const { data, error } = await supabaseAdmin.from('coupons').insert(couponData).select().single();
  if (error) return err(error.message);

  return ok(data);
}
