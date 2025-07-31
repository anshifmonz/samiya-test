import { supabaseAdmin } from 'lib/supabase';
import { Product } from 'types/product';
import { prepareImagesForRPC, validateProductImagesOrder } from 'utils/imageOrderingUtils';
import { logAdminActivity, createProductMessage } from 'utils/adminActivityLogger';

export default async function updateProduct(product: Product, adminUserId?: string, requestInfo = {}): Promise<Product | null> {
  try {
    const { isValid, errors } = validateProductImagesOrder(product);
    if (!isValid) throw new Error(`Product images validation failed: ${errors}`);

    const sizeIds = product.sizes?.map(size => {
      if (!size.id || typeof size.id !== 'string') throw new Error(`Invalid size ID: ${size.id}`);
      return size.id.trim();
    }).filter(id => id !== null) || [];

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
      await logAdminActivity({
        admin_id: adminUserId,
        action: 'update',
        entity_type: 'product',
        entity_id: product.id,
        table_name: 'products',
        message: createProductMessage('update', product.title),
        status: error != null || data == null ? 'failed' : 'success',
        ...requestInfo,
      });
    }

    if (error) throw new Error(`Error updating product: ${error.message}`);
    if (data && data.status === 'error') throw new Error(`RPC Error: ${data.message}`);

    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}
