import { supabasePublic } from 'src/lib/supabasePublic';
import { ok, err, jsonResponse } from 'src/lib/utils/api/response';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return jsonResponse(err('Coupon code is required', 400));

    const { data: coupon, error } = await supabasePublic
      .from('coupons')
      .select('start_date, end_date, expired_at, amount, type')
      .eq('code', code)
      .single();

    if (error) return jsonResponse(err('Error validating coupon', 500));
    if (!coupon) return jsonResponse(ok({ valid: false, message: 'Coupon not found' }));

    const currentDate = new Date();
    const startDate = new Date(coupon.start_date);
    if (currentDate < startDate)
      return jsonResponse(ok({ valid: false, message: 'Coupon is not active yet' }));

    const endDate = new Date(coupon.end_date);
    const isExpired = currentDate > endDate || coupon.expired_at !== null;

    if (isExpired) return jsonResponse(ok({ valid: false, message: 'Coupon has expired' }));

    return jsonResponse(
      ok({
        valid: true,
        message: 'Coupon is valid',
        amount: coupon.amount,
        type: coupon.type
      })
    );
  } catch (_) {
    return jsonResponse(err());
  }
}
