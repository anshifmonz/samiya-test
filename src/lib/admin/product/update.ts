import { supabaseAdmin } from 'lib/supabase';
import { Product } from 'types/product';
import { prepareImagesForRPC, validateProductImagesOrder } from 'utils/imageOrderingUtils';

export default async function updateProduct(product: Product): Promise<Product | null> {
  const { isValid, errors } = validateProductImagesOrder(product);
  if (!isValid) {
    console.error('Product images validation failed:', errors);
    return null;
  }

  const sizeIds = product.sizes?.map(size => {
    if (!size.id || typeof size.id !== 'string') {
      console.error('Invalid size ID:', size.id);
      return null;
    }
    return size.id.trim();
  }).filter(id => id !== null) || [];

  const { ordered_colors } = prepareImagesForRPC(product);

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
    p_is_active: product.active ?? true
  });

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  if (data && data.status === 'error') {
    console.error('RPC Error:', data.message);
    return null;
  }

  return product;
}
