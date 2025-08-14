import { supabaseAdmin } from '../supabase';

// Constrained to match CHECK constraints in sql/tables/users.sql
export type UserAction =
  | 'register' | 'login' | 'logout' // Auth-specific
  | 'add' | 'update' | 'remove' // Generic
  | 'enable' | 'disable' // Two-factor auth
  | 'start' | 'complete' | 'abandoned' // Checkout-specific
  | 'placed' | 'cancelled' | 'delivered' | 'returned' // Order-specific
  | 'initiated' | 'success' | 'failed' // Payment-specific
  | 'view' | 'search'; // Generic

export type UserEntityType =
  | 'user' | 'profile' | 'email' | 'phone' | 'password' | 'address'
  | 'wishlist' | 'cart' | 'checkout' | 'order' | 'payment'
  | 'product' | 'search';

export interface UserActivityLogParams {
  user_id?: string;
  action: UserAction;
  entity_type?: UserEntityType; // optional per schema (no NOT NULL), but recommended
  entity_id?: string;

  // Domain-specific IDs present in table schema
  product_id?: string;
  color_id?: string;
  size_id?: string; // CHAR(3)
  order_id?: string;
  payment_id?: string;
  checkout_id?: string;

  session_id?: string;

  // Context
  request_path?: string;
  ip_address?: string;
  user_agent?: string;

  // Structured payloads (table defaults to '{}', so undefined is preferred when empty)
  metadata?: Record<string, any>;
  error?: any;

  // Convenience fields (not in schema) that we embed into metadata
  message?: string;
  status: 'success' | 'failed';
}

/**
 * Logs a user activity into the user_activity_logs table.
 * Non-blocking: returns false on failure and never throws.
 */
export async function logUserActivity(params: UserActivityLogParams): Promise<boolean> {
  try {
    // Merge convenience fields into metadata to avoid schema mismatch
    const mergedMetadata = {
      ...(params.metadata ?? {}),
      ...(params.message ? { message: params.message } : {}),
    };

    const insertPayload: Record<string, any> = {
      user_id: params.user_id,
      action: params.action,
      ...(params.entity_type ? { entity_type: params.entity_type } : null),
      entity_id: params.entity_id ?? null,

      product_id: params.product_id ?? null,
      color_id: params.color_id ?? null,
      size_id: params.size_id ?? null,
      order_id: params.order_id ?? null,
      payment_id: params.payment_id ?? null,
      checkout_id: params.checkout_id ?? null,

      session_id: params.session_id ?? null,
      request_path: params.request_path ?? null,
      ip_address: params.ip_address ?? null,
      user_agent: params.user_agent ?? null,

      // Let DB defaults fill NOT NULL jsonb columns when empty by omitting undefined
      ...(Object.keys(mergedMetadata).length > 0 ? { metadata: mergedMetadata } : null),
      status: params.status,
      ...(params.error !== undefined && params.error !== null ? { error: params.error } : null),
    };

    const { error } = await supabaseAdmin
      .from('user_activity_logs')
      .insert(insertPayload);

    if (error) return false;
    return true;
  } catch (_) {
    return false;
  }
}

// Optional helpers for consistent messages across the app
export function createUserProductMessage(action: 'view' | 'add' | 'remove' | 'placed', productTitle: string, details?: string): string {
  const base = `${capitalize(action)} product "${productTitle}"`;
  return details ? `${base} - ${details}` : base;
}

export function createUserAuthMessage(action: 'register' | 'login' | 'logout', success: boolean, details?: string): string {
  const base = `${capitalize(action)} ${success ? 'success' : 'failed'}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserOrderMessage(action: 'checkout' | 'placed' | 'cancelled' | 'returned', orderId?: string, details?: string): string {
  const base = `${capitalize(action)}${orderId ? ` (order ${orderId})` : ''}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserWishlistMessage(action: 'add' | 'remove', itemName: string, details?: string): string {
  const base = `${capitalize(action)} wishlist item "${itemName}"`;
  return details ? `${base} - ${details}` : base;
}

export function createUserCartMessage(action: 'add' | 'remove' | 'update', productTitle: string, quantity?: number, details?: string): string {
  const qty = quantity && quantity > 0 ? ` x${quantity}` : '';
  const base = `${capitalize(action)} cart item "${productTitle}"${qty}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserProfileMessage(action: 'update' | 'enable' | 'disable', fields?: string[], details?: string): string {
  const fieldsPart = fields && fields.length ? ` (fields: ${fields.join(', ')})` : '';
  const base = `${capitalize(action)} profile${fieldsPart}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserAddressMessage(action: 'add' | 'update' | 'remove', label?: string, details?: string): string {
  const base = `${capitalize(action)} address${label ? ` "${label}"` : ''}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserPaymentMessage(action: 'initiated' | 'success' | 'failed' | 'cancelled', method?: string, amount?: number, transactionId?: string, details?: string): string {
  const parts: string[] = [capitalize(action), 'payment'];
  if (method) parts.push(`(${method})`);
  if (amount != null) parts.push(`amount: ${amount}`);
  if (transactionId) parts.push(`txn: ${transactionId}`);
  const base = parts.join(' ');
  return details ? `${base} - ${details}` : base;
}

export function createUserSearchMessage(query: string, results?: number, details?: string): string {
  const base = `Search "${query}"${typeof results === 'number' ? ` (results: ${results})` : ''}`;
  return details ? `${base} - ${details}` : base;
}

export function createUserCheckoutMessage(action: 'start' | 'complete', checkoutId?: string, details?: string): string {
  const actionWord = action === 'start' ? 'Start' : 'Complete';
  const base = `${actionWord} checkout${checkoutId ? ` (${checkoutId})` : ''}`;
  return details ? `${base} - ${details}` : base;
}

export function createGenericUserActivityMessage(entity: UserEntityType, action: UserAction, subject?: string, details?: string): string {
  const base = `${capitalize(action)} ${entity}${subject ? ` "${subject}"` : ''}`;
  return details ? `${base} - ${details}` : base;
}


function capitalize(s: string) {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
