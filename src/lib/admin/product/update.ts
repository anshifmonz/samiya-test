import { supabaseAdmin } from 'lib/supabase';
import { type Product } from 'types/product';
import { generateImagePublicId } from 'utils/imageIdUtils';

export default async function updateProduct(product: Product): Promise<Product | null> {
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('id', product.categoryId)
    .limit(1);
  if (catError || !categories || categories.length === 0) {
    console.error('Category not found:', catError);
    return null;
  }
  const category_id = categories[0].id;

  const colorKeys = Object.keys(product.images);
  const primaryColor = colorKeys[0] || null;
  const primaryImageUrl = primaryColor ? product.images[primaryColor]?.images[0]?.url || null : null;

  const { error: prodError } = await supabaseAdmin
    .from('products')
    .update({
      title: product.title,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice ?? null,
      category_id,
      primary_color: primaryColor,
      primary_image_url: primaryImageUrl,
      is_active: product.active,
    })
    .eq('id', product.id);
  if (prodError) {
    console.error('Error updating product:', prodError);
    return null;
  }

  const { error: delImgError } = await supabaseAdmin
    .from('product_images')
    .delete()
    .eq('product_id', product.id);
  if (delImgError) {
    console.error('Error deleting old product images:', delImgError);
  }

  const imageRows = [];

  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const colorData = product.images[color];
    const images = colorData.images;

    // deduplication to prevent duplicate images with same product_id, color_name, image_url
    // prevents violations of CONSTRAINT unique_product_color_image UNIQUE (product_id, color_name, image_url)
    const uniqueImages = new Map<string, any>();

    images.forEach((img, _) => {
      const imageUrl = typeof img === 'string' ? img : img.url;
      let publicId = typeof img === 'string' ? null : img.publicId;

      if (!imageUrl || imageUrl.trim() === '') return;
      if (!publicId || publicId.trim() === '')
        publicId = generateImagePublicId(imageUrl);

      const uniqueKey = `${product.id}:${color}:${imageUrl}`;

      if (uniqueImages.has(uniqueKey)) return;

      const isPrimary = colorIndex === 0 && uniqueImages.size === 0;
      const imageRow = {
        product_id: product.id,
        color_name: color,
        hex_code: colorData.hex,
        image_url: imageUrl,
        public_id: publicId,
        is_primary: isPrimary,
        sort_order: uniqueImages.size,
      };

      uniqueImages.set(uniqueKey, imageRow);
    });

    imageRows.push(...Array.from(uniqueImages.values()));
  }

  if (imageRows.length > 0) {
    const { error: imgError } = await supabaseAdmin
      .from('product_images')
      .insert(imageRows);
    if (imgError) {
      console.error('Error inserting product images:', imgError);
      if (imgError.code === '23505') {
        console.error('Unique constraint violation for product_images (likely unique_product_color_image):', {
          constraint: 'unique_product_color_image',
          message: 'Duplicate image detected with same product_id, color_name, and image_url',
          productId: product.id,
          imageRows: imageRows.map(row => ({
            product_id: row.product_id,
            color_name: row.color_name,
            image_url: row.image_url
          })),
          error: imgError
        });
      }
    }
  }

  const { error: delColorError } = await supabaseAdmin
    .from('product_colors')
    .delete()
    .eq('product_id', product.id);
  if (delColorError)
    console.error('Error deleting old product colors:', delColorError);

  const colorRows = [];
  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const colorData = product.images[color];
    colorRows.push({
      product_id: product.id,
      color_name: color,
      hex_code: colorData.hex,
      is_primary: colorIndex === 0,
      sort_order: colorIndex,
    });
  }
  if (colorRows.length > 0) {
    const { error: colorError } = await supabaseAdmin
      .from('product_colors')
      .insert(colorRows);
    if (colorError)
      console.error('Error inserting product colors:', colorError);
  }

  const { error: delTagError } = await supabaseAdmin
    .from('product_tags')
    .delete()
    .eq('product_id', product.id);
  if (delTagError)
    console.error('Error deleting old product tags:', delTagError);

  if (product.tags && product.tags.length > 0) {
    for (const tagName of product.tags) {
      let { data: tagData, error: tagFindError } = await supabaseAdmin
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .limit(1);

      let tagId: string | null = null;
      if (tagFindError || !tagData || tagData.length === 0) {
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

      const { error: linkError } = await supabaseAdmin
        .from('product_tags')
        .insert({
          product_id: product.id,
          tag_id: tagId,
        });
      if (linkError)
        console.error('Error linking product to tag:', linkError);
    }
  }

  // Handle sizes - delete old ones and insert new ones
  const { error: delSizeError } = await supabaseAdmin
    .from('product_sizes')
    .delete()
    .eq('product_id', product.id);
  if (delSizeError)
    console.error('Error deleting old product sizes:', delSizeError);

  if (product.sizes && product.sizes.length > 0) {
    const sizeRows = product.sizes.map(size => ({
      product_id: product.id,
      size_id: size.id,
    }));
    const { error: sizeError } = await supabaseAdmin
      .from('product_sizes')
      .insert(sizeRows);
    if (sizeError)
      console.error('Error linking product to sizes:', sizeError);
  }

  return product;
}
