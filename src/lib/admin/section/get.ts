import { supabaseAdmin } from '@/lib/supabase';
import { type Section, type SectionWithProducts } from '@/types/section';

export default async function getSections(): Promise<Section[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sections')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }

    const transformedData: Section[] = (data || []).map((section: any) => ({
      id: section.id,
      title: section.title,
      isActive: section.is_active,
      sortOrder: section.sort_order,
      createdAt: section.created_at,
      updatedAt: section.updated_at
    }));

    return transformedData;
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

export async function getSectionsWithProducts(): Promise<SectionWithProducts[]> {
  try {
    const { data, error } = await supabaseAdmin
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
