import { supabasePublic } from 'lib/supabasePublic';
import { type SearchProductRaw, type SearchResult, type ProductFilters, type Size } from 'types/product';

function calculateRelevanceScore(product: any, query: string): number {
  if (!query || query.trim() === '') return 0;

  const searchTerm = query.toLowerCase().trim();
  let score = 0;

  if (product.title) {
    const title = product.title.toLowerCase();
    if (title === searchTerm) {
      score += 100;
    } else if (title.includes(searchTerm)) {
      score += 80;
    } else if (title.split(' ').some((word: string) => word.includes(searchTerm))) {
      score += 60;
    }
  }

  if (product.description) {
    const description = product.description.toLowerCase();
    if (description.includes(searchTerm)) {
      score += 50;
    } else if (description.split(' ').some((word: string) => word.includes(searchTerm))) {
      score += 30;
    }
  }

  if (product.category_name) {
    const category = product.category_name.toLowerCase();
    if (category.includes(searchTerm)) score += 30;
  }

  if (product.product_tags && Array.isArray(product.product_tags))
    product.product_tags.forEach((tagObj: any) => {
      if (tagObj.tag?.name) {
        const tagName = tagObj.tag.name.toLowerCase();
        if (tagName.includes(searchTerm)) score += 20;
      }
    });

  return score;
}

async function searchProducts(
  query: string,
  filters?: ProductFilters,
): Promise<SearchResult> {
  const rpcArgs: Record<string, any> = {
    query_text: query || null,
    min_price: filters?.minPrice ?? null,
    max_price: filters?.maxPrice ?? null,
    category_name: (filters?.category && filters.category !== 'all') ? filters.category : null,
    colors: filters?.colors && filters.colors.length > 0 ? filters.colors : null,
    tags: filters?.tags && filters.tags.length > 0 ? filters.tags : null,
    is_active_param: true,
    limit_count: filters?.limit ?? 16,
    offset_count: filters?.offset ?? 0,
    sort_by: filters?.sortOrder || 'relevance'
  };

  const { data, error } = await supabasePublic.rpc('search_products_rpc', rpcArgs);

  if (error) {
    console.error('Error fetching products from Supabase RPC:', error);
    return { products: [], totalCount: 0 };
  }

  const totalCount = data.length > 0 ? data[0].total_count || 0 : 0;
  let rawProducts = data.map(({ total_count, ...product }) => product);

  // relevance scoring if there's a search query and sort is by relevance
  const sortBy = filters?.sortOrder || 'relevance';
  if (query && query.trim() !== '' && sortBy === 'relevance') {
    rawProducts = rawProducts.map(product => ({
      ...product,
      relevanceScore: calculateRelevanceScore(product, query)
    }));

    rawProducts.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore)
        return b.relevanceScore - a.relevanceScore;
      return (a.price || 0) - (b.price || 0);
    });
  }

  const products = (rawProducts || []).map((row: SearchProductRaw) => {
    const images: Record<string, { hex: string; images: any[] }> = {};
    const colorSizes: Record<string, Size[]> = {};

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
        if (!images[img.color_name])
          images[img.color_name] = {
            hex: img.hex_code || '######', // fallback to legacy support
            images: []
          };
        images[img.color_name].images.push({ url: img.image_url, publicId: img.public_id });
      });
    }

    // Process color-specific sizes if available
    if (row.color_sizes)
      row.color_sizes.forEach((cs: any) => {
        if (!colorSizes[cs.color_name]) colorSizes[cs.color_name] = [];
        colorSizes[cs.color_name].push({
          id: cs.size_id,
          name: cs.size_name,
          description: cs.size_description,
          sort_order: cs.size_sort_order
        });
      });

    const tags: string[] = [];
    if (row.product_tags)
      row.product_tags.forEach((pt: any) => {
        if (pt.tag?.name) tags.push(pt.tag.name);
      });

    const sizes: Size[] = [];
    if (row.product_sizes)
      row.product_sizes.forEach((size: any) => {
        sizes.push({
          id: size.id,
          name: size.name,
          description: size.description,
          sort_order: size.sort_order
        });
      });

    return {
      id: row.id,
      title: row.title,
      images,
      price: Number(row.price),
      originalPrice: row.original_price,
      tags,
      categoryId: row.category_id || '',
      sizes,
      colorSizes
    };
  });

  return { products, totalCount };
}

export default searchProducts;
