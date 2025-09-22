import { createClient } from 'lib/supabase/server';
import { type Product, type ProductColorData, type Size } from 'types/product';

const getProduct = async (id: string, userId?: string): Promise<Product | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_product_details_rpc', {
      product_id: id,
      user_id: userId || null
    });
    if (error) throw new Error(`Error fetching products from Supabase: ${error.message}`);

    const images: Record<string, ProductColorData> = {};
    const colorSizes: Record<string, Size[]> = {};
    const colorIdMapping: Record<string, string> = {}; // Map color names to color IDs

    if (data?.product_images) {
      const sortedImages = data.product_images.sort((a: any, b: any) => {
        if (a.color_name !== b.color_name) {
          if (a.color_name === data.primary_color) return -1;
          if (b.color_name === data.primary_color) return 1;
          return a.color_name.localeCompare(b.color_name);
        }
        return a.sort_order - b.sort_order;
      });

      sortedImages.forEach((img: any) => {
        if (!images[img.color_name])
          images[img.color_name] = {
            hex: img.hex_code || '######',
            images: []
          };
        images[img.color_name].images.push({ url: img.image_url, publicId: img.public_id });
      });
    }

    if (data?.product_sizes)
      data.product_sizes.forEach((colorSizeData: any) => {
        const colorName = colorSizeData.color_name;
        const colorId = colorSizeData.color_id;
        const sizes = colorSizeData.sizes || [];

        // Store color ID mapping
        if (colorId) colorIdMapping[colorName] = colorId;

        // Store color-specific sizes with stock information and wishlist_id
        colorSizes[colorName] = sizes.map((size: any) => ({
          id: size.id,
          name: size.name,
          description: size.description,
          sort_order: size.sort_order,
          stock_quantity: size.stock_quantity,
          low_stock_threshold: size.low_stock_threshold,
          is_in_stock: size.is_in_stock,
          is_low_stock: size.is_low_stock,
          wishlist_id: size.wishlist_id || null
        }));

        // store sizes in the color data for the images object
        if (images[colorName]) images[colorName].sizes = colorSizes[colorName];
      });

    const tags: string[] = [];
    if (data?.product_tags)
      data.product_tags.forEach((pt: any) => {
        if (pt.tag?.name) tags.push(pt.tag.name);
      });

    return {
      id: data.id,
      short_code: data.short_code,
      title: data.title,
      description: data.description,
      images,
      price: Number(data.price),
      originalPrice: data.original_price,
      tags,
      categoryId: data.category_id || '',
      active: data.is_active,
      colorSizes,
      colorIdMapping
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export default getProduct;
