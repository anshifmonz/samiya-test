import * as z from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3, { message: 'Code must be at least 3 characters' }),
  amount: z.number().min(0, { message: 'Amount must be a positive number' }),
  type: z.enum(['fixed', 'percentage']),
  start_date: z.string(),
  end_date: z.string(),
  is_active: z.boolean().default(true),
});

export const editCouponSchema = z.object({
  amount: z.number().min(0, { message: 'Amount must be a positive number' }),
  start_date: z.string(),
  end_date: z.string(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
export type EditCouponFormValues = z.infer<typeof editCouponSchema>;
