import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Product } from '@/data/products';

interface NewProductInput {
  title: string;
  description: string;
  price: number;
  category: string; // category name, will need to resolve to category_id
  images: Record<string, string[]>;
  tags: string[];
}

export default async function createProduct(newProduct: NewProductInput): Promise<Product | null> {
  // 1. Find category_id by name
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('name', newProduct.category)
    .limit(1);
  if (catError || !categories || categories.length === 0) {
    console.error('Category not found:', catError);
    return null;
  }
  const category_id = categories[0].id;

  const { data: productData, error: prodError } = await supabaseAdmin
    .from('products')
    .insert({
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      category_id,
      is_active: true,
      primary_color: Object.keys(newProduct.images)[0] || null,
      primary_image_url: Object.values(newProduct.images)[0]?.[0] || null,
    })
    .select()
    .single();
  if (prodError || !productData) {
    console.error('Error inserting product:', prodError);
    return null;
  }

  const productId = productData.id;
  const imageRows = [];
  for (const [color, urls] of Object.entries(newProduct.images)) {
    urls.forEach((url, idx) => {
      imageRows.push({
        product_id: productId,
        color_name: color,
        image_url: url,
        is_primary: idx === 0,
        sort_order: idx,
      });
    });
  }
  if (imageRows.length > 0) {
    const { error: imgError } = await supabaseAdmin
      .from('product_images')
      .insert(imageRows);
    if (imgError) {
      console.error('Error inserting product images:', imgError);
    }
  }

  return {
    id: productId,
    title: productData.title,
    description: productData.description,
    images: newProduct.images,
    price: productData.price,
    tags: newProduct.tags,
    category: newProduct.category,
  };
}
