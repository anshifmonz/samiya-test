import { supabaseAdmin } from 'lib/supabase';
import { type SectionProduct } from 'types/section';
import { logAdminActivity } from 'utils/adminActivityLogger';

export async function getProducts(limit: number, offset: number, query?: string | null): Promise<{ products: any[], error: string | null, status: number }> {
  if (limit === undefined || typeof limit !== 'number' || limit <= 0)
    return { products: [], error: 'Limit is required and must be a positive number', status: 400 };
  if (offset === undefined || typeof offset !== 'number' || offset < 0)
    return { products: [], error: 'Offset is required and must be a non-negative number', status: 400 };

  let queryBuilder = supabaseAdmin
    .from('products')
    .select('id, title, price, primary_image_url');

  if (query && query.trim())
    queryBuilder = queryBuilder.ilike('title', `%${query.trim()}%`);

  const { data, error } = await queryBuilder
    .order('updated_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching section products:', error);
    return { products: [], error: 'Failed to fetch section products', status: 500 };
  }

  const products = data.map((product: any) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.primary_image_url
  }));

  return { products, error: null, status: 200 };
}

export async function addProductToSection(sectionId: string, productId: string, sortOrder?: number, adminUserId?: string, requestInfo = {}): Promise<{success: boolean, error: string | null, status: number}> {
  if (!sectionId || typeof sectionId !== 'string')
    return { success: false, error: 'Section ID is required and must be a string', status: 400 };
  if (!productId || typeof productId !== 'string')
    return { success: false, error: 'Product ID is required and must be a string', status: 400 };

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
    .insert({ section_id: sectionId, product_id: productId, sort_order: nextSortOrder });

  const success = !error;

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'create',
      entity_type: 'section',
      entity_id: sectionId,
      table_name: 'sections_products',
      message: `Added product ${productId} to section`,
      status: success ? 'success' : 'failed',
      metadata: { productId, sortOrder: nextSortOrder },
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error adding product to section:', error);
    return { success: false, error: 'Failed to add product to section', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}

export async function removeProductFromSection(sectionId: string, productId: string, adminUserId?: string, requestInfo = {}): Promise<{success: boolean, error: string | null, status: number}> {
  if (!sectionId || typeof sectionId !== 'string')
    return { success: false, error: 'Section ID is required and must be a string', status: 400 };
  if (!productId || typeof productId !== 'string')
    return { success: false, error: 'Product ID is required and must be a string', status: 400 };

  const { error } = await supabaseAdmin
    .from('sections_products')
    .delete()
    .eq('section_id', sectionId)
    .eq('product_id', productId);

  const success = !error;

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'delete',
      entity_type: 'section',
      entity_id: sectionId,
      table_name: 'sections_products',
      message: `Removed product ${productId} from section`,
      status: success ? 'success' : 'failed',
      metadata: { productId },
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error removing product from section:', error);
    return { success: false, error: 'Failed to remove product from section', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}

export async function updateProductOrder(sectionId: string, productId: string, sortOrder: number): Promise<{success: boolean, error: string | null, status: number}> {
  if (!sectionId || typeof sectionId !== 'string')
    return { success: false, error: 'Section ID is required and must be a string', status: 400 };
  if (!productId || typeof productId !== 'string')
    return { success: false, error: 'Product ID is required and must be a string', status: 400 };
  if (sortOrder === undefined || typeof sortOrder !== 'number')
    return { success: false, error: 'Sort order is required and must be a number', status: 400 };

  const { error } = await supabaseAdmin
    .from('sections_products')
    .update({ sort_order: sortOrder })
    .eq('section_id', sectionId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error updating product order:', error);
    return { success: false, error: 'Failed to update product order', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}

export async function getSectionProducts(sectionId: string): Promise<{products: SectionProduct[], error: string | null, status: number}> {
  if (!sectionId || typeof sectionId !== 'string')
    return { products: [], error: 'Section ID is required and must be a string', status: 400 };

  const { data, error } = await supabaseAdmin
    .from('sections_products')
    .select('*')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching section products:', error);
    return { products: [], error: 'Failed to fetch section products', status: 500 };
  }

  const products = (data || []).map(item => ({
    sectionId: item.section_id,
    productId: item.product_id,
    sortOrder: item.sort_order,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));

  return { products, error: null, status: 200 };
}

export async function reorderSectionProducts(sectionId: string, productIds: string[], adminUserId?: string, requestInfo = {}): Promise<{success: boolean, error: string | null, status: number}> {
  if (!sectionId || typeof sectionId !== 'string')
    return { success: false, error: 'Section ID is required and must be a string', status: 400 };
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0)
    return { success: false, error: 'Product IDs are required and must be a non-empty array', status: 400 };

  const { error } = await supabaseAdmin.rpc('reorder_section_products', {
    section_uuid: sectionId,
    product_ids_array: productIds
  });

  const success = !error;

  if (adminUserId) {
    await logAdminActivity({
      admin_id: adminUserId,
      action: 'update',
      entity_type: 'section',
      entity_id: sectionId,
      table_name: 'sections_products',
      message: `Reordered ${productIds.length} products in section`,
      status: success ? 'success' : 'failed',
      metadata: { productIds },
      ...requestInfo,
    });
  }

  if (error) {
    console.error('Error reordering section products:', error);
    return { success: false, error: 'Failed to reorder section products', status: 500 };
  }

  return { success: true, error: null, status: 200 };
}
