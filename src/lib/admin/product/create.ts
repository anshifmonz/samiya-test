import { supabaseAdmin } from 'lib/supabase';
import type { Product, CreateProductData } from 'types/product';
import { prepareImagesForRPC, validateProductImagesOrder } from 'lib/utils/imageOrderingUtils';

export default async function createProduct(newProduct: CreateProductData): Promise<Product | null> {
  try {
    if (newProduct.images && Object.keys(newProduct.images).length > 0) {
      const { isValid, errors } = validateProductImagesOrder({
        ...newProduct,
        id: 'temp',
        short_code: 'temp'
      } as Product);

      if (!isValid) throw new Error(`Product images validation failed: ${errors}`);
    }

    const sizeIds = newProduct.sizes?.map(size => {
      if (!size.id || typeof size.id !== 'string') throw new Error(`Invalid size ID: ${size.id}`);
      return size.id.trim();
    }).filter(id => id !== null) || [];

    let ordered_colors = [];
    let hasColorSpecificSizes = false;

    if (newProduct.images && Object.keys(newProduct.images).length > 0) {
      const preparedData = prepareImagesForRPC({
        ...newProduct,
        id: 'temp',
        short_code: 'temp'
      } as Product);
      ordered_colors = preparedData.ordered_colors;

      // Check if any colors have specific sizes defined
      hasColorSpecificSizes = ordered_colors.some((color: any) => color.sizes && color.sizes.length > 0);
    }

    const { data, error } = await supabaseAdmin.rpc('create_product_rpc', {
      p_title: newProduct.title,
      p_description: newProduct.description,
      p_price: newProduct.price,
      p_category_id: newProduct.categoryId,
      p_colors: ordered_colors.length > 0 ? { ordered_colors } : null,
      p_original_price: newProduct.originalPrice || null,
      p_sizes: sizeIds,
      p_tags: newProduct.tags || [],
      p_is_active: newProduct.active ?? true
    });

    if (error) throw new Error(`Error calling create_product_rpc: ${error}`);
    if (data && data.status === 'error') throw new Error(`RPC Error: ${data.message}`);
    if (!data || data.status !== 'success' || !data.product_id) throw new Error(`Unexpected RPC response: ${data}`);

    return {
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
  } catch (error) {
    console.error(`Error creating product: ${error}`);
    return null;
  }
}
