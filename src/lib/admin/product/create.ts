import { supabaseAdmin } from 'lib/supabase';
import type { Product, CreateProductData } from 'types/product';
import { generateImagePublicId } from 'utils/imageIdUtils';

export default async function createProduct(newProduct: CreateProductData): Promise<Product | null> {
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('id', newProduct.categoryId)
    .limit(1);
  if (catError || !categories || categories.length === 0) {
    console.error('Category not found:', catError);
    return null;
  }
  const category_id = categories[0].id;

  const colorKeys = Object.keys(newProduct.images);
  const primaryColor = colorKeys[0] || null;
  const primaryImageUrl = primaryColor ? newProduct.images[primaryColor]?.images[0]?.url || null : null;

  const { data: productData, error: prodError } = await supabaseAdmin
    .from('products')
    .insert({
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      original_price: newProduct.originalPrice ?? null,
      category_id,
      primary_color: primaryColor,
      primary_image_url: primaryImageUrl,
      is_active: newProduct.active,
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
    const colorData = newProduct.images[color];
    const images = colorData.images;

    const uniqueImages = new Map<string, any>();

    images.forEach((img, _) => {
      const imageUrl = typeof img === 'string' ? img : img.url;
      let publicId = typeof img === 'string' ? null : img.publicId;

      if (!imageUrl || imageUrl.trim() === '') return;
      if (!publicId || publicId.trim() === '')
        publicId = generateImagePublicId(imageUrl);

      const uniqueKey = `${productId}:${color}:${imageUrl}`;
      if (uniqueImages.has(uniqueKey)) return;

      const isPrimary = colorIndex === 0 && uniqueImages.size === 0; // First image overall is primary
      const imageRow = {
        product_id: productId,
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
          productId,
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

  const colorRows = [];
  for (let colorIndex = 0; colorIndex < colorKeys.length; colorIndex++) {
    const color = colorKeys[colorIndex];
    const colorData = newProduct.images[color];
    colorRows.push({
      product_id: productId,
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

  if (newProduct.tags && newProduct.tags.length > 0) {
    for (const tagName of newProduct.tags) {
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
          product_id: productId,
          tag_id: tagId,
        });
      if (linkError)
        console.error('Error linking product to tag:', linkError);
    }
  }

  // Handle sizes
  if (newProduct.sizes && newProduct.sizes.length > 0) {
    const sizeRows = newProduct.sizes.map(size => ({
      product_id: productId,
      size_id: size.id,
    }));
    const { error: sizeError } = await supabaseAdmin
      .from('product_sizes')
      .insert(sizeRows);
    if (sizeError)
      console.error('Error linking product to sizes:', sizeError);
  }

  return {
    id: productId,
    short_code: productData.short_code,
    title: productData.title,
    description: productData.description,
    images: newProduct.images,
    price: productData.price,
    originalPrice: productData.original_price,
    tags: newProduct.tags,
    categoryId: newProduct.categoryId,
    sizes: newProduct.sizes,
    active: newProduct.active,
  };
}
