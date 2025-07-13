import { supabaseAdmin } from '@/lib/supabase';
import { deleteMultipleImagesFromCloudinary } from '@/lib/upload/cloudinary-server';

export default async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const { data: productImages, error: fetchError } = await supabaseAdmin
      .from('product_images')
      .select('public_id')
      .eq('product_id', productId)
      .not('public_id', 'is', null);

    if (fetchError) {
      console.error('Error fetching product images:', fetchError);
    } else if (productImages && productImages.length > 0) {
      const publicIds = productImages.map(img => img.public_id).filter(Boolean);
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
    if (imgError) {
      console.error('Error deleting product images:', imgError);
    }

    const { error: tagError } = await supabaseAdmin
      .from('product_tags')
      .delete()
      .eq('product_id', productId);
    if (tagError) {
      console.error('Error deleting product tags:', tagError);
    }

    const { error: colorError } = await supabaseAdmin
      .from('product_colors')
      .delete()
      .eq('product_id', productId);
    if (colorError) {
      console.error('Error deleting product colors:', colorError);
    }

    const { error: prodError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);
    if (prodError) {
      console.error('Error deleting product:', prodError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
}
