import { supabaseAdmin } from '@/lib/supabase';
import { type Section, type SectionWithProducts } from '@/types/section';

export default async function getSections(): Promise<{ sections: Section[] | null, error: string | null, status?: number }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sections')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sections:', error);
      return { sections: null, error: 'Failed to fetch sections', status: 500 };
    }

    const transformedData: Section[] = (data || []).map((section: any) => ({
      id: section.id,
      title: section.title,
      isActive: section.is_active,
      sortOrder: section.sort_order,
      createdAt: section.created_at,
      updatedAt: section.updated_at
    }));

    return { sections: transformedData, error: null, status: 200 };
  } catch (error) {
    console.error('Error fetching sections:', error);
    return { sections: null, error: 'Internal server error', status: 500 };
  }
}

export async function getSectionsWithProducts(): Promise<{ sections: SectionWithProducts[] | null, error: string | null, status?: number }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sections_with_products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sections with products from view:', error);
      return { sections: null, error: 'Failed to fetch sections with products', status: 500 };
    }

    const sectionsWithProducts: SectionWithProducts[] = (data || []).map((section: any) => {
      const products = Array.isArray(section.products) ? section.products.map((product: any) => ({
        ...product,
        originalPrice: product.original_price,
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

    return { sections: sectionsWithProducts, error: null, status: 200 };
  } catch (error) {
    console.error('Error fetching sections with products:', error);
    return { sections: null, error: 'Internal server error', status: 500 };
  }
}
