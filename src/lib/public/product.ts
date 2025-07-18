import { supabasePublic } from 'lib/supabasePublic';
import { type Product, type ProductColorData, type Size } from 'types/product';

const getProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabasePublic.rpc('get_product_details_rpc', { product_id: id });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return null;
  }

  const images: Record<string, ProductColorData> = {};
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
      if (!images[img.color_name]) {
        images[img.color_name] = {
          hex: img.hex_code || '######',
          images: []
        };
      }
      images[img.color_name].images.push({ url: img.image_url, publicId: img.public_id });
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

  const sizes: Size[] = [];
  if (data.product_sizes) {
    data.product_sizes.forEach((size: any) => {
      sizes.push({
        id: size.id,
        name: size.name,
        description: size.description,
        sort_order: size.sort_order
      });
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
    sizes,
    active: data.is_active,
  };
}

export default getProduct;
