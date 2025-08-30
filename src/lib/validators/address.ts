import * as z from 'zod';

export const addressSchema = z.object({
  id: z.string().optional(),

  label: z
    .string()
    .min(3, { message: 'Label must be at least 3 characters' })
    .max(50, { message: 'Label must be at most 50 characters' }),

  full_name: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters' })
    .max(100, { message: 'Full name must be at most 100 characters' }),

  phone: z
    .string()
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' }),

  phone_secondary: z
    .string()
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .or(z.literal('')),

  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(50, { message: 'Email must be at most 50 characters' })
    .optional(),

  street: z
    .string()
    .min(5, { message: 'Street must be at least 5 characters' })
    .max(150, { message: 'Street must be at most 150 characters' }),

  landmark: z
    .string()
    .min(3, { message: 'Landmark must be at least 3 characters' })
    .max(50, { message: 'Landmark must be at most 50 characters' }),

  city: z
    .string()
    .min(3, { message: 'City must be at least 3 characters' })
    .max(50, { message: 'City must be at most 50 characters' }),

  district: z
    .string()
    .min(3, { message: 'District must be at least 3 characters' })
    .max(50, { message: 'District must be at most 50 characters' }),

  state: z
    .string()
    .min(3, { message: 'State must be at least 3 characters' })
    .max(50, { message: 'State must be at most 50 characters' }),

  postal_code: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, { message: 'Postal code must be a valid 6-digit Indian PIN code' }),

  country: z
    .string()
    .min(3, { message: 'Country must be at least 3 characters' })
    .max(50, { message: 'Country must be at most 50 characters' }),

  type: z.enum(['shipping', 'billing']).optional(),

  saveAddress: z.boolean().optional()
});

export type AddressFormValues = z.infer<typeof addressSchema>;
