import { NextRequest, NextResponse } from 'next/server';
import { addProductToSection, getProducts, removeProductFromSection, reorderSectionProducts } from 'src/lib/admin/section/products';
import { getAdminContext } from 'utils/adminApiHelpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const query = searchParams.get('q');
  const limitNumber = limit ? parseInt(limit) : 16;
  const offsetNumber = offset ? parseInt(offset) : 0;

  const { products, error, status } =  await getProducts(limitNumber, offsetNumber, query);
  if (error) return NextResponse.json({ error }, { status: status || 500 });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  try {
    const { sectionId, productId, sortOrder } = await request.json();

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/products');
    const { success, error, status } = await addProductToSection(sectionId, productId, sortOrder, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error adding product to section:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const productId = searchParams.get('productId');

    if (!sectionId || !productId) {
      return NextResponse.json(
        { error: 'Section ID and Product ID are required' },
        { status: 400 }
      );
    }

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/products');
    const { success, error, status } =  await removeProductFromSection(sectionId, productId, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error removing product from section:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sectionId, productIds } = await request.json();

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/products');
    const { success, error, status } = await reorderSectionProducts(sectionId, productIds, adminUserId, requestInfo);
    if (error) return NextResponse.json({ error }, { status: status || 500 });
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Error reordering section products:', error);
    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
