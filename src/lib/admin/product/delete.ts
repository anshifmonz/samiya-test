import { supabaseAdmin } from '@/lib/supabase';

export default async function deleteProduct(productId: string): Promise<boolean> {
  // 1. Delete product_images (should cascade, but explicit for safety)
  const { error: imgError } = await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('product_id', productId);
  if (imgError) {
    console.error('Error deleting product images:', imgError);
    // Continue to try deleting product
  }

  // 2. Delete product_tags relationships (should cascade, but explicit for safety)
  const { error: tagError } = await supabaseAdmin
    .from('product_tags')
    .delete()
    .eq('product_id', productId);
  if (tagError) {
    console.error('Error deleting product tags:', tagError);
    // Continue to try deleting product
  }

  // 3. Delete product_colors (should cascade, but explicit for safety)
  const { error: colorError } = await supabaseAdmin
    .from('product_colors')
    .delete()
    .eq('product_id', productId);
  if (colorError) {
    console.error('Error deleting product colors:', colorError);
    // Continue to try deleting product
  }

  // 4. Delete product
  const { error: prodError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);
  if (prodError) {
    console.error('Error deleting product:', prodError);
    return false;
  }

  return true;
}
