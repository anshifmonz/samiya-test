import { NextRequest, NextResponse } from 'next/server';
import { type Product } from '@/types/product';
import { products } from '@/data/products';

// In a real application, you would use a database
// For this example, we'll use in-memory storage
let productsData = [...products];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const colors = searchParams.get('colors');
    const tags = searchParams.get('tags');

    let filteredProducts = [...productsData];

    // Apply filters
    if (query) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }
    }

    if (colors) {
      const colorList = colors.split(',').filter(Boolean);
      if (colorList.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          colorList.some(color => Object.keys(product.images).includes(color))
        );
      }
    }

    if (tags) {
      const tagList = tags.split(',').filter(Boolean);
      if (tagList.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          tagList.some(tag => product.tags.includes(tag))
        );
      }
    }

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData: Omit<Product, 'id'> = await request.json();

    // Generate new ID
    const id = (Math.max(...productsData.map(p => parseInt(p.id))) + 1).toString();

    const newProduct: Product = {
      ...productData,
      id
    };

    productsData.push(newProduct);

    return NextResponse.json({
      product: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
