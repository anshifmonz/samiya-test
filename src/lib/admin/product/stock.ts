import { supabaseAdmin } from 'lib/supabase';
import type { StockUpdate, StockSummary, LowStockItem } from 'types/product';

// This API route is not used/checked, created by AI.
/**
 * Update stock for a specific product-color-size combination
 */
export async function updateStock(stockUpdate: StockUpdate): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc('update_stock_rpc', {
      p_product_id: stockUpdate.product_id,
      p_color_name: stockUpdate.color_name,
      p_size_id: stockUpdate.size_id,
      p_stock_quantity: stockUpdate.stock_quantity,
      p_low_stock_threshold: stockUpdate.low_stock_threshold
    });

    if (error) {
      console.error('Error updating stock:', error);
      return false;
    }

    if (data && data.status === 'error') {
      console.error('RPC Error:', data.message);
      return false;
    }

    return data && data.status === 'success';
  } catch (error) {
    console.error('Error updating stock:', error);
    return false;
  }
}

/**
 * Bulk update stock quantities for multiple variants
 */
export async function bulkUpdateStock(stockUpdates: StockUpdate[]): Promise<{
  success: boolean;
  updated_count: number;
  error_count: number;
  errors?: any[];
}> {
  try {
    const { data, error } = await supabaseAdmin.rpc('bulk_update_stock_rpc', {
      stock_updates: stockUpdates
    });

    if (error) {
      console.error('Error bulk updating stock:', error);
      return { success: false, updated_count: 0, error_count: stockUpdates.length };
    }

    return {
      success: data.status === 'success',
      updated_count: data.updated_count || 0,
      error_count: data.error_count || 0,
      errors: data.errors || []
    };
  } catch (error) {
    console.error('Error bulk updating stock:', error);
    return { success: false, updated_count: 0, error_count: stockUpdates.length };
  }
}

/**
 * Get stock summary for a specific product
 */
export async function getProductStockSummary(productId: string): Promise<StockSummary | null> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_product_stock_summary_rpc', {
      p_product_id: productId
    });

    if (error) {
      console.error('Error fetching product stock summary:', error);
      return null;
    }

    if (data && data.status === 'error') {
      console.error('RPC Error:', data.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product stock summary:', error);
    return null;
  }
}

/**
 * Get items with low stock or out of stock
 */
export async function getLowStockItems(
  limit: number = 50,
  offset: number = 0
): Promise<LowStockItem[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_low_stock_items_rpc', {
      limit_count: limit,
      offset_count: offset
    });

    if (error) {
      console.error('Error fetching low stock items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
}
