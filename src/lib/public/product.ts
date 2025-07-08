import { supabasePublic } from 'lib/supabasePublic';
import { type Product, type ProductFilters } from 'types/product';

async function searchProducts(query: string, filters?: ProductFilters): Promise<Omit<Product, 'description' | 'active'>[]> {
  let supabaseQuery = supabasePublic
    .from('products')
    .select(`
      id,
      title,
      price,
      primary_color,
      primary_image_url,
      category:categories(name),
      product_images:product_images(color_name,image_url,sort_order,is_primary),
      product_tags:product_tags(tag:tags(name))
    `)
    .eq('is_active', true);

  if (query)
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  if (filters?.minPrice !== undefined)
    supabaseQuery = supabaseQuery.gte('price', filters.minPrice);
  if (filters?.maxPrice !== undefined)
    supabaseQuery = supabaseQuery.lte('price', filters.maxPrice);

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  let products = (data || []).map((row: any) => {
    const images: Record<string, string[]> = {};
    if (row.product_images) {
      const sortedImages = row.product_images.sort((a: any, b: any) => {
        if (a.color_name !== b.color_name) {
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
      images,
      price: Number(row.price),
      tags,
      category: row.category?.name || '',
    };
  });

  if (filters?.category && filters.category !== 'all')
    products = products.filter(product => product.category === filters.category);

  if (filters?.colors && filters.colors.length > 0) {
    products = products.filter(product =>
      filters.colors!.some(color => Object.keys(product.images).includes(color))
    );
  }

  if (filters?.tags && filters.tags.length > 0) {
    products = products.filter(product =>
      filters.tags!.some(tag => product.tags.includes(tag))
    );
  }

  return products;
}

export default searchProducts;
