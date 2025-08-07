import { supabaseAdmin } from 'lib/supabase';
import { StockReservation } from 'types/order';

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

// Reserve stock for multiple items atomically using logical reservations
// This function checks stock availability and creates reservation records without modifying actual inventory
export async function reserveStock(
  items: ReserveStockItem[],
  reservationDurationMinutes: number = 15,
  checkoutSessionId: string
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
          if (stockError.code === 'PGRST116')
            return { success: false, error: `Product variant not found: ${item.product_id}-${item.color_id}-${item.size_id}` };
          throw new Error(`Database error checking stock: ${stockError.message}`);
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
          throw new Error(`Database error checking reservations: ${reservedError.message}`);
        }

        // Calculate total reserved quantity
        const totalReserved = reservedData?.reduce((sum, res) => sum + res.quantity, 0) || 0;
        const availableStock = stockData.stock_quantity - totalReserved;

        // Check if enough stock is available after considering reservations
        if (availableStock < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for product variant ${item.product_id}-${item.color_id}-${item.size_id}. Available: ${availableStock}, Requested: ${item.quantity}`
          };
        }

        return { success: true, availableStock };
      })
    );

    // Check if any stock checks failed
    const failedCheck = stockChecks.find(check => !check.success);
    if (failedCheck) return { success: false, error: failedCheck.error, status: 400 };

    // Create logical reservations in the database
    for (const item of items) {
      const sessionId = checkoutSessionId;

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
      };

      const { error: reservationError } = await supabaseAdmin
        .from('reserved_stock')
        .insert(reservationData);

      if (reservationError) {
        await rollbackReservations(reservations);
        if (reservationError.code === '23505') // unique constraint violation
          return { success: false, error: 'This item is already reserved for this checkout session', status: 409 };
        throw new Error(`Database error creating reservation: ${reservationError.message}`);
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

    return {
      success: true,
      reservations
    };

  } catch (error) {
    console.error('Error in reserveStock:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

// Release reserved stock by marking reservations as released
export async function releaseStock(reservations: StockReservation[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!reservations || !Array.isArray(reservations) || reservations.length === 0)
      return { success: true }; // Nothing to release

    // mark reservations as released in the database
    for (const reservation of reservations) {
      const { error: updateError } = await supabaseAdmin
        .from('reserved_stock')
        .update({
          status: 'released',
          updated_at: new Date().toISOString()
        })
        .eq('product_id', reservation.product_id)
        .eq('color_id', reservation.color_id)
        .eq('size_id', reservation.size_id)
        .eq('quantity', reservation.quantity)
        .eq('status', 'active');

        if (updateError) console.error('Error releasing stock reservation:', updateError);
        // Continue with other reservations even if one fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error in releaseStock:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Release reservations by checkout session ID
export async function releaseStockByCheckoutSession(checkoutSessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!checkoutSessionId) return { success: false, error: 'Checkout session ID is required' };

    const { error: updateError } = await supabaseAdmin
      .from('reserved_stock')
      .update({
        status: 'released',
        updated_at: new Date().toISOString()
      })
      .eq('checkout_session_id', checkoutSessionId)
      .eq('status', 'active');

    if (updateError) {
      console.error('Error releasing stock reservations by checkout session:', updateError);
      return { success: false, error: 'Failed to release reservations' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in releaseStockByCheckoutSession:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Helper function to rollback reservations in case of failure
async function rollbackReservations(reservations: StockReservation[]): Promise<void> {
  if (reservations.length === 0) return;

  try {
    await releaseStock(reservations);
  } catch (error) {
    console.error('Error during rollback:', error);
  }
}

// Check if stock is available for given items without reserving, considering existing reservations
export async function checkStockAvailability(items: ReserveStockItem[]): Promise<{
  success: boolean;
  error?: string;
  status?: number;
  availability?: { [key: string]: { available: number; requested: number; sufficient: boolean; actualStock: number; reserved: number } };
}> {
  try {
    if (!items || !Array.isArray(items) || items.length === 0) return { success: false, error: 'Items array is required and cannot be empty', status: 400 };

    const availability: { [key: string]: { available: number; requested: number; sufficient: boolean; actualStock: number; reserved: number } } = {};

    for (const item of items) {
      const key = `${item.product_id}-${item.color_id}-${item.size_id}`;

      // Get actual stock quantity
      const { data: stockData, error: stockError } = await supabaseAdmin
        .from('product_color_sizes')
        .select('stock_quantity')
        .eq('product_id', item.product_id)
        .eq('color_id', item.color_id)
        .eq('size_id', item.size_id)
        .single();

      if (stockError) {
        if (stockError.code === 'PGRST116') {
          availability[key] = { available: 0, requested: item.quantity, sufficient: false, actualStock: 0, reserved: 0 };
        } else {
          throw new Error(`Database error: ${stockError.message}`);
        }
      } else {
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
          throw new Error(`Database error checking reservations: ${reservedError.message}`);
        }

        // Calculate total reserved quantity
        const totalReserved = reservedData?.reduce((sum, res) => sum + res.quantity, 0) || 0;
        const availableStock = stockData.stock_quantity - totalReserved;

        availability[key] = {
          available: availableStock,
          requested: item.quantity,
          sufficient: availableStock >= item.quantity,
          actualStock: stockData.stock_quantity,
          reserved: totalReserved
        };
      }
    }

    const allSufficient = Object.values(availability).every(item => item.sufficient);

    return {
      success: true,
      availability,
      ...(allSufficient ? {} : { error: 'Insufficient stock for some items', status: 400 })
    };

  } catch (error) {
    console.error('Error in checkStockAvailability:', error);
    return { success: false, error: 'Internal server error', status: 500 };
  }
}

// Mark reservations as consumed when order is successfully created
export async function consumeReservations(checkoutSessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!checkoutSessionId) return { success: false, error: 'Checkout session ID is required' };

    const { error: updateError } = await supabaseAdmin
      .from('reserved_stock')
      .update({
        status: 'consumed',
        updated_at: new Date().toISOString()
      })
      .eq('checkout_session_id', checkoutSessionId)
      .eq('status', 'active');

    if (updateError) {
      console.error('Error consuming stock reservations:', updateError);
      return { success: false, error: 'Failed to consume reservations' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in consumeReservations:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Clean up expired reservations
export async function cleanupExpiredReservations(): Promise<{ success: boolean; error?: string; cleanedCount?: number }> {
  try {
    const { data: expiredReservations, error: updateError } = await supabaseAdmin
      .from('reserved_stock')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (updateError) {
      console.error('Error cleaning up expired reservations:', updateError);
      return { success: false, error: 'Failed to cleanup expired reservations' };
    }

    return {
      success: true,
      cleanedCount: expiredReservations?.length || 0
    };
  } catch (error) {
    console.error('Error in cleanupExpiredReservations:', error);
    return { success: false, error: 'Internal server error' };
  }
}
