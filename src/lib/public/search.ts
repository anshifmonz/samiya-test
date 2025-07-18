import { supabasePublic } from 'lib/supabasePublic';
import { type Product, type ProductFilters, type Size } from 'types/product';

async function searchProducts(
  query: string,
  filters?: ProductFilters,
): Promise<Omit<Product, 'description' | 'active'>[]> {
  const rpcArgs: Record<string, any> = {
    query_text: query || null,
    min_price: filters?.minPrice ?? null,
    max_price: filters?.maxPrice ?? null,
    category_name: (filters?.category && filters.category !== 'all') ? filters.category : null,
    colors: filters?.colors && filters.colors.length > 0 ? filters.colors : null,
    tags: filters?.tags && filters.tags.length > 0 ? filters.tags : null,
    is_active_param: true,
    limit_count: filters?.limit ?? 16,
    offset_count: filters?.offset ?? 0
  };

  const { data, error } = await supabasePublic.rpc('search_products_rpc', rpcArgs);

  if (error) {
    console.error('Error fetching products from Supabase RPC:', error);
    return [];
  }

  return (data || []).map((row: any) => {
    const images: Record<string, { hex: string; images: any[] }> = {};
    if (row.product_images) {
      const sortedImages = [...row.product_images].sort((a: any, b: any) => {
        if (a.color_name !== b.color_name) {
          if (a.color_name === row.primary_color) return -1;
          if (b.color_name === row.primary_color) return 1;
          return a.color_name.localeCompare(b.color_name);
        }
        return a.sort_order - b.sort_order;
      });
      sortedImages.forEach((img: any) => {
        if (!images[img.color_name]) {
          images[img.color_name] = {
            hex: img.hex_code || '######', // fallback to legacy support
            images: []
          };
        }
        images[img.color_name].images.push({ url: img.image_url, publicId: img.public_id });
      });
    }
    const tags: string[] = [];
    if (row.product_tags) {
      row.product_tags.forEach((pt: any) => {
        if (pt.tag?.name) {
          tags.push(pt.tag.name);
        }
      });
    }

    const sizes: Size[] = [];
    if (row.product_sizes) {
      row.product_sizes.forEach((size: any) => {
        sizes.push({
          id: size.id,
          name: size.name,
          description: size.description,
          sort_order: size.sort_order
        });
      });
    }
    return {
      id: row.id,
      title: row.title,
      images,
      price: Number(row.price),
      originalPrice: row.original_price,
      tags,
      category: row.category || '',
      sizes
    };
  });
}

export default searchProducts;
