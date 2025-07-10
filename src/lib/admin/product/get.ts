import { supabaseAdmin } from 'lib/supabase';
import { type Product } from 'types/product';

async function getProduct(limit: number, offset: number, query: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin.rpc('get_products_rpc', {
    limit_count: limit,
    offset_count: offset,
    query_text: query
  });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => {
    const images: Record<string, string[]> = {};
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
        if (!images[img.color_name]) images[img.color_name] = [];
        images[img.color_name].push(img.image_url);
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

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      images,
      price: Number(row.price),
      tags,
      category: row.category?.name || '',
      active: row.is_active,
    };
  });
}

export default getProduct;
