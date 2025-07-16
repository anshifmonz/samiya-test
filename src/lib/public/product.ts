import { supabasePublic } from 'lib/supabasePublic';
import { type Product } from 'types/product';

const getProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabasePublic.rpc('get_product_details_rpc', { product_id: id });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return null;
  }

  const images: Record<string, any[]> = {};
  if (data.product_images) {
    const sortedImages = data.product_images.sort((a: any, b: any) => {
      if (a.color_name !== b.color_name) {
        if (a.color_name === data.primary_color) return -1;
        if (b.color_name === data.primary_color) return 1;
        return a.color_name.localeCompare(b.color_name);
      }
      return a.sort_order - b.sort_order;
    });

    sortedImages.forEach((img: any) => {
      if (!images[img.color_name]) images[img.color_name] = [];
      images[img.color_name].push({ url: img.image_url, publicId: img.public_id });
    });
  }

  const tags: string[] = [];
  if (data.product_tags) {
    data.product_tags.forEach((pt: any) => {
      if (pt.tag?.name) {
        tags.push(pt.tag.name);
      }
    });
  }

  return {
    id: data.id,
    short_code: data.short_code,
    title: data.title,
    description: data.description,
    images,
    price: Number(data.price),
    originalPrice: data.original_price,
    tags,
    category: data.category?.name || '',
    active: data.is_active,
  };
}

export default getProduct;
