import { NextRequest, NextResponse } from 'next/server';
import { products, Product, getProductById } from '@/data/products';

// In a real application, you would use a database
// For this example, we'll use in-memory storage
let productsData = [...products];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = productsData.find(p => p.id === params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get similar products from the same category
    const similarProducts = productsData
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return NextResponse.json({
      product,
      similarProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productData: Product = await request.json();
    
    const index = productsData.findIndex(p => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    productsData[index] = { ...productData, id: params.id };

    return NextResponse.json({
      product: productsData[index],
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = productsData.findIndex(p => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    productsData.splice(index, 1);

    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
