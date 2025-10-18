import type { Coupon } from 'types/coupon';
import { supabaseAdmin } from 'lib/supabase';
import { err, ok } from 'utils/api/response';
import { editCouponSchema } from 'lib/validators/coupon';

export async function updateCoupon(id: number, couponData: Partial<Coupon>) {
  if (!id) return err('Coupon ID is required');

  const { error: validationError } = editCouponSchema.safeParse(couponData);
  if (validationError) return err(validationError.message);

  const { data, error } = await supabaseAdmin
    .from('coupons')
    .update(couponData)
    .eq('id', id)
    .select()
    .single();

  if (error) return err(error.message);

  return ok(data);
}
