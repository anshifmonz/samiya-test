import { supabaseAdmin } from '@/lib/supabase';
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

  // 2. Determine primary color and image (first color, first image of that color)
  const colorKeys = Object.keys(product.images);
  const primaryColor = colorKeys[0] || null;
  const primaryImageUrl = primaryColor ? product.images[primaryColor]?.[0] || null : null;

  // Update product
  const { error: prodError } = await supabaseAdmin
    .from('products')
    .update({
      title: product.title,
      description: product.description,
      price: product.price,
      category_id,
      primary_color: primaryColor,
      primary_image_url: primaryImageUrl,
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

  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const urls = product.images[color];
    urls.forEach((url, idx) => {
      // Primary image is the first image of the first color
      const isPrimary = colorIndex === 0 && idx === 0;
      imageRows.push({
        product_id: product.id,
        color_name: color,
        image_url: url,
        is_primary: isPrimary,
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

  // 4.5. Delete old colors and insert new ones
  const { error: delColorError } = await supabaseAdmin
    .from('product_colors')
    .delete()
    .eq('product_id', product.id);
  if (delColorError) {
    console.error('Error deleting old product colors:', delColorError);
  }

  // Insert new colors
  const colorRows = [];
  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    colorRows.push({
      product_id: product.id,
      color_name: color,
      is_primary: colorIndex === 0,
      sort_order: colorIndex,
    });
  }
  if (colorRows.length > 0) {
    const { error: colorError } = await supabaseAdmin
      .from('product_colors')
      .insert(colorRows);
    if (colorError) {
      console.error('Error inserting product colors:', colorError);
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
