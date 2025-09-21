import { supabaseAdmin } from 'lib/supabase';
import { type StockReservation } from 'types/order';

type ReserveStockRPCRequestItem = {
  product_id: string;
  color_id: string;
  size_id: string;
  quantity: number;
};

async function reserveStock(
  items: ReserveStockRPCRequestItem[],
  checkoutId: string,
  minutes: number = 15
): Promise<{
  success: boolean;
  error?: string;
  reservations?: StockReservation[];
  status?: number;
}> {
  try {
    if (!Array.isArray(items) || items.length === 0)
      return { success: false, error: 'Items array is required and cannot be empty', status: 400 };
    if (!checkoutId)
      return { success: false, error: 'Checkout session ID is required', status: 400 };

    const { data, error } = await supabaseAdmin.rpc('reserve_stock_rpc', {
      p_checkout_session_id: checkoutId,
      p_items: items,
      p_reservation_minutes: minutes
    });

    if (error) {
      console.error('reserve_stock_rpc error:', error);
      return { success: false, error: 'Failed to reserve stock', status: 500 };
    }

    const resp = data as any;
    console.log('reserve_stock_rpc response:', resp?.error);
    if (!resp?.success)
      return { success: false, error: resp?.error || 'Reservation failed', status: 400 };

    const reservations: StockReservation[] = (resp.reservations || []).map((r: any) => ({
      product_id: r.product_id,
      color_id: r.color_id,
      size_id: r.size_id,
      quantity: r.quantity,
      reserved_until: r.reserved_until
    }));

    return { success: true, reservations };
  } catch (e) {
    console.error('reserveStockRPC exception:', e);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

async function releaseStockReservations(
  reservations: StockReservation[]
): Promise<{ success: boolean; released?: number; error?: string; status?: number }> {
  try {
    if (!Array.isArray(reservations) || reservations.length === 0)
      return { success: true, released: 0 };

    const { data, error } = await supabaseAdmin.rpc('release_reservations_rpc', {
      p_reservations: reservations
    });

    if (error) {
      console.error('release_reservations_rpc error:', error);
      return { success: false, error: 'Failed to release reservations', status: 500 };
    }

    const resp = data as any;
    if (!resp?.success)
      return { success: false, error: resp?.error || 'Release failed', status: 400 };

    return { success: true, released: Number(resp.released || 0) };
  } catch (e) {
    console.error('releaseStockReservationsRPC exception:', e);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

async function releaseStock(
  checkoutId: string
): Promise<{ success: boolean; released?: number; error?: string; status?: number }> {
  try {
    if (!checkoutId)
      return { success: false, error: 'Checkout session ID is required', status: 400 };

    const { data, error } = await supabaseAdmin.rpc('release_stock_rpc', {
      p_checkout_session_id: checkoutId
    });

    if (error) {
      console.error('release_stock error:', error);
      return { success: false, error: 'Failed to release reservations', status: 500 };
    }

    const resp = data as any;
    if (!resp?.success)
      return { success: false, error: resp?.error || 'Release failed', status: 400 };

    return { success: true, released: Number(resp.released || 0) };
  } catch (e) {
    console.error('releaseStockByCheckoutRPC exception:', e);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

async function consumeStock(
  checkoutId: string
): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    if (!checkoutId) return { success: false, error: 'Checkout ID is required', status: 400 };

    const { data, error } = await supabaseAdmin.rpc('consume_stock_rpc', {
      p_checkout_id: checkoutId
    });

    if (error) {
      console.error('consume_stock_rpc error:', error);
      return { success: false, error: 'Failed to consume stock', status: 500 };
    }

    const resp = data as any;
    if (!resp?.success)
      return { success: false, error: resp?.error || 'Consume stock failed', status: 400 };

    return { success: true };
  } catch (e) {
    console.error('consumeStock exception:', e);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

// Helper: rollback reservations when failing reservation flow
async function rollbackReservations(reservations: StockReservation[]): Promise<void> {
  if (reservations.length === 0) return;
  try {
    await releaseStockReservations(reservations);
  } catch (e) {
    console.error('Error during rollback:', e);
  }
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

async function cleanupExpiredReservations(): Promise<{
  success: boolean;
  error?: string;
  cleanedCount?: number;
}> {
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

export {
  reserveStock,
  releaseStockReservations,
  releaseStock,
  consumeStock,
  rollbackReservations,
  findProcessingCheckoutId,
  cleanupExpiredReservations
};
export type { ReserveStockRPCRequestItem, StockReservation };
