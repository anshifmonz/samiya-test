import { NextRequest, NextResponse } from 'next/server';
import searchProducts from 'lib/public/product';
import { type Product } from 'types/product';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const colors = searchParams.get('colors');
  const tags = searchParams.get('tags');

  const minPriceNumber = minPrice ? parseInt(minPrice) : undefined;
  const maxPriceNumber = maxPrice ? parseInt(maxPrice) : undefined;
  const colorsArray = colors ? colors.split(',') : [];
  const tagsArray = tags ? tags.split(',') : [];

  const products: Omit<Product, 'description'>[] = await searchProducts(query, {
    category,
    minPrice: minPriceNumber,
    maxPrice: maxPriceNumber,
    colors: colorsArray,
    tags: tagsArray
  });

  return NextResponse.json(products);
}
