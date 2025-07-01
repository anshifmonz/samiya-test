import { supabase } from '@/lib/supabase';

export default async function deleteProduct(productId: string): Promise<boolean> {
  // 1. Delete product_images (should cascade, but explicit for safety)
  const { error: imgError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);
  if (imgError) {
    console.error('Error deleting product images:', imgError);
    // Continue to try deleting product
  }

  // 2. Delete product
  const { error: prodError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  if (prodError) {
    console.error('Error deleting product:', prodError);
    return false;
  }

  return true;
}
