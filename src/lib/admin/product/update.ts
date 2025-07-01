import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { type Product } from '@/types/product';

export default async function updateProduct(product: Product): Promise<Product | null> {
  // 1. Find category_id by name
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('name', product.category)
    .limit(1);
  if (catError || !categories || categories.length === 0) {
    console.error('Category not found:', catError);
    return null;
  }
  const category_id = categories[0].id;

  // 2. Update product
  const { error: prodError } = await supabaseAdmin
    .from('products')
    .update({
      title: product.title,
      description: product.description,
      price: product.price,
      category_id,
      primary_color: Object.keys(product.images)[0] || null,
      primary_image_url: Object.values(product.images)[0]?.[0] || null,
    })
    .eq('id', product.id);
  if (prodError) {
    console.error('Error updating product:', prodError);
    return null;
  }

  // 3. Delete old images
  const { error: delImgError } = await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('product_id', product.id);
  if (delImgError) {
    console.error('Error deleting old product images:', delImgError);
  }

  // 4. Insert new images
  const imageRows = [];
  for (const [color, urls] of Object.entries(product.images)) {
    urls.forEach((url, idx) => {
      imageRows.push({
        product_id: product.id,
        color_name: color,
        image_url: url,
        is_primary: idx === 0,
        sort_order: idx,
      });
    });
  }
  if (imageRows.length > 0) {
    const { error: imgError } = await supabaseAdmin
      .from('product_images')
      .insert(imageRows);
    if (imgError) {
      console.error('Error inserting product images:', imgError);
    }
  }

  // 5. Handle tags
  // First, delete all existing tag relationships
  const { error: delTagError } = await supabaseAdmin
    .from('product_tags')
    .delete()
    .eq('product_id', product.id);
  if (delTagError) {
    console.error('Error deleting old product tags:', delTagError);
  }
  
  // Then add new tag relationships
  if (product.tags && product.tags.length > 0) {
    for (const tagName of product.tags) {
      // Find or create tag
      let { data: tagData, error: tagFindError } = await supabaseAdmin
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .limit(1);
      
      let tagId;
      if (tagFindError || !tagData || tagData.length === 0) {
        // Create new tag
        const { data: newTagData, error: tagCreateError } = await supabaseAdmin
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single();
        if (tagCreateError || !newTagData) {
          console.error('Error creating tag:', tagCreateError);
          continue;
        }
        tagId = newTagData.id;
      } else {
        tagId = tagData[0].id;
      }
      
      // Link product to tag
      const { error: linkError } = await supabaseAdmin
        .from('product_tags')
        .insert({
          product_id: product.id,
          tag_id: tagId,
        });
      if (linkError) {
        console.error('Error linking product to tag:', linkError);
      }
    }
  }

  // 6. Return the updated product
  return product;
}
