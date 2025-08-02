import { supabaseAdmin } from 'lib/supabase';
import { Product } from 'types/product';
import { prepareImagesForRPC, validateProductImagesOrder } from 'utils/imageOrderingUtils';
import { logAdminActivity, createProductMessage } from 'utils/adminActivityLogger';

export default async function updateProduct(product: Product, adminUserId?: string, requestInfo = {}): Promise<{ product: Product | null, error: string | null, status?: number }> {
  if (!product.id || typeof product.id !== 'string')
    return { product: null, error: 'Product ID is required and must be a string', status: 400 };
  if (!product.title || typeof product.title !== 'string')
    return { product: null, error: 'Title is required and must be a string', status: 400 };
  if (!product.price || typeof product.price !== 'number')
    return { product: null, error: 'Price is required and must be a number', status: 400 };
  if (!product.categoryId || typeof product.categoryId !== 'string')
    return { product: null, error: 'Category ID is required and must be a string', status: 400 };

  const { isValid, errors } = validateProductImagesOrder(product);
  if (!isValid) return { product: null, error: `Product images validation failed: ${errors}`, status: 400 };

  if (product.sizes)
    for (const size of product.sizes) {
      if (!size.id || typeof size.id !== 'string')
        return { product: null, error: `Invalid size ID: ${size.id}`, status: 400 };
    }

  const sizeIds = product.sizes?.map(size => size.id.trim()).filter(id => id !== null) || [];

  let ordered_colors = prepareImagesForRPC(product).ordered_colors;

  // ordered_colors with color-specific stock info in stock_data
  ordered_colors = ordered_colors.map((color: any) => {
    const colorKey = color.name;
    const colorData = product.images[colorKey];
    if (colorData?.sizes && colorData.sizes.length > 0) {
      const colorSizes = colorData.sizes.map(size => ({
        id: size.id,
        name: size.name,
        stock_quantity: size.stock_quantity || 0,
        low_stock_threshold: size.low_stock_threshold || 5
      }));
      return {
        ...color,
        sizes: colorSizes.map(size => size.id),
        stock_data: colorSizes
      };
    }
    return color;
  });

  const { data, error } = await supabaseAdmin.rpc('update_product', {
    p_product_id: product.id,
    p_title: product.title,
    p_description: product.description,
    p_price: product.price,
    p_category_id: product.categoryId,
    p_colors: { ordered_colors },
    p_original_price: product.originalPrice || null,
    p_sizes: sizeIds,
    p_tags: product.tags || [],
    p_is_active: product.active ?? true,
    p_preserve_stock: true
  });

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'product',
      entity_id: product.id,
      table_name: 'products',
      message: createProductMessage('update', product.title),
      error: error || null,
      status: error != null || data == null ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error updating product:', error);
    return { product: null, error: `Error updating product: ${error.message}`, status: 500 };
  }
  if (data && data.status === 'error') {
    console.error('RPC Error:', data.message);
    return { product: null, error: `RPC Error: ${data.message}`, status: 500 };
  }

  return { product, error: null, status: 200 };
}
