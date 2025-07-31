import { NextRequest, NextResponse } from 'next/server';
import { addProductToSection, getProducts, removeProductFromSection, reorderSectionProducts } from 'src/lib/admin/section/products';
import { getAdminContext } from 'utils/adminApiHelpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const query = searchParams.get('q');
    const limitNumber = limit ? parseInt(limit) : 16;
    const offsetNumber = offset ? parseInt(offset) : 0;

    const products = await getProducts(limitNumber, offsetNumber, query);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in GET /api/admin/section/products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sectionId, productId, sortOrder } = await request.json();

    if (!sectionId || !productId) {
      return NextResponse.json(
        { error: 'Section ID and Product ID are required' },
        { status: 400 }
      );
    }

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/products');
    await addProductToSection(sectionId, productId, sortOrder, adminUserId, requestInfo);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/admin/section/products:', error);
    return NextResponse.json(
      { error: 'Failed to add product to section' },
      { status: 500 }
    );
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
    await removeProductFromSection(sectionId, productId, adminUserId, requestInfo);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/section/products:', error);
    return NextResponse.json(
      { error: 'Failed to remove product from section' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sectionId, productIds } = await request.json();

    if (!sectionId || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Section ID and productIds array are required' },
        { status: 400 }
      );
    }

    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/section/products');
    await reorderSectionProducts(sectionId, productIds, adminUserId, requestInfo);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/admin/section/products:', error);
    return NextResponse.json(
      { error: 'Failed to reorder section products' },
      { status: 500 }
    );
  }
}
