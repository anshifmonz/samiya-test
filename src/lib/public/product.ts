import { supabasePublic } from '@/lib/supabasePublic';
import { type Product, type ProductFilters } from '@/types/product';

async function searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
  console.log('searchProducts', query, filters);
  let supabaseQuery = supabasePublic
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
      product_images:product_images(color_name,image_url,sort_order,is_primary),
      product_tags:product_tags(tag:tags(name))
    `)
    .eq('is_active', true);

  // Text search (title, description, tags)
  if (query) {
    // Use ilike for case-insensitive search on title and description
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // Category filter
  if (filters?.category && filters.category !== 'all') {
    // We assume category is the name, so we need to join with categories table
    // Supabase can't filter on joined table's name directly, so we fetch all and filter in JS below
  }

  // Price filters
  if (filters?.minPrice !== undefined) {
    supabaseQuery = supabaseQuery.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    supabaseQuery = supabaseQuery.lte('price', filters.maxPrice);
  }

  // Color filter (filter in JS after fetch)
  // Tags filter (filter in JS after fetch)

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return [];
  }

  let products = (data || []).map((row: any) => {
    const images: Record<string, string[]> = {};
    if (row.product_images) {
      // Sort images by color and then by sort_order to maintain proper ordering
      const sortedImages = row.product_images.sort((a: any, b: any) => {
        if (a.color_name !== b.color_name) {
          // Prioritize primary color first, then alphabetical
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
    };
  });

  // Category filter (including descendants, if needed)
  if (filters?.category && filters.category !== 'all') {
    // Only include products whose category matches the filter
    products = products.filter(product => product.category === filters.category);
    // If you want to include descendants, you need to fetch all categories and build the tree here
  }

  // Color filter
  if (filters?.colors && filters.colors.length > 0) {
    products = products.filter(product =>
      filters.colors!.some(color => Object.keys(product.images).includes(color))
    );
  }

  // Tags filter
  if (filters?.tags && filters.tags.length > 0) {
    products = products.filter(product =>
      filters.tags!.some(tag => product.tags.includes(tag))
    );
  }

  console.log('products', products);

  return products;
}

export default searchProducts;
