import { supabaseAdmin } from 'lib/supabase';
import type { StockUpdate, StockSummary, LowStockItem } from 'types/product';
import { logAdminActivity } from 'utils/adminActivityLogger';

// This API route is not used/checked, created by AI.
/**
 * Update stock for a specific product-color-size combination
 */
export async function updateStock(stockUpdate: StockUpdate, adminUserId: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!stockUpdate.product_id || typeof stockUpdate.product_id !== 'string')
    return { success: false, error: 'Product ID is required and must be a string', status: 400 };
  if (!stockUpdate.color_name || typeof stockUpdate.color_name !== 'string')
    return { success: false, error: 'Color name is required and must be a string', status: 400 };
  if (!stockUpdate.size_id || typeof stockUpdate.size_id !== 'string')
    return { success: false, error: 'Size ID is required and must be a string', status: 400 };
  if (stockUpdate.stock_quantity === undefined || typeof stockUpdate.stock_quantity !== 'number' || stockUpdate.stock_quantity < 0)
    return { success: false, error: 'Stock quantity is required, must be a number, and cannot be negative', status: 400 };
  if (!adminUserId || typeof adminUserId !== 'string')
    return { success: false, error: 'Admin user ID is required and must be a string', status: 400 };

  const { data, error } = await supabaseAdmin.rpc('update_stock_rpc', {
    p_product_id: stockUpdate.product_id,
    p_color_name: stockUpdate.color_name,
    p_size_id: stockUpdate.size_id,
    p_stock_quantity: stockUpdate.stock_quantity,
    p_low_stock_threshold: stockUpdate.low_stock_threshold
  });

  if (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: 'Failed to update stock', status: 500 };
  }

  if (data && data.status === 'error') {
    console.error('RPC Error:', data.message);
    return { success: false, error: `RPC Error: ${data.message}`, status: 500 };
  }

  const success = data && data.status === 'success';

  logAdminActivity({
    admin_id: adminUserId,
    action: 'update',
    entity_type: 'stock',
    entity_id: stockUpdate.product_id,
    table_name: 'product_color_sizes',
    message: `Updated stock for product ${stockUpdate.product_id} - ${stockUpdate.color_name} (${stockUpdate.size_id}): ${stockUpdate.stock_quantity}`,
    error: error || null,
    status: success ? 'success' : 'failed',
    metadata: { stockUpdate },
    ...requestInfo,
  });

  return { success, error: null, status: success ? 200 : 500 };
}

/**
 * Bulk update stock quantities for multiple variants
 */
export async function bulkUpdateStock(stockUpdates: StockUpdate[], adminUserId: string, requestInfo = {}): Promise<{
  success: boolean;
  updated_count: number;
  error_count: number;
  errors?: any[];
  error?: string | null;
  status?: number;
}> {
  if (!stockUpdates || !Array.isArray(stockUpdates) || stockUpdates.length === 0)
    return { success: false, updated_count: 0, error_count: stockUpdates.length, error: 'Stock updates are required and must be a non-empty array', status: 400 };
  if (!adminUserId || typeof adminUserId !== 'string')
    return { success: false, updated_count: 0, error_count: stockUpdates.length, error: 'Admin user ID is required and must be a string', status: 400 };

  // Validate each stock update
  for (let index = 0; index < stockUpdates.length; index++) {
    const update = stockUpdates[index];
    if (!update.product_id || typeof update.product_id !== 'string')
      return { success: false, updated_count: 0, error_count: stockUpdates.length, error: `Stock update at index ${index}: Product ID is required and must be a string`, status: 400 };
    if (!update.color_name || typeof update.color_name !== 'string')
      return { success: false, updated_count: 0, error_count: stockUpdates.length, error: `Stock update at index ${index}: Color name is required and must be a string`, status: 400 };
    if (!update.size_id || typeof update.size_id !== 'string')
      return { success: false, updated_count: 0, error_count: stockUpdates.length, error: `Stock update at index ${index}: Size ID is required and must be a string`, status: 400 };
    if (update.stock_quantity === undefined || typeof update.stock_quantity !== 'number' || update.stock_quantity < 0)
      return { success: false, updated_count: 0, error_count: stockUpdates.length, error: `Stock update at index ${index}: Stock quantity is required, must be a number, and cannot be negative`, status: 400 };
  }

  const { data, error } = await supabaseAdmin.rpc('bulk_update_stock_rpc', {
    stock_updates: stockUpdates
  });

  if (error) {
    console.error('Error bulk updating stock:', error);
    return { success: false, updated_count: 0, error_count: stockUpdates.length, error: 'Failed to bulk update stock', status: 500 };
  }

  const result = {
    success: data.status === 'success',
    updated_count: data.updated_count || 0,
    error_count: data.error_count || 0,
    errors: data.errors || [],
    status: data.status === 'success' ? 200 : 500,
  };

  logAdminActivity({
    admin_id: adminUserId,
    action: 'update',
    entity_type: 'stock',
    table_name: 'product_color_sizes',
    message: `Bulk updated stock for ${stockUpdates.length} items - ${result.updated_count} successful, ${result.error_count} failed`,
    error: error || null,
    status: result.success ? 'success' : 'failed',
    metadata: { totalItems: stockUpdates.length, ...result },
    ...requestInfo,
  });

  return result;
}

/**
 * Get stock summary for a specific product
 */
export async function getProductStockSummary(productId: string): Promise<{ summary: StockSummary | null, error: string | null, status: number }> {
  // Validate required fields
  if (!productId || typeof productId !== 'string')
    return { summary: null, error: 'Product ID is required and must be a string', status: 400 };

  const { data, error } = await supabaseAdmin.rpc('get_product_stock_summary_rpc', {
    p_product_id: productId
  });

  if (error) {
    console.error('Error fetching product stock summary:', error);
    return { summary: null, error: 'Failed to fetch product stock summary', status: 500 };
  }

  if (data && data.status === 'error') {
    console.error('RPC Error:', data.message);
    return { summary: null, error: `RPC Error: ${data.message}`, status: 500 };
  }

  return { summary: data, error: null, status: 200 };
}

/**
 * Get items with low stock or out of stock
 */
export async function getLowStockItems(
  limit: number = 50,
  offset: number = 0
): Promise<{ items: LowStockItem[], error: string | null, status: number }> {
  if (limit === undefined || typeof limit !== 'number' || limit <= 0)
    return { items: [], error: 'Limit is required and must be a positive number', status: 400 };
  if (offset === undefined || typeof offset !== 'number' || offset < 0)
    return { items: [], error: 'Offset is required and must be a non-negative number', status: 400 };

  const { data, error } = await supabaseAdmin.rpc('get_low_stock_items_rpc', {
    limit_count: limit,
    offset_count: offset
  });

  if (error) {
    console.error('Error fetching low stock items:', error);
    return { items: [], error: 'Failed to fetch low stock items', status: 500 };
  }

  return { items: data || [], error: null, status: 200 };
}
