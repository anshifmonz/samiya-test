import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Product, NewProductInput } from '@/types';

export default async function createProduct(newProduct: NewProductInput): Promise<Product | null> {
  // 1. Find category_id by name
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('name', newProduct.category)
    .limit(1);
  if (catError || !categories || categories.length === 0) {
    console.error('Category not found:', catError);
    return null;
  }
  const category_id = categories[0].id;

  // Determine primary color and image (first color, first image of that color)
  const colorKeys = Object.keys(newProduct.images);
  const primaryColor = colorKeys[0] || null;
  const primaryImageUrl = primaryColor ? newProduct.images[primaryColor]?.[0] || null : null;

  const { data: productData, error: prodError } = await supabaseAdmin
    .from('products')
    .insert({
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      category_id,
      is_active: true,
      primary_color: primaryColor,
      primary_image_url: primaryImageUrl,
    })
    .select()
    .single();
  if (prodError || !productData) {
    console.error('Error inserting product:', prodError);
    return null;
  }

  const productId = productData.id;
  const imageRows = [];
  
  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const urls = newProduct.images[color];
    urls.forEach((url, idx) => {
      // Primary image is the first image of the first color
      const isPrimary = colorIndex === 0 && idx === 0;
      imageRows.push({
        product_id: productId,
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

  // 2.5. Insert product colors
  const colorRows = [];
  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    colorRows.push({
      product_id: productId,
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

  // 3. Handle tags
  if (newProduct.tags && newProduct.tags.length > 0) {
    for (const tagName of newProduct.tags) {
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
          product_id: productId,
          tag_id: tagId,
        });
      if (linkError) {
        console.error('Error linking product to tag:', linkError);
      }
    }
  }

  return {
    id: productId,
    title: productData.title,
    description: productData.description,
    images: newProduct.images,
    price: productData.price,
    tags: newProduct.tags,
    category: newProduct.category,
  };
}
