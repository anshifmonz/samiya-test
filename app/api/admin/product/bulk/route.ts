import { NextRequest, NextResponse } from 'next/server';
import createProduct from 'lib/api/admin/product/create';
import { type CreateProductData } from 'types/product';
import { getAdminContext } from 'utils/adminApiHelpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products }: { products: CreateProductData[] } = body;
    const { adminUserId, requestInfo } = getAdminContext(request, '/api/admin/product/bulk');

    if (!products || !Array.isArray(products) || products.length === 0)
      return NextResponse.json(
        { error: 'Products array is required and must not be empty' },
        { status: 400 }
      );

    if (products.length > 100)
      return NextResponse.json(
        { error: 'Cannot import more than 100 products at once' },
        { status: 400 }
      );

    const results = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i];
        const { product: data, error } = await createProduct(product, adminUserId, requestInfo);
        if (error) throw new Error(error);
        results.push({
          index: i,
          success: true,
          product: data
        });
      } catch (error) {
        errors.push({
          index: i,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          product: products[i]
        });
      }
    }

    const successCount = results.length;
    const errorCount = errors.length;

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${successCount} products${
        errorCount > 0 ? `, ${errorCount} failed` : ''
      }`,
      results,
      errors,
      summary: {
        total: products.length,
        successful: successCount,
        failed: errorCount
      }
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
