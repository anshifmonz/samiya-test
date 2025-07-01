import { supabase } from '@/lib/supabase';
import { type Product } from '@/types/product';

async function getActiveProductsFromSupabase(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      primary_color,
      primary_image_url,
      category_id,
      category:categories(name),
      product_images:product_images(color_name,image_url),
      product_tags:product_tags(tag:tags(name))
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => {
    const images: Record<string, string[]> = {};
    if (row.product_images) {
      row.product_images.forEach((img: any) => {
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
    };
  });
}

export default getActiveProductsFromSupabase;
