import { supabaseAdmin } from 'lib/supabase';
import { type Product, type Size } from 'types/product';

async function getProduct(
  limit: number,
  offset: number,
  query: string,
  sortBy: string,
  stock_filter: string | null
): Promise<{ products: Product[]; error: string | null; status: number }> {
  if (limit === undefined || typeof limit !== 'number' || limit <= 0)
    return { products: [], error: 'Limit is required and must be a positive number', status: 400 };
  if (offset === undefined || typeof offset !== 'number' || offset < 0)
    return {
      products: [],
      error: 'Offset is required and must be a non-negative number',
      status: 400
    };
  if (sortBy === undefined || typeof sortBy !== 'string')
    return { products: [], error: 'Sort by is required and must be a string', status: 400 };

  const { data, error } = await supabaseAdmin.rpc('get_products_rpc', {
    limit_count: limit,
    offset_count: offset,
    query_text: query,
    sort_by: sortBy,
    stock_filter
  });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return { products: [], error: 'Failed to fetch products', status: 500 };
  }

  const products = (data || []).map((row: any) => {
    const images: Record<string, { hex: string; images: any[]; sizes?: Size[] }> = {};
    const colorSizes: Record<string, Size[]> = {};

    if (row.product_images) {
      // sort images by color and then by sort_order
      const sortedImages = row.product_images.sort((a: any, b: any) => {
        if (a.color_name !== b.color_name) {
          // prioritize primary color first
          if (a.color_name === row.primary_color) return -1;
          if (b.color_name === row.primary_color) return 1;
          return a.color_name.localeCompare(b.color_name);
        }
        return a.sort_order - b.sort_order;
      });

      sortedImages.forEach((img: any) => {
        if (!images[img.color_name])
          images[img.color_name] = {
            hex: img.hex_code || '######', // fallback to legacy support
            images: []
          };
        const imageObj = { url: img.image_url, publicId: img.public_id };
        images[img.color_name].images.push(imageObj);
      });
    }

    // Process color-specific sizes from product_sizes
    if (row.product_sizes) {
      row.product_sizes.forEach((colorSizeData: any) => {
        const colorName = colorSizeData.color_name;
        const sizes = colorSizeData.sizes || [];

        // Store color-specific sizes with stock information
        colorSizes[colorName] = sizes.map((size: any) => ({
          id: size.id,
          name: size.name,
          description: size.description,
          sort_order: size.sort_order,
          stock_quantity: size.stock_quantity,
          low_stock_threshold: size.low_stock_threshold,
          is_in_stock: size.is_in_stock,
          is_low_stock: size.is_low_stock
        }));

        // Also store sizes in the color data for the images object
        if (images[colorName]) images[colorName].sizes = colorSizes[colorName];
      });
    }

    const tags: string[] = [];
    if (row.product_tags)
      row.product_tags.forEach((pt: any) => {
        if (pt.tag?.name) tags.push(pt.tag.name);
      });

    // Global fallback sizes - these are no longer used as the primary sizes
    // but kept for backward compatibility
    const globalSizes: Size[] = [];

    return {
      id: row.id,
      short_code: row.short_code,
      title: row.title,
      description: row.description,
      images,
      price: Number(row.price),
      originalPrice: row.original_price,
      tags,
      categoryId: row.category_id || '',
      sizes: globalSizes, // Global fallback sizes
      colorSizes, // Color-specific sizes mapping
      active: row.is_active
    };
  });

  return { products, error: null, status: 200 };
}

export default getProduct;
