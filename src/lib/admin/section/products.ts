import { supabaseAdmin } from 'lib/supabase';
import { type SectionProduct } from 'types/section';

export async function addProductToSection(sectionId: string, productId: string, sortOrder?: number): Promise<void> {
  try {
    let nextSortOrder = sortOrder;
    if (nextSortOrder === undefined) {
      const { data: existingProducts } = await supabaseAdmin
        .from('sections_products')
        .select('sort_order')
        .eq('section_id', sectionId)
        .order('sort_order', { ascending: false })
        .limit(1);

      nextSortOrder = existingProducts && existingProducts.length > 0
        ? (existingProducts[0].sort_order || 0) + 1
        : 0;
    }

    const { error } = await supabaseAdmin
      .from('sections_products')
      .insert({
        section_id: sectionId,
        product_id: productId,
        sort_order: nextSortOrder
      });

    if (error) {
      console.error('Error adding product to section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding product to section:', error);
    throw error;
  }
}

export async function removeProductFromSection(sectionId: string, productId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('sections_products')
      .delete()
      .eq('section_id', sectionId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing product from section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error removing product from section:', error);
    throw error;
  }
}

export async function updateProductOrder(sectionId: string, productId: string, sortOrder: number): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('sections_products')
      .update({ sort_order: sortOrder })
      .eq('section_id', sectionId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error updating product order:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating product order:', error);
    throw error;
  }
}

export async function getSectionProducts(sectionId: string): Promise<SectionProduct[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sections_products')
      .select('*')
      .eq('section_id', sectionId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching section products:', error);
      throw error;
    }

    return (data || []).map(item => ({
      sectionId: item.section_id,
      productId: item.product_id,
      sortOrder: item.sort_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching section products:', error);
    return [];
  }
}

export async function reorderSectionProducts(sectionId: string, productIds: string[]): Promise<void> {
  try {
    const { error } = await supabaseAdmin.rpc('reorder_section_products', {
      section_uuid: sectionId,
      product_ids_array: productIds
    });

    if (error) {
      console.error('Error reordering section products:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error reordering section products:', error);
    throw error;
  }
}
