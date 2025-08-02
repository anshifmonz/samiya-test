import { supabaseAdmin } from 'lib/supabase';
import { deleteMultipleImagesFromCloudinary } from 'lib/upload/cloudinary-server';
import isValidPublicId from 'utils/isValidPublicId';
import { logAdminActivity, createProductMessage } from 'utils/adminActivityLogger';

export default async function deleteProduct(productId: string, adminUserId?: string, requestInfo = {}): Promise<{ success: boolean, error: string | null, status?: number }> {
  if (!productId || typeof productId !== 'string')
    return { success: false, error: 'Product ID is required and must be a string', status: 400 };

  // First get product title for logging
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('title')
    .eq('id', productId)
    .single();

  const productTitle = product?.title || 'Unknown Product';

  const { data: productImages, error: fetchError } = await supabaseAdmin
    .from('product_images')
    .select('public_id')
    .eq('product_id', productId)
    .not('public_id', 'is', null);

  if (fetchError) {
    console.error('Error fetching product images:', fetchError);
  } else if (productImages && productImages.length > 0) {
    const publicIds = productImages.map(img => img.public_id).filter(isValidPublicId);
    if (publicIds.length > 0) {
      const cloudinaryResult = await deleteMultipleImagesFromCloudinary(publicIds);
      if (!cloudinaryResult.success) {
        console.warn('Some images could not be deleted from Cloudinary:', cloudinaryResult.errors);
      }
    }
  }

  const { error: imgError } = await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('product_id', productId);
  if (imgError) console.error('Error deleting product images:', imgError);

  const { error: tagError } = await supabaseAdmin
    .from('product_tags')
    .delete()
    .eq('product_id', productId);
  if (tagError) console.error('Error deleting product tags:', tagError);

  const { error: colorError } = await supabaseAdmin
    .from('product_colors')
    .delete()
    .eq('product_id', productId);
  if (colorError) console.error('Error deleting product colors:', colorError);

  const { error: prodError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);

  if (adminUserId) {
    logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'product',
      entity_id: productId,
      table_name: 'products',
      message: createProductMessage('delete', productTitle),
      error: prodError || null,
      status: prodError ? 'failed' : 'success',
      ...requestInfo,
    });
  }

  if (prodError) {
    console.error('Error deleting product:', prodError);
    return { success: false, error: 'Failed to delete product', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}
