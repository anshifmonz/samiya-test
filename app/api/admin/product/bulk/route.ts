import { NextRequest, NextResponse } from 'next/server';
import createProduct from '@/lib/admin/product/create';
import { type Product } from '@/types/product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products }: { products: Omit<Product, 'id'>[] } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (products.length > 100) {
      return NextResponse.json(
        { error: 'Cannot import more than 100 products at once' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i];
        const createdProduct = await createProduct(product);
        if (!createdProduct)
          throw new Error('Failed to create product');
        results.push({
          index: i,
          success: true,
          product: createdProduct
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
      message: `Successfully imported ${successCount} products${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      results,
      errors,
      summary: {
        total: products.length,
        successful: successCount,
        failed: errorCount
      }
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
