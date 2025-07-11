import { supabasePublic } from 'lib/supabasePublic';
import type { SectionWithProducts } from 'types/section';

async function getSectionsWithProducts(): Promise<SectionWithProducts[]> {
  try {
    const { data, error } = await supabasePublic
      .from('sections_with_products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sections with products from view:', error);
      return [];
    }

    const sectionsWithProducts: SectionWithProducts[] = (data || []).map((section: any) => {
      const products = Array.isArray(section.products) ? section.products.map((product: any) => ({
        ...product,
        images: product.images || ''
      })) : [];

      return {
        id: section.id,
        title: section.title,
        isActive: section.is_active,
        sortOrder: section.sort_order,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
        products: products
      };
    });

    return sectionsWithProducts;
  } catch (error) {
    console.error('Error fetching sections with products:', error);
    return [];
  }
}

export default getSectionsWithProducts;
