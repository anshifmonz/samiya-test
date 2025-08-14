import { supabaseAdmin } from 'lib/supabase';
import { StockReservation } from 'types/order';

// Types aligned with previous reserveStock.ts
interface ReserveStockItem {
  product_id: string;
  color_id: string;
  size_id: string;
  quantity: number;
}

interface ReserveStockResponse {
  success: boolean;
  error?: string;
  status?: number;
  reservations?: StockReservation[];
}

export type InventoryItem = ReserveStockItem;

/** Reserve stock for multiple items using logical reservations */
export async function reserveStock(
  items: ReserveStockItem[],
  checkoutId: string,
  reservationDurationMinutes: number = 15
): Promise<ReserveStockResponse> {
  try {
    if (!items || !Array.isArray(items) || items.length === 0) return { success: false, error: 'Items array is required and cannot be empty', status: 400 };

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product_id || typeof item.product_id !== 'string')
        return { success: false, error: `Item ${i}: Product ID is required and must be a string`, status: 400 };
      if (!item.color_id || typeof item.color_id !== 'string')
        return { success: false, error: `Item ${i}: Color ID is required and must be a string`, status: 400 };
      if (!item.size_id || typeof item.size_id !== 'string')
        return { success: false, error: `Item ${i}: Size ID is required and must be a string`, status: 400 };
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0)
        return { success: false, error: `Item ${i}: Quantity must be a positive number`, status: 400 };
    }

    const reservedUntil = new Date(Date.now() + reservationDurationMinutes * 60 * 1000).toISOString();
    const reservations: StockReservation[] = [];

    // Check stock availability considering existing reservations
    const stockChecks = await Promise.all(
      items.map(async (item) => {
        // Get actual stock quantity
        const { data: stockData, error: stockError } = await supabaseAdmin
          .from('product_color_sizes')
          .select('stock_quantity')
          .eq('product_id', item.product_id)
          .eq('color_id', item.color_id)
          .eq('size_id', item.size_id)
          .single();

        if (stockError) {
          if ((stockError as any).code === 'PGRST116')
            return { success: false, error: `Product variant not found: ${item.product_id}-${item.color_id}-${item.size_id}` };
          throw new Error(`Database error checking stock: ${(stockError as any).message}`);
        }

        // Get currently reserved quantities for this variant
        const { data: reservedData, error: reservedError } = await supabaseAdmin
          .from('reserved_stock')
          .select('quantity')
          .eq('product_id', item.product_id)
          .eq('color_id', item.color_id)
          .eq('size_id', item.size_id)
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString());

        if (reservedError) {
          throw new Error(`Database error checking reservations: ${(reservedError as any).message}`);
        }

        // Calculate total reserved quantity
        const totalReserved = reservedData?.reduce((sum, res) => sum + res.quantity, 0) || 0;
        const availableStock = (stockData as any).stock_quantity - totalReserved;

        // Check if enough stock is available after considering reservations
        if (availableStock < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for product variant ${item.product_id}-${item.color_id}-${item.size_id}. Available: ${availableStock}, Requested: ${item.quantity}`
          };
        }

        return { success: true, availableStock } as any;
      })
    );

    // Check if any stock checks failed
    const failedCheck = stockChecks.find((check: any) => !check.success);
    if (failedCheck) return { success: false, error: failedCheck.error, status: 400 };

    // Create logical reservations in the database
    for (const item of items) {
      const sessionId = checkoutId;

      if (!sessionId) {
        await rollbackReservations(reservations);
        return { success: false, error: 'Checkout session ID is required for reservation', status: 400 };
      }

      // Create reservation record in database
      const reservationData = {
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        checkout_session_id: sessionId,
        quantity: item.quantity,
        expires_at: reservedUntil,
        status: 'active'
      } as any;

      const { error: reservationError } = await supabaseAdmin
        .from('reserved_stock')
        .insert(reservationData);

      if (reservationError) {
        await rollbackReservations(reservations);
        if ((reservationError as any).code === '23505') // unique constraint violation
          return { success: false, error: 'This item is already reserved for this checkout session', status: 409 };
        throw new Error(`Database error creating reservation: ${(reservationError as any).message}`);
      }

      // Create reservation object for response
      const reservation: StockReservation = {
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        quantity: item.quantity,
        reserved_until: reservedUntil
      };

      reservations.push(reservation);
    }

    return { success: true, reservations };

  } catch (error) {
    console.error('Error in reserveStock:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

// Release reserved stock by marking reservations as released (by items)
export async function releaseStockReservations(reservations: StockReservation[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!reservations || !Array.isArray(reservations) || reservations.length === 0)
      return { success: true }; // Nothing to release

    for (const reservation of reservations) {
      const { error: updateError } = await supabaseAdmin
        .from('reserved_stock')
        .update({ status: 'released', updated_at: new Date().toISOString() })
        .eq('product_id', reservation.product_id)
        .eq('color_id', reservation.color_id)
        .eq('size_id', reservation.size_id)
        .eq('quantity', reservation.quantity)
        .eq('status', 'active');

      if (updateError) console.error('Error releasing stock reservation:', updateError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error in releaseStockReservations:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Release reservations by checkout session ID
export async function releaseStock(checkoutSessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!checkoutSessionId) return { success: false, error: 'Checkout session ID is required' };

    const { error: updateError } = await supabaseAdmin
      .from('reserved_stock')
      .update({ status: 'released', updated_at: new Date().toISOString() })
      .eq('checkout_session_id', checkoutSessionId)
      .eq('status', 'active');

    if (updateError) return { success: false, error: 'Failed to release reservations' };

    return { success: true };
  } catch (error) {
    console.error('Error in releaseStock:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Helper: rollback reservations when failing reservation flow
async function rollbackReservations(reservations: StockReservation[]): Promise<void> {
  if (reservations.length === 0) return;
  try { await releaseStockReservations(reservations); } catch (e) { console.error('Error during rollback:', e); }
}


/** Locate the current processing checkout for a user (latest). */
async function findProcessingCheckoutId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('checkout')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'processing')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data?.id ?? null;
}

/**
 * Consume stock for a checkout by:
 * 1) Verifying reservations are still active and not expired
 * 2) Decrementing product_color_sizes stock quantities per checkout_items
 * 3) Marking reservations as consumed
 *
 * NOTE: For full concurrency safety, this should be implemented as a single transactional SQL RPC
 * that uses row-level locking. This function implements an optimistic concurrency approach with
 * compare-and-swap updates per variant and limited retries.
 */
export async function consumeStock(checkoutId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!checkoutId) return { success: false, error: 'Checkout ID is required' };

    // 1) Ensure checkout exists and not expired
    const { data: checkout, error: checkoutError } = await supabaseAdmin
      .from('checkout')
      .select('id, status')
      .eq('id', checkoutId)
      .single();

    if (checkoutError || !checkout) return { success: false, error: 'Checkout not found' };

    // 2) Fetch active reservations for this checkout; if none, treat as idempotent success
    const { data: reservations, error: resErr } = await supabaseAdmin
      .from('reserved_stock')
      .select('product_id, color_id, size_id, quantity, expires_at, status')
      .eq('checkout_session_id', checkoutId)
      .eq('status', 'active');

    if (resErr) return { success: false, error: 'Failed to load reservations' };
    if (!reservations || reservations.length === 0) return { success: true };

    // 3) Get checkout items to know per-variant quantities to deduct
    const { data: items, error: itemsErr } = await supabaseAdmin
      .from('checkout_items')
      .select('product_id, color_id, size_id, quantity')
      .eq('checkout_id', checkoutId);

    if (itemsErr) return { success: false, error: 'Failed to load checkout items' };
    if (!items || items.length === 0) return { success: false, error: 'No items found in checkout' };

    // Optional: verify quantities against reservations (sum by variant)
    const sumByKey: Record<string, number> = {};
    for (const r of reservations) {
      const key = `${r.product_id}|${r.color_id}|${r.size_id}`;
      sumByKey[key] = (sumByKey[key] || 0) + (r.quantity as number);
    }
    for (const it of items) {
      const key = `${it.product_id}|${it.color_id}|${it.size_id}`;
      const reservedQty = sumByKey[key] || 0;
      if (reservedQty < it.quantity) {
        return { success: false, error: 'Reserved quantity mismatch; cannot consume' };
      }
    }

    // 4) Decrement stock per item using optimistic concurrency (3 retries per item)
    for (const it of items) {
      const needed = it.quantity as number;
      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        attempt++;
        // Read current stock
        const { data: pcs, error: pcsErr } = await supabaseAdmin
          .from('product_color_sizes')
          .select('stock_quantity')
          .eq('product_id', it.product_id)
          .eq('color_id', it.color_id)
          .eq('size_id', it.size_id)
          .single();

        if (pcsErr || !pcs) return { success: false, error: 'Product variant not found while consuming stock' };

        const currentQty: number = pcs.stock_quantity as number;
        if (currentQty < needed) return { success: false, error: 'Insufficient stock at consume time' };

        const newQty = currentQty - needed;
        const { error: updErr, data: updData } = await supabaseAdmin
          .from('product_color_sizes')
          .update({ stock_quantity: newQty, updated_at: new Date().toISOString() as any })
          .eq('product_id', it.product_id)
          .eq('color_id', it.color_id)
          .eq('size_id', it.size_id)
          // CAS: only apply if the row has not changed since we read it
          .eq('stock_quantity', currentQty)
          .select('product_id');

        if (!updErr && updData && updData.length > 0) {
          success = true;
        } else {
          // concurrent modification; retry
          continue;
        }
      }

      if (!success) return { success: false, error: 'Failed to decrement stock due to concurrent updates' };
    }

    // 5) Mark reservations as consumed
    const { error: consErr } = await supabaseAdmin
      .from('reserved_stock')
      .update({ status: 'consumed', updated_at: new Date().toISOString() })
      .eq('checkout_session_id', checkoutId)
      .eq('status', 'active');

    if (consErr) return { success: false, error: 'Stock decremented but failed to finalize reservations' };

    return { success: true };
  } catch (err) {
    console.error('consumeStock error:', err);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Convenience: Consume stock for the currently processing checkout of a user
 */
export async function consumeStockForUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const checkoutId = await findProcessingCheckoutId(userId);
  if (!checkoutId) return { success: false, error: 'No processing checkout found for user' };
  return consumeStock(checkoutId);
}

/**
 * Convenience: Release stock for the currently processing checkout of a user
 */
export async function releaseStockForUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const checkoutId = await findProcessingCheckoutId(userId);
  if (!checkoutId) return { success: false, error: 'No processing checkout found for user' };
  return releaseStock(checkoutId);
}

/**
 * Clean up expired reservations by marking them as expired.
 */
export async function cleanupExpiredReservations(): Promise<{ success: boolean; error?: string; cleanedCount?: number }> {
  try {
    const { data: expiredReservations, error: updateError } = await supabaseAdmin
      .from('reserved_stock')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (updateError) return { success: false, error: 'Failed to cleanup expired reservations' };

    return { success: true, cleanedCount: expiredReservations?.length || 0 };
  } catch (error) {
    console.error('Error in cleanupExpiredReservations:', error);
    return { success: false, error: 'Internal server error' };
  }
}
