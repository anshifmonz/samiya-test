import { supabaseAdmin } from 'lib/supabase';
import type { Product, CreateProductData } from 'types/product';
import { prepareImagesForRPC, validateProductImagesOrder } from 'utils/imageOrderingUtils';
import { logAdminActivity, createProductMessage } from 'utils/adminActivityLogger';

export default async function createProduct(
  newProduct: CreateProductData,
  adminUserId?: string,
  requestInfo = {}
): Promise<{ product: Product | null; error: string | null; status?: number }> {
  try {
    if (!newProduct.title || typeof newProduct.title !== 'string')
      return { product: null, error: 'Title is required and must be a string', status: 400 };
    if (!newProduct.price || typeof newProduct.price !== 'number')
      return { product: null, error: 'Price is required and must be a number', status: 400 };
    if (!newProduct.categoryId || typeof newProduct.categoryId !== 'string')
      return { product: null, error: 'Category ID is required and must be a string', status: 400 };

    if (newProduct.images && Object.keys(newProduct.images).length > 0) {
      const { isValid, errors } = validateProductImagesOrder({
        ...newProduct,
        id: 'temp',
        short_code: 'temp'
      } as Product);

      if (!isValid)
        return { product: null, error: `Product images validation failed: ${errors}`, status: 400 };
    }

    if (newProduct.sizes)
      for (const size of newProduct.sizes) {
        if (!size.id || typeof size.id !== 'string')
          return { product: null, error: `Invalid size ID: ${size.id}`, status: 400 };
      }

    const sizeIds = newProduct.sizes?.map(size => size.id.trim()).filter(id => id !== null) || [];

    let ordered_colors = [];

    if (newProduct.images && Object.keys(newProduct.images).length > 0) {
      const preparedData = prepareImagesForRPC({
        ...newProduct,
        id: 'temp',
        short_code: 'temp'
      } as Product);
      ordered_colors = preparedData.ordered_colors;

      // ordered_colors with color-specific stock info in stock_data
      ordered_colors = ordered_colors.map((color: any, _: number) => {
        const colorKey = color.name;
        const colorData = newProduct.images[colorKey];

        if (colorData?.sizes && colorData.sizes.length > 0) {
          // color-specific sizes with stock information
          const colorSizes = colorData.sizes.map(size => ({
            id: size.id,
            name: size.name,
            stock_quantity: size.stock_quantity || 0,
            low_stock_threshold: size.low_stock_threshold || 1
          }));

          return {
            ...color,
            sizes: colorSizes.map(size => size.id),
            stock_data: colorSizes
          };
        }

        return color;
      });
    }

    const dbParams = {
      p_title: newProduct.title,
      p_description: newProduct.description,
      p_price: newProduct.price,
      p_category_id: newProduct.categoryId,
      p_colors: ordered_colors.length > 0 ? { ordered_colors } : null,
      p_original_price: newProduct.originalPrice || null,
      p_sizes: sizeIds,
      p_tags: newProduct.tags || [],
      p_is_active: newProduct.active ?? true
    };

    const { data, error } = await supabaseAdmin.rpc('create_product_rpc', dbParams);
    if (adminUserId) {
      logAdminActivity({
        admin_id: adminUserId,
        action: 'create',
        entity_type: 'product',
        entity_id: data.product_id,
        table_name: 'products',
        message: createProductMessage('create', newProduct.title),
        error: error || null,
        status: error != null || data == null ? 'failed' : 'success',
        ...requestInfo
      });
    }

    if (error)
      return {
        product: null,
        error: `Error calling create_product_rpc: ${error.message}`,
        status: 500
      };
    if (data && data.status === 'error')
      return { product: null, error: `RPC Error: ${data.message}`, status: 500 };
    if (!data || data.status !== 'success' || !data.product_id)
      return { product: null, error: `Unexpected RPC response: ${data}`, status: 500 };

    const product = {
      id: data.product_id,
      short_code: data.short_code,
      title: newProduct.title,
      description: newProduct.description,
      images: newProduct.images || {},
      price: newProduct.price,
      originalPrice: newProduct.originalPrice,
      tags: newProduct.tags || [],
      categoryId: newProduct.categoryId,
      sizes: newProduct.sizes || [],
      active: newProduct.active ?? true
    };
    return { product, error: null, status: 201 };
  } catch (error) {
    console.error(`Error creating product: ${error}`);
    return { product: null, error: 'Internal server error', status: 500 };
  }
}
